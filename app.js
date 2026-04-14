// =============================================
// GANTI dengan URL Google Spreadsheet Anda
// Cara: File > Share > Publish to web > CSV
// Format URL:
// https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=SHEET_GID
// =============================================
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFuz0kDDst0NIb9mzlj1vlQfDL2qANCXWNwczmFqn3dgVEUHV4WT0IrSU0fHLZJTdVdpVKSX9Zo3mE/pub?output=csv";

// Icon mapping berdasarkan nama kategori
const iconMap = {
  "kurikulum":    "fa-solid fa-chalkboard-user",
  "kepegawaian":  "fa-solid fa-person-chalkboard",
  "kesiswaan":    "fa-solid fa-user-graduate",
  "operator":     "fa-solid fa-gear",
  "kehumasan":    "fa-solid fa-circle-info",
  "sarpras":    "fa-solid fa-toolbox",
  "default":      "fa-solid fa-link"
};

function getIcon(name) {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(iconMap)) {
    if (key.includes(k)) return v;
  }
  return iconMap["default"];
}

// Parse CSV sederhana
function parseCSV(text) {
  const lines = text.trim().split("\n").map(l => l.trim()).filter(Boolean);
  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim().toLowerCase());
  return lines.slice(1).map(line => {
    // Handle koma dalam tanda kutip
    const cols = [];
    let cur = "", inQ = false;
    for (let c of line) {
      if (c === '"') { inQ = !inQ; continue; }
      if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ""; continue; }
      cur += c;
    }
    cols.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] || "");
    return obj;
  });
}

// Kelompokkan berdasarkan kolom "kategori"
function groupByCategory(rows) {
  const groups = {};
  rows.forEach(row => {
    const cat = row["kategori"] || "Lainnya";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(row);
  });
  return groups;
}

function renderLinks(groups) {
  const container = document.getElementById("links-container");
  container.innerHTML = "";

  Object.entries(groups).forEach(([category, items]) => {
    const isExternal = items.length === 1 && items[0]["url"];
    const wrapper = document.createElement("div");

    if (isExternal) {
      // Tombol langsung ke URL
      const a = document.createElement("a");
      a.href = items[0]["url"];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "link-btn";
      a.innerHTML = `
        <span class="btn-left">
          <i class="${getIcon(category)} btn-icon"></i>
          <span>${category}</span>
        </span>
        <i class="fa-solid fa-arrow-up-right-from-square btn-arrow"></i>
      `;
      wrapper.appendChild(a);
    } else {
      // Tombol dengan sub-menu dropdown
      const btn = document.createElement("div");
      btn.className = "link-btn";
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = `
        <span class="btn-left">
          <i class="${getIcon(category)} btn-icon"></i>
          <span>${category}</span>
        </span>
        <i class="fa-solid fa-chevron-right btn-arrow arrow-icon"></i>
      `;

      const submenu = document.createElement("div");
      submenu.className = "submenu";

      items.forEach(item => {
        if (!item["nama"] || !item["url"]) return;
        const sub = document.createElement("a");
        sub.href = item["url"];
        sub.target = "_blank";
        sub.rel = "noopener noreferrer";
        sub.className = "sub-btn";
        sub.innerHTML = `
          <span>${item["nama"]}</span>
          <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem;opacity:0.6"></i>
        `;
        submenu.appendChild(sub);
      });

      btn.addEventListener("click", () => {
        const isOpen = submenu.classList.toggle("open");
        btn.classList.toggle("active", isOpen);
        btn.setAttribute("aria-expanded", isOpen);
        const arrow = btn.querySelector(".arrow-icon");
        arrow.style.transform = isOpen ? "rotate(90deg)" : "rotate(0deg)";
      });

      wrapper.appendChild(btn);
      wrapper.appendChild(submenu);
    }

    container.appendChild(wrapper);
  });
}

async function loadData() {
  const container = document.getElementById("links-container");
  try {
    const res = await fetch(SHEET_URL);
    if (!res.ok) throw new Error("Gagal mengambil data");
    const text = await res.text();
    const rows = parseCSV(text);
    if (!rows.length) throw new Error("Data kosong");
    const groups = groupByCategory(rows);
    renderLinks(groups);
  } catch (err) {
    container.innerHTML = `<div class="error">⚠️ Gagal memuat data.<br><small>${err.message}</small></div>`;
    console.error(err);
  }
}

loadData();

// ── Sticky header: muncul setelah scroll melewati profile ──
const stickyHeader = document.querySelector(".sticky-header");
const profile = document.querySelector(".profile");

const observer = new IntersectionObserver(
  ([entry]) => {
    stickyHeader.classList.toggle("visible", !entry.isIntersecting);
  },
  { threshold: 0.1 }
);

if (profile) observer.observe(profile);
