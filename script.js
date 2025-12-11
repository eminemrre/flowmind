const attributeOptions = {
  hair_color: ["black", "brown", "blond", "red", "gray", "white", "dyed-multi"],
  skin_tone: [1, 2, 3, 4, 5, 6],
  height_cat: ["short", "average", "tall"],
  age_bucket: ["teen", "young-adult", "adult", "senior"],
  gender: ["female", "male", "non-binary", "unspecified"],
  body_type: ["slim", "average", "athletic", "curvy", "plus"],
  shoe_size_range: ["34-36", "37-39", "40-42", "43-45", "46+"],
  clothing_style: ["casual", "formal", "sporty", "streetwear", "business-casual", "traditional"],
  pose: ["front-facing", "3/4 view", "profile-left", "profile-right", "seated", "walking"],
  background: ["plain", "studio-soft", "outdoor-day", "indoor-office", "abstract"],
};

const form = document.getElementById("attributesForm");
const responseBox = document.getElementById("responseBox");
const chips = document.getElementById("chips");
const preview = document.getElementById("preview");
const previewHero = document.getElementById("previewHero");

const downloadBtn = document.getElementById("downloadBtn");
const copyJsonBtn = document.getElementById("copyJson");
const shuffleBtns = [document.getElementById("shuffleBtn"), document.getElementById("shuffleSecondary"), document.getElementById("shuffleTop")];
const resetBtn = document.getElementById("resetBtn");

function seedRandom(seed) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function populateSelects() {
  Object.entries(attributeOptions).forEach(([name, values]) => {
    const select = form.elements[name];
    if (!select) return;
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  });
}

function collectAttributes() {
  const data = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    if (!value) return;
    if (key === "clothing_style") {
      if (!data[key]) data[key] = [];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });
  // enforce max 2 clothing styles
  if (data.clothing_style && data.clothing_style.length > 2) {
    data.clothing_style = data.clothing_style.slice(0, 2);
  }
  return data;
}

function drawSynthetic(canvas, seed = Math.random() * 100000) {
  const ctx = canvas.getContext("2d");
  const rand = seedRandom(Math.floor(seed));
  const w = canvas.width;
  const h = canvas.height;
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  const baseHue = Math.floor(rand() * 360);
  gradient.addColorStop(0, `hsl(${baseHue}, 70%, 80%)`);
  gradient.addColorStop(1, `hsl(${(baseHue + 60) % 360}, 70%, 60%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillRect(w * 0.08, h * 0.08, w * 0.84, h * 0.84);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 20px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SYNTHETIC PLACEHOLDER", w / 2, h / 2 - 10);
  ctx.font = "16px Inter, system-ui, sans-serif";
  ctx.fillText(`Seed: ${Math.floor(seed)}`, w / 2, h / 2 + 20);
}

function toChipText(attrs) {
  return Object.entries(attrs).flatMap(([key, value]) => {
    if (key === "seed" || key === "size") return [];
    if (Array.isArray(value)) return value.map((v) => `${key}: ${v}`);
    return [`${key}: ${value}`];
  });
}

function renderChips(attrs) {
  chips.innerHTML = "";
  toChipText(attrs).forEach((text) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = text;
    chips.appendChild(chip);
  });
}

function mockApiResponse(attrs, seed) {
  return {
    id: `gen_${Math.floor(seed)}_${Date.now()}`,
    attributes: attrs,
    seed: Math.floor(seed),
    size: form.elements["size"].value,
    image_url: "data:image/png;base64,...",
    safety: { nsfw: false, policy_blocked: false },
    attribution: { synthetic: true, model: "demo-placeholder" },
    expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  };
}

function updatePreview(attrs) {
  const seed = attrs.seed ? Number(attrs.seed) : Math.floor(Math.random() * 999999);
  drawSynthetic(preview, seed);
  drawSynthetic(previewHero, seed + 1234);
  renderChips(attrs);
  const response = mockApiResponse(attrs, seed);
  responseBox.textContent = JSON.stringify(response, null, 2);
  responseBox.dataset.payload = JSON.stringify(response);
}

function gatherAndRender() {
  const attrs = collectAttributes();
  const seedInput = form.elements["seed"].value;
  if (seedInput) attrs.seed = seedInput;
  attrs.size = form.elements["size"].value;
  updatePreview(attrs);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  gatherAndRender();
});

shuffleBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    form.elements["seed"].value = "";
    gatherAndRender();
  })
);

resetBtn.addEventListener("click", () => {
  form.reset();
  gatherAndRender();
});

copyJsonBtn.addEventListener("click", async () => {
  const payload = responseBox.dataset.payload || responseBox.textContent;
  try {
    await navigator.clipboard.writeText(payload.trim());
    copyJsonBtn.textContent = "Kopyalandı";
    setTimeout(() => (copyJsonBtn.textContent = "API Yanıtını Kopyala"), 1400);
  } catch (err) {
    alert("Kopyalama başarısız. Tarayıcı izinlerini kontrol edin.");
  }
});

downloadBtn.addEventListener("click", () => {
  preview.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synthetic-preview.png";
    a.click();
    URL.revokeObjectURL(url);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  populateSelects();
  gatherAndRender();
});
