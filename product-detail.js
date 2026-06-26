const products = {
  "organic-crop-support": {
    title: "Organic Crop Support",
    category: "Organic Products",
    intro: "Clean, practical crop support for farmers working across seasonal crop cycles.",
    description:
      "Organic Crop Support is positioned for farmers who want an easy-to-understand organic agriculture input that supports crop vitality and practical field use.",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1100&q=84",
    pack: "As per product batch",
    best: "Seasonal field crops",
    benefits: [
      "Supports healthier crop development",
      "Useful for organic and sustainability-focused farming",
      "Simple product positioning for farmer communication",
      "Suitable for dealer-led field enquiries"
    ],
    usage: [
      "Use only as advised by the SOIL field or product team",
      "Follow crop stage and soil condition guidance",
      "Avoid mixing with unknown chemicals without advice"
    ],
    crops: ["Vegetables", "Pulses", "Cereals", "Seasonal crops"]
  },
  "plant-growth-nutrition": {
    title: "Plant Growth Nutrition",
    category: "Crop Nutrition",
    intro: "Balanced nutrition support for crop vigor, plant health, and stronger growth.",
    description:
      "Plant Growth Nutrition is created as a crop nutrition category product for growth support, plant vigor, and farmer-friendly yield assistance.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1100&q=84",
    pack: "As per product batch",
    best: "Growth-stage crops",
    benefits: [
      "Supports plant growth and crop vigor",
      "Helps communicate crop nutrition value clearly",
      "Useful for regular farmer and retailer enquiries",
      "Ready for catalogue expansion once final SKUs arrive"
    ],
    usage: [
      "Apply according to crop stage and expert recommendation",
      "Use correct dosage based on final product label",
      "Store in a dry and shaded place"
    ],
    crops: ["Paddy", "Wheat", "Maize", "Vegetables"]
  },
  "soil-improvement-range": {
    title: "Soil Improvement Range",
    category: "Soil Health",
    intro: "Soil vitality and root-zone support for long-term farm productivity.",
    description:
      "Soil Improvement Range focuses on soil health, root-zone care, and sustainable productivity so farmers can think beyond one-season output.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1100&q=84",
    pack: "As per product batch",
    best: "Soil health programs",
    benefits: [
      "Supports soil vitality and root-zone care",
      "Useful for sustainable agriculture positioning",
      "Works well for dealer/distributor education",
      "Helps farmers focus on long-term field condition"
    ],
    usage: [
      "Use after checking soil and crop condition",
      "Follow label dosage once final product is listed",
      "Keep away from direct moisture during storage"
    ],
    crops: ["All field crops", "Horticulture", "Vegetables", "Plantation crops"]
  },
  "farm-input-solutions": {
    title: "Farm Input Solutions",
    category: "Agri Inputs",
    intro: "Dealer-friendly agriculture input range for practical farm and market needs.",
    description:
      "Farm Input Solutions is a flexible product category for SOIL's upcoming agri-input catalogue, designed for easy enquiry and distributor conversations.",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1100&q=84",
    pack: "As per product batch",
    best: "Retail and distributor catalogue",
    benefits: [
      "Supports future product catalogue expansion",
      "Useful for retailers and distributors",
      "Clear enquiry path for product availability",
      "Can be updated with final product names and pack sizes"
    ],
    usage: [
      "Ask SOIL team for final product-wise usage guidance",
      "Use only as recommended for the crop and season",
      "Read label and safety details before field application"
    ],
    crops: ["Vegetables", "Grains", "Fruits", "Regional crops"]
  }
};

const params = new URLSearchParams(window.location.search);
const productKey = params.get("product") || "organic-crop-support";
const product = products[productKey] || products["organic-crop-support"];

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

document.title = `${product.title} | SOIL Product Details`;

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
