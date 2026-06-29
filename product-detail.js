const products = {
  "bio-fertilizers": {
    title: "Bio Fertilizers",
    category: "Bio Products",
    intro: "Scientifically developed bio-fertilizers that improve soil fertility naturally.",
    description:
      "SOIL bio-fertilizers increase beneficial microorganisms, enhance nutrient availability, support healthy plant growth, and help farmers reduce dependency on chemical fertilizers.",
    image: "assets/media/product-nitrogrow-front.jpeg",
    pack: "As per product label",
    best: "Soil fertility and crop nutrition support",
    benefits: [
      "Improves soil health and biological activity",
      "Enhances crop yield and nutrient absorption",
      "Reduces chemical fertilizer dependency",
      "Environment-friendly and safe for all crops"
    ],
    usage: [
      "Use according to final product label and crop stage",
      "Apply with guidance from SOIL technical or field team",
      "Store in a cool, dry, shaded place",
      "Avoid mixing with unknown chemicals without expert advice"
    ],
    crops: ["Cereals", "Pulses", "Vegetables", "Fruits", "Plantation crops"]
  },
  "organic-farming-solutions": {
    title: "Organic Farming Solutions",
    category: "Organic Farming",
    intro: "Practical guidance for farmers transitioning from chemical to sustainable organic farming.",
    description:
      "SOIL supports farmers with farm assessment, soil health analysis, crop nutrition planning, pest and disease guidance, and continuous field support for organic farming practices.",
    image: "assets/media/soil-root-glow.jpeg",
    pack: "Training and field support program",
    best: "Organic transition and sustainable crop planning",
    benefits: [
      "Farm assessment and soil health analysis",
      "Organic farming guidance and crop nutrition planning",
      "Pest and disease management support",
      "Continuous field guidance for farmer confidence"
    ],
    usage: [
      "Register farmer details and field requirements",
      "Conduct soil and crop condition assessment",
      "Prepare a crop-wise organic transition plan",
      "Follow SOIL technical guidance through the season"
    ],
    crops: ["Vegetable farming", "Fruit farming", "Horticulture", "Commercial crops"]
  },
  "chemical-residue-reduction": {
    title: "Chemical Residue Reduction Program",
    category: "Farmer Support",
    intro: "A structured transition program for gradual chemical residue reduction and soil restoration.",
    description:
      "SOIL understands that farmers cannot shift from chemical farming to organic farming overnight. This program uses scientific biological solutions and improved cultivation practices to gradually restore soil health.",
    image: "assets/media/dry-green-transition.jpeg",
    pack: "Structured support program",
    best: "Chemical-to-organic farming transition",
    benefits: [
      "Supports gradual chemical residue reduction",
      "Improves long-term soil fertility",
      "Encourages safer and more sustainable production",
      "Provides expert monitoring and field guidance"
    ],
    usage: [
      "Start with farmer registration and field assessment",
      "Follow recommended biological solutions and practices",
      "Monitor crop and soil response through the season",
      "Move step-by-step toward organic farming transition"
    ],
    crops: ["All field crops", "Oilseed crops", "Cereals", "Pulses", "Vegetables"]
  },
  "organic-crop-procurement": {
    title: "Organic Crop Procurement",
    category: "Market Linkage",
    intro: "Market linkage support for eligible organic produce grown under recommended SOIL practices.",
    description:
      "SOIL addresses one of the biggest farmer concerns: market availability. Eligible organic produce cultivated under recommended practices may receive procurement support subject to quality standards and company policies.",
    image: "assets/media/product-nitrogrow-farmer.jpeg",
    pack: "Subject to quality and procurement policy",
    best: "Organic produce market support",
    benefits: [
      "Creates farm-to-market support for eligible produce",
      "Encourages quality-focused organic farming",
      "Connects technical guidance with market opportunity",
      "Helps build sustainable income pathways for farmers"
    ],
    usage: [
      "Cultivate under recommended SOIL practices",
      "Maintain quality and traceability requirements",
      "Follow inspection and procurement policy guidance",
      "Coordinate with SOIL team for eligibility and process"
    ],
    crops: ["Organic vegetables", "Fruits", "Cereals", "Pulses", "Commercial crops"]
  }
};

const params = new URLSearchParams(window.location.search);
const productKey = params.get("product") || "bio-fertilizers";
const product = products[productKey] || products["bio-fertilizers"];

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

setText("[data-product-category]", product.category);
setText("[data-product-title]", product.title);
setText("[data-product-intro]", product.intro);
setText("[data-product-description]", product.description);
setText("[data-product-category-card]", product.category);
setText("[data-product-pack]", product.pack);
setText("[data-product-best]", product.best);

const image = document.querySelector("[data-product-image]");
if (image) {
  image.src = product.image;
  image.alt = product.title;
}

document.title = `${product.title} | SOIL Solution Details`;

const renderList = (selector, items) => {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
};

renderList("[data-product-benefits]", product.benefits);
renderList("[data-product-usage]", product.usage);

const crops = document.querySelector("[data-product-crops]");
if (crops) {
  crops.innerHTML = product.crops.map((crop) => `<span>${crop}</span>`).join("");
}
