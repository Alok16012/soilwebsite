const API_URL = "/.netlify/functions/admin-content";
const CONTENT_URL = "../data/site-content.json";
const passwordKey = "soil_admin_password";

const loginPanel = document.querySelector("[data-login-panel]");
const editorPanel = document.querySelector("[data-editor]");
const loginForm = document.querySelector("[data-login-form]");
const loginStatus = document.querySelector("[data-login-status]");
const editorStatus = document.querySelector("[data-editor-status]");
const fieldsRoot = document.querySelector("[data-fields]");
const saveButton = document.querySelector("[data-save]");
const refreshButton = document.querySelector("[data-refresh]");

let content = {};
let password = sessionStorage.getItem(passwordKey) || "";

const labels = {
  home: "Home Page",
  about: "About Page",
  solutions: "Solutions Page",
  dealer: "Dealer Page",
  gallery: "Gallery Page",
  contact: "Contact Page",
  productDetail: "Product Detail Page",
  hero: "Hero Section",
  intro: "Intro Section",
  heading: "Section Heading",
  supportHeading: "Support Heading",
  mediaHeading: "Media Heading",
  form: "Form Text",
  why: "Why Choose Section",
  items: "Solution Cards",
  sections: "Gallery Headings"
};

const titleCase = (value) =>
  labels[value] ||
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (letter) => letter.toUpperCase())
    .trim();

const getValue = (path) => path.reduce((current, key) => current?.[key], content);

const setValue = (path, value) => {
  const last = path[path.length - 1];
  const parent = path.slice(0, -1).reduce((current, key) => current[key], content);
  parent[last] = value;
};

const setStatus = (element, message, isError = false) => {
  element.textContent = message;
  element.classList.toggle("error", isError);
};

const apiPost = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, ...payload })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Unable to save changes");
  return result;
};

const uploadImage = async (file, path, input, preview) => {
  setStatus(editorStatus, "Uploading image...");
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
  const result = await apiPost({ action: "uploadImage", filename: file.name, dataUrl });
  setValue(path, result.path);
  input.value = result.path;
  preview.src = result.path;
  setStatus(editorStatus, "Image uploaded. Click Save Changes to publish text updates too.");
};

const createField = (path, key, value) => {
  const label = document.createElement("label");
  const isBody = key === "body";
  const isImage = key === "image";
  label.className = isBody || isImage ? "full" : "";
  label.textContent = titleCase(key);

  if (isBody) {
    const textarea = document.createElement("textarea");
    textarea.value = value || "";
    textarea.addEventListener("input", () => setValue(path, textarea.value));
    label.append(textarea);
    return label;
  }

  if (isImage) {
    label.classList.add("image-control");
    const preview = document.createElement("img");
    preview.src = value || "";
    preview.alt = "";
    const input = document.createElement("input");
    input.value = value || "";
    input.addEventListener("input", () => {
      setValue(path, input.value);
      preview.src = input.value;
    });
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.addEventListener("change", () => {
      if (file.files?.[0]) uploadImage(file.files[0], path, input, preview).catch((error) => setStatus(editorStatus, error.message, true));
    });
    label.append(preview, input, file);
    return label;
  }

  const input = document.createElement("input");
  input.value = value || "";
  input.addEventListener("input", () => setValue(path, input.value));
  label.append(input);
  return label;
};

const renderObjectFields = (object, basePath) => {
  const grid = document.createElement("div");
  grid.className = "field-grid";

  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === "object") return;
    grid.append(createField([...basePath, key], key, value));
  });

  return grid;
};

const renderGroup = (title, object, basePath) => {
  const group = document.createElement("section");
  group.className = "group";
  const heading = document.createElement("h2");
  heading.textContent = title;
  group.append(heading, renderObjectFields(object, basePath));
  return group;
};

const renderContent = () => {
  fieldsRoot.innerHTML = "";

  Object.entries(content).forEach(([pageKey, pageValue]) => {
    Object.entries(pageValue).forEach(([sectionKey, sectionValue]) => {
      if (Array.isArray(sectionValue)) {
        sectionValue.forEach((item, index) => {
          fieldsRoot.append(renderGroup(`${titleCase(pageKey)} / ${titleCase(sectionKey)} ${index + 1}`, item, [pageKey, sectionKey, index]));
        });
        return;
      }
      if (sectionValue && typeof sectionValue === "object") {
        fieldsRoot.append(renderGroup(`${titleCase(pageKey)} / ${titleCase(sectionKey)}`, sectionValue, [pageKey, sectionKey]));
      }
    });
  });
};

const loadContent = async () => {
  setStatus(editorStatus, "Loading content...");
  const response = await fetch(`${CONTENT_URL}?t=${Date.now()}`);
  content = await response.json();
  renderContent();
  setStatus(editorStatus, "Ready. Update text or upload images, then click Save Changes.");
};

const openEditor = async () => {
  loginPanel.hidden = true;
  editorPanel.hidden = false;
  await loadContent();
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  password = new FormData(loginForm).get("password");
  try {
    setStatus(loginStatus, "Checking password...");
    await apiPost({ action: "checkPassword" });
    sessionStorage.setItem(passwordKey, password);
    setStatus(loginStatus, "Login successful");
    openEditor().catch((error) => setStatus(editorStatus, error.message, true));
  } catch (error) {
    setStatus(loginStatus, error.message, true);
  }
});

saveButton.addEventListener("click", async () => {
  try {
    saveButton.disabled = true;
    setStatus(editorStatus, "Saving changes to GitHub...");
    await apiPost({ action: "saveContent", content });
    setStatus(editorStatus, "Saved. Netlify will redeploy the website in a moment.");
  } catch (error) {
    setStatus(editorStatus, error.message, true);
  } finally {
    saveButton.disabled = false;
  }
});

refreshButton.addEventListener("click", () => loadContent().catch((error) => setStatus(editorStatus, error.message, true)));

if (password) {
  apiPost({ action: "checkPassword" })
    .then(() => openEditor())
    .catch(() => sessionStorage.removeItem(passwordKey));
}
