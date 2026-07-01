const repo = process.env.GITHUB_REPO || "Alok16012/soilwebsite";
const branch = process.env.GITHUB_BRANCH || "main";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
const token = process.env.GITHUB_TOKEN;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

const githubRequest = async (path, options = {}) => {
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN in Netlify environment variables");
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "GitHub request failed");
  }
  return body;
};

const safeFilename = (filename) => {
  const clean = filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
  return `${Date.now()}-${clean || "soil-image.jpg"}`;
};

const putGithubFile = async ({ path, content, message, sha }) =>
  githubRequest(path, {
    method: "PUT",
    body: JSON.stringify({
      branch,
      message,
      content,
      ...(sha ? { sha } : {})
    })
  });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    if (payload.password !== adminPassword) {
      return json(401, { error: "Wrong password" });
    }

    if (payload.action === "checkPassword") {
      return json(200, { ok: true });
    }

    if (payload.action === "saveContent") {
      const current = await githubRequest(`data/site-content.json?ref=${branch}`);
      const content = Buffer.from(`${JSON.stringify(payload.content, null, 2)}\n`).toString("base64");
      await putGithubFile({
        path: "data/site-content.json",
        content,
        sha: current.sha,
        message: "Update website content from admin"
      });
      return json(200, { ok: true });
    }

    if (payload.action === "uploadImage") {
      const [, base64 = ""] = String(payload.dataUrl || "").split(",");
      if (!base64) return json(400, { error: "Missing image data" });

      const filename = safeFilename(payload.filename || "soil-image.jpg");
      const filePath = `assets/media/uploads/${filename}`;
      await putGithubFile({
        path: filePath,
        content: base64,
        message: `Upload ${filename} from admin`
      });
      return json(200, { ok: true, path: `/${filePath}` });
    }

    return json(400, { error: "Unknown action" });
  } catch (error) {
    return json(500, { error: error.message });
  }
};
