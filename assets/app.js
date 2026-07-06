/* WebP 轉換器邏輯（純前端，零依賴） */
(function () {
  "use strict";

  const t = (k, v) => window.i18n.t(k, v);

  const EXT = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
  const els = {
    drop: document.getElementById("drop"),
    file: document.getElementById("file"),
    inputCurrent: document.getElementById("inputCurrent"),
    outputCurrent: document.getElementById("outputCurrent"),
    fmtModal: document.getElementById("fmtModal"),
    fmtModalTitle: document.getElementById("fmtModalTitle"),
    fmtModalCards: document.getElementById("fmtModalCards"),
    quality: document.getElementById("quality"),
    qualityCtrl: document.getElementById("qualityCtrl"),
    list: document.getElementById("list"),
    pager: document.getElementById("pager"),
    explain: document.querySelector(".explain"),
    convertAll: document.getElementById("convertAll"),
    downloadAll: document.getElementById("downloadAll"),
    downloadAllGz: document.getElementById("downloadAllGz"),
    clear: document.getElementById("clear"),
  };

  /** @type {{id:number,file:File,srcURL:string,outBlob:Blob|null,outURL:string|null,el:HTMLElement,st:object}[]} */
  let items = [];
  let nextId = 1;

  // 清單分頁
  const PAGE_SIZE = 10;
  let page = 1;
  let showAll = false;

  const state = { input: "auto", output: "image/webp" };

  const INPUT_MATCH = {
    webp: { mimes: ["image/webp"], exts: [".webp"] },
    jpg:  { mimes: ["image/jpeg"], exts: [".jpg", ".jpeg"] },
    png:  { mimes: ["image/png"],  exts: [".png"] },
  };

  const fmtSize = (b) => b < 1024 ? b + " B"
    : b < 1048576 ? (b / 1024).toFixed(1) + " KB"
    : (b / 1048576).toFixed(2) + " MB";

  // ---- 格式選擇（單卡片 + 彈窗） ----
  const IMG = "assets/img/";
  const INPUT_FORMATS = [
    { id: "auto", img: IMG + "icon_auto.png", nameKey: "fmt.auto" },
    { id: "webp", img: IMG + "icon_webp.png", name: "WebP" },
    { id: "jpg",  img: IMG + "icon_jpg.png",  name: "JPG" },
    { id: "png",  img: IMG + "icon_png.png",  name: "PNG" },
  ];
  const OUTPUT_FORMATS = [
    { id: "image/webp", img: IMG + "icon_webp.png", name: "WebP" },
    { id: "image/jpeg", img: IMG + "icon_jpg.png",  name: "JPG" },
    { id: "image/png",  img: IMG + "icon_png.png",  name: "PNG" },
  ];

  // 輸入=輸出（同格式）時鎖住「開始轉換」；auto 不算具體格式，不受限
  const IN_TO_OUT = { webp: "image/webp", jpg: "image/jpeg", png: "image/png" };
  const isSameFormat = () => IN_TO_OUT[state.input] === state.output;

  const fmtLabel = (f) => f.nameKey ? t(f.nameKey) : f.name;
  const cardHTML = (f) => `<img class="ic-img" src="${f.img}" alt=""><span class="fmt-name">${fmtLabel(f)}</span>`;

  function renderCurrent() {
    els.inputCurrent.innerHTML = cardHTML(INPUT_FORMATS.find((f) => f.id === state.input));
    els.outputCurrent.innerHTML = cardHTML(OUTPUT_FORMATS.find((f) => f.id === state.output));
  }

  let modalTarget = null; // "input" | "output"

  function openModal(target) {
    modalTarget = target;
    const isInput = target === "input";
    els.fmtModalTitle.textContent = t(isInput ? "picker.chooseInput" : "picker.chooseOutput");
    const formats = isInput ? INPUT_FORMATS : OUTPUT_FORMATS;
    const cur = isInput ? state.input : state.output;
    els.fmtModalCards.innerHTML = "";
    formats.forEach((f) => {
      const b = document.createElement("button");
      b.className = "fmt-card" + (f.id === cur ? " active" : "");
      b.innerHTML = cardHTML(f);
      b.addEventListener("click", () => {
        if (isInput) {
          state.input = f.id;
        } else {
          state.output = f.id;
          updateQualityState();
        }
        renderCurrent();
        refreshButtons(); // 同格式時鎖住「開始轉換」
        closeModal();
      });
      els.fmtModalCards.appendChild(b);
    });
    els.fmtModal.hidden = false;
  }

  function closeModal() {
    els.fmtModal.hidden = true;
    modalTarget = null;
  }

  els.inputCurrent.addEventListener("click", () => openModal("input"));
  els.outputCurrent.addEventListener("click", () => openModal("output"));
  els.fmtModal.addEventListener("click", (e) => { if (e.target === els.fmtModal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !els.fmtModal.hidden) closeModal(); });

  function updateQualityState() {
    els.qualityCtrl.classList.toggle("disabled", state.output === "image/png");
  }

  // 品質偏好記憶（隱私模式可能封鎖儲存，故 try/catch）
  const QUALITY_KEY = "webp_quality";
  try {
    const saved = localStorage.getItem(QUALITY_KEY);
    if (saved && [...els.quality.options].some((o) => o.value === saved)) els.quality.value = saved;
  } catch (e) {}
  els.quality.addEventListener("change", () => {
    try { localStorage.setItem(QUALITY_KEY, els.quality.value); } catch (e) {}
  });

  // ---- file intake ----
  els.drop.addEventListener("click", () => els.file.click());
  els.file.addEventListener("change", (e) => { addFiles(e.target.files); els.file.value = ""; });

  // 整頁拖放：檔案拖進視窗任何位置都能加入
  let dragDepth = 0; // dragenter/leave 會在子元素間連環觸發，用計數器判斷是否真的離開視窗
  const hasFiles = (e) => e.dataTransfer && [...(e.dataTransfer.types || [])].includes("Files");

  document.addEventListener("dragenter", (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth++;
    document.body.classList.add("drag-active");
  });
  document.addEventListener("dragover", (e) => { if (hasFiles(e)) e.preventDefault(); });
  document.addEventListener("dragleave", (e) => {
    if (!hasFiles(e)) return;
    dragDepth--;
    if (dragDepth <= 0) { dragDepth = 0; document.body.classList.remove("drag-active"); }
  });
  document.addEventListener("drop", (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth = 0;
    document.body.classList.remove("drag-active");
    addFiles(e.dataTransfer.files);
  });

  function matchesInput(file) {
    if (state.input === "auto") return file.type.startsWith("image/");
    const m = INPUT_MATCH[state.input];
    const name = file.name.toLowerCase();
    return m.mimes.includes(file.type) || m.exts.some((ext) => name.endsWith(ext));
  }

  function addFiles(fileList) {
    let skipped = 0;
    for (const file of fileList) {
      if (!file.type.startsWith("image/")) continue;
      if (!matchesInput(file)) { skipped++; continue; }
      const item = {
        id: nextId++, file, srcURL: URL.createObjectURL(file),
        outBlob: null, outURL: null, el: null, st: { phase: "pending" },
      };
      items.push(item);
      renderItem(item);
    }
    if (skipped) alert(t("msg.skipped", { n: skipped, fmt: state.input.toUpperCase() }));
    if (!showAll) page = Math.max(1, Math.ceil(items.length / PAGE_SIZE)); // 跳到最新加入的那一頁
    renderList();
    refreshButtons();
  }

  function renderItem(item) {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <img class="thumb" src="${item.srcURL}" alt="">
      <div class="meta">
        <div class="name"></div>
        <div class="stats"></div>
      </div>
      <button class="btn btn-ghost dl" disabled></button>
      <button class="remove">×</button>`;
    row.querySelector(".name").textContent = item.file.name;
    row.querySelector(".dl").addEventListener("click", () => downloadItem(item));
    row.querySelector(".remove").addEventListener("click", () => removeItem(item));
    item.el = row; // 不直接 append，由 renderList() 依分頁決定顯示
    renderStats(item);
    localizeItem(item);
  }

  // ---- 清單分頁 ----
  function renderList() {
    els.explain.hidden = items.length > 0; // 清單有圖時收起說明區塊
    const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    if (page > pages) page = pages;
    els.list.innerHTML = "";
    const visible = showAll ? items : items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    visible.forEach((it) => els.list.appendChild(it.el));
    renderPager(pages);
  }

  // 頁碼收合：只顯示首頁、末頁、當前頁 ±1，其餘以「…」代替
  function pageWindow(total, cur) {
    const out = [];
    for (let p = 1; p <= total; p++) {
      if (p === 1 || p === total || Math.abs(p - cur) <= 1) out.push(p);
      else if (out[out.length - 1] !== "…") out.push("…");
    }
    return out;
  }

  function renderPager(pages) {
    els.pager.innerHTML = "";
    if (items.length <= PAGE_SIZE) return; // 一頁裝得下就不顯示分頁列

    const info = document.createElement("span");
    info.className = "pager-info";
    info.textContent = t("pager.info", { n: items.length, p: pages });
    els.pager.appendChild(info);

    for (const p of pageWindow(pages, page)) {
      if (p === "…") {
        const gap = document.createElement("span");
        gap.className = "page-gap";
        gap.textContent = "…";
        els.pager.appendChild(gap);
      } else {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "page-btn" + (!showAll && p === page ? " active" : "");
        b.textContent = p;
        b.addEventListener("click", () => { showAll = false; page = p; renderList(); });
        els.pager.appendChild(b);
      }
    }

    const all = document.createElement("button");
    all.type = "button";
    all.className = "page-btn page-all" + (showAll ? " active" : "");
    all.textContent = t("pager.showAll");
    all.addEventListener("click", () => { showAll = true; renderList(); });
    els.pager.appendChild(all);
  }

  // 依目前語言重繪單一項目的統計列
  function renderStats(item) {
    const st = item.st;
    const stats = item.el.querySelector(".stats");
    const orig = `${t("item.original")} ${fmtSize(item.file.size)}`;
    if (st.phase === "pending") {
      stats.innerHTML = `${orig} · <span class="status">${t("item.pending")}</span>`;
    } else if (st.phase === "converting") {
      stats.innerHTML = `${orig} · <span class="status">${t("item.converting")}</span>`;
    } else if (st.phase === "done") {
      const tag = st.diff <= 0
        ? `<span class="save">↓ ${t("item.saved")} ${Math.abs(st.pct)}%</span>`
        : `<span class="grow">↑ ${t("item.increased")} ${st.pct}%</span>`;
      stats.innerHTML = `${orig} → <b>${fmtSize(st.outSize)}</b> ${tag}`;
    } else if (st.phase === "failed") {
      stats.innerHTML = `<span class="status">❌ ${t("item.failed")}${st.err}</span>`;
    }
  }

  function localizeItem(item) {
    const dl = item.el.querySelector(".dl");
    dl.textContent = t("btn.download");
    dl.disabled = !item.outBlob;
    item.el.querySelector(".remove").title = t("item.remove");
  }

  function removeItem(item) {
    URL.revokeObjectURL(item.srcURL);
    if (item.outURL) URL.revokeObjectURL(item.outURL);
    items = items.filter((x) => x !== item);
    renderList(); // 重新渲染當前頁（自動校正頁碼）
    refreshButtons();
  }

  function refreshButtons() {
    const has = items.length > 0;
    const anyDone = items.some((x) => x.outBlob);
    const same = isSameFormat();
    els.convertAll.disabled = !has || same;
    els.convertAll.title = same ? t("picker.sameFmt") : "";
    els.clear.disabled = !has;
    els.downloadAll.disabled = !anyDone;
    els.downloadAllGz.disabled = !anyDone;
  }

  // ---- conversion ----
  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(t("err.load"))); // onerror 給的是事件物件，需包成 Error 才有 message
      img.src = url;
    });
  }

  async function convertItem(item) {
    const type = state.output;
    const quality = els.quality.value / 100;
    item.st = { phase: "converting" };
    renderStats(item);
    try {
      const img = await loadImage(item.srcURL);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => b ? res(b) : rej(new Error("toBlob failed")), type, quality));

      if (item.outURL) URL.revokeObjectURL(item.outURL);
      item.outBlob = blob;
      item.outURL = URL.createObjectURL(blob);

      const diff = blob.size - item.file.size;
      item.st = { phase: "done", outSize: blob.size, diff, pct: Number(((diff / item.file.size) * 100).toFixed(0)) };
      renderStats(item);
      item.el.querySelector(".dl").disabled = false;
    } catch (err) {
      item.st = { phase: "failed", err: err.message };
      renderStats(item);
    }
  }

  async function convertAll() {
    els.convertAll.disabled = true;
    for (const item of items) await convertItem(item);
    els.convertAll.disabled = false;
    refreshButtons();
  }

  function outName(item) {
    const base = item.file.name.replace(/\.[^.]+$/, "");
    return base + "." + EXT[state.output];
  }

  function downloadItem(item) {
    if (!item.outBlob) return;
    const a = document.createElement("a");
    a.href = item.outURL;
    a.download = outName(item);
    a.click();
  }

  // ---- minimal ZIP writer (store / no compression) ----
  function crc32(bytes) {
    if (!crc32.table) {
      const tbl = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        tbl[n] = c >>> 0;
      }
      crc32.table = tbl;
    }
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = crc32.table[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function buildZip(files) {
    const enc = new TextEncoder();
    const parts = [], central = [];
    let offset = 0;
    for (const f of files) {
      const nameBytes = enc.encode(f.name);
      const crc = crc32(f.data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true);
      lh.setUint16(4, 20, true);
      lh.setUint16(6, 0x0800, true);   // flag: UTF-8 filenames
      lh.setUint16(8, 0, true);        // method: store
      lh.setUint32(14, crc, true);
      lh.setUint32(18, f.data.length, true);
      lh.setUint32(22, f.data.length, true);
      lh.setUint16(26, nameBytes.length, true);
      parts.push(new Uint8Array(lh.buffer), nameBytes, f.data);

      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true);
      ch.setUint16(4, 20, true);
      ch.setUint16(6, 20, true);
      ch.setUint16(8, 0x0800, true);
      ch.setUint16(10, 0, true);
      ch.setUint32(16, crc, true);
      ch.setUint32(20, f.data.length, true);
      ch.setUint32(24, f.data.length, true);
      ch.setUint16(28, nameBytes.length, true);
      ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), nameBytes);
      offset += 30 + nameBytes.length + f.data.length;
    }
    const centralSize = central.reduce((s, c) => s + c.length, 0);
    const eocd = new DataView(new ArrayBuffer(22));
    eocd.setUint32(0, 0x06054b50, true);
    eocd.setUint16(8, files.length, true);
    eocd.setUint16(10, files.length, true);
    eocd.setUint32(12, centralSize, true);
    eocd.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(eocd.buffer)], { type: "application/zip" });
  }

  async function collectFiles() {
    const done = items.filter((x) => x.outBlob);
    const used = new Map();
    const files = [];
    for (const item of done) {
      let name = outName(item);
      if (used.has(name)) {
        const n = used.get(name) + 1;
        used.set(name, n);
        const dot = name.lastIndexOf(".");
        name = name.slice(0, dot) + "(" + n + ")" + name.slice(dot);
      } else {
        used.set(name, 0);
      }
      const buf = await item.outBlob.arrayBuffer();
      files.push({ name, data: new Uint8Array(buf) });
    }
    return files;
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadAll() {
    const files = await withBusy(els.downloadAll, collectFiles);
    if (!files.length) return;
    triggerDownload(buildZip(files), "webp-converted.zip");
  }

  // ---- TAR + GZIP ----
  function tarOctal(header, offset, len, val) {
    const s = val.toString(8).padStart(len - 1, "0");
    for (let i = 0; i < s.length; i++) header[offset + i] = s.charCodeAt(i);
    header[offset + len - 1] = 0;
  }

  function buildTar(files) {
    const enc = new TextEncoder();
    const parts = [];
    for (const f of files) {
      const header = new Uint8Array(512);
      header.set(enc.encode(f.name).slice(0, 100), 0);
      tarOctal(header, 100, 8, 0o644);
      tarOctal(header, 108, 8, 0);
      tarOctal(header, 116, 8, 0);
      tarOctal(header, 124, 12, f.data.length);
      tarOctal(header, 136, 12, 0);
      for (let i = 148; i < 156; i++) header[i] = 0x20;
      header[156] = 0x30;
      header.set(enc.encode("ustar\0"), 257);
      header.set(enc.encode("00"), 263);
      let sum = 0;
      for (let i = 0; i < 512; i++) sum += header[i];
      const cs = sum.toString(8).padStart(6, "0");
      for (let i = 0; i < 6; i++) header[148 + i] = cs.charCodeAt(i);
      header[154] = 0; header[155] = 0x20;
      parts.push(header, f.data);
      const rem = f.data.length % 512;
      if (rem) parts.push(new Uint8Array(512 - rem));
    }
    parts.push(new Uint8Array(1024));
    return new Blob(parts);
  }

  async function gzipBlob(blob) {
    const stream = blob.stream().pipeThrough(new CompressionStream("gzip"));
    return await new Response(stream).blob();
  }

  async function downloadAllGz() {
    if (typeof CompressionStream === "undefined") {
      alert(t("msg.noGzip"));
      return;
    }
    const result = await withBusy(els.downloadAllGz, async () => {
      const files = await collectFiles();
      if (!files.length) return null;
      return await gzipBlob(buildTar(files));
    });
    if (result) triggerDownload(result, "webp-converted.tar.gz");
  }

  // 執行期間鎖定按鈕；完成後依 data-i18n 還原文字
  // 只動文字節點：按鈕內可能有 icon <img>，不能用 btn.textContent 整個蓋掉
  async function withBusy(btn, fn) {
    const label = btn.querySelector("[data-i18n]") || btn;
    const key = label.dataset.i18n;
    btn.disabled = true;
    label.textContent = t("msg.packing");
    try {
      return await fn();
    } finally {
      label.textContent = t(key);
      btn.disabled = false;
    }
  }

  els.convertAll.addEventListener("click", convertAll);
  els.downloadAll.addEventListener("click", downloadAll);
  els.downloadAllGz.addEventListener("click", downloadAllGz);
  els.clear.addEventListener("click", () => {
    if (!items.length) return;
    if (!confirm(t("msg.confirmReset"))) return; // 重設前二次確認
    items.forEach((x) => { URL.revokeObjectURL(x.srcURL); if (x.outURL) URL.revokeObjectURL(x.outURL); });
    items = [];
    page = 1;
    showAll = false;
    renderList();
    refreshButtons();
  });

  // 語言切換時，重繪動態產生的項目（靜態文字由 i18n.js 處理）
  window.addEventListener("i18n:changed", () => {
    items.forEach((item) => { renderStats(item); localizeItem(item); });
    renderPager(Math.max(1, Math.ceil(items.length / PAGE_SIZE))); // 「顯示全部」按鈕文字換語言
    renderCurrent();
    refreshButtons(); // 「開始轉換」的同格式提示文字也要換語言
    if (modalTarget) openModal(modalTarget); // 彈窗開著時同步換語言
  });

  renderCurrent();
  updateQualityState();
})();
