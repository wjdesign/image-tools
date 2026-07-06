/* 多語系字典 + 切換引擎（零依賴，純前端） */
(function () {
  "use strict";

  const LANGS = [
    { code: "zh-TW", label: "繁體中文", flag: "assets/img/locales/zh-tw.png" },
    { code: "zh-CN", label: "简体中文", flag: "assets/img/locales/zh-cn.png" },
    { code: "en",    label: "English",  flag: "assets/img/locales/en.png" },
    { code: "ja",    label: "日本語",   flag: "assets/img/locales/jp.png" },
  ];

  const DICT = {
    "zh-TW": {
      "site.name": "WebP 圖片轉換器",
      "nav.converter": "轉換工具",
      "nav.privacy": "隱私權政策",
      "nav.terms": "使用條款",

      "title.converter": "WebP 轉換器｜WebP 轉 JPG、PNG 免費線上工具（100% 本地處理）",
      "title.privacy": "隱私權政策 — WebP 圖片轉換器",
      "title.terms": "使用條款 — WebP 圖片轉換器",

      "app.badge": "● 100% 本地處理，圖片不會上傳",
      "app.subtitle": "WebP ⇄ JPG / PNG 互轉，支援批次、品質調整。所有運算都在你的瀏覽器完成。",
      "picker.input": "輸入格式",
      "picker.output": "輸出格式",
      "picker.chooseInput": "選擇輸入格式",
      "picker.chooseOutput": "選擇輸出格式",
      "picker.sameFmt": "輸入與輸出不能是同一種格式",
      "fmt.auto": "自動",
      "quality.q100": "100% - 原始品質",
      "quality.q80": "80% - 優質壓縮",
      "quality.q60": "60% - 些微壓縮",
      "quality.q40": "40% - 高效壓縮",
      "quality.q20": "20% - 極大壓縮",
      "drop.title": "拖放圖片到這裡，或點擊選擇檔案",
      "drop.overlay": "放開滑鼠，加入圖片",
      "drop.hint": "支援 JPG、PNG、WebP、GIF、BMP 等，可一次多張",
      "btn.convertAll": "開始轉換",
      "btn.downloadZip": "下載全部 (ZIP)",
      "btn.downloadTarGz": "下載全部 (TAR.GZ)",
      "btn.clear": "重設",
      "btn.download": "下載",
      "item.remove": "移除",
      "item.original": "原始",
      "item.pending": "待轉換",
      "item.converting": "轉換中…",
      "item.saved": "省下",
      "item.increased": "增加",
      "item.failed": "失敗：",
      "msg.packing": "打包中…",
      "msg.skipped": "已略過 {n} 個檔案，因為不符合所選的輸入格式（{fmt}）。",
      "msg.noGzip": "你的瀏覽器不支援 CompressionStream，無法產生 GZIP。請改用「下載全部 (ZIP)」。",
      "msg.confirmReset": "確定要重設嗎？清單中的所有圖片與轉換結果將被清除。",
      "pager.showAll": "顯示全部",
      "explain.title": "壓縮原理說明",
      "explain.step1": "原始圖檔",
      "explain.step1d": "PNG / JPG / WebP",
      "explain.step2": "解碼為像素",
      "explain.step2d": "還原成未壓縮的點陣資料",
      "explain.step3": "重新編碼",
      "explain.step3d": "以所選格式與品質重新壓縮",
      "explain.step4": "輸出新檔案",
      "explain.step4d": "檔名不變，僅更換副檔名",
      "explain.whyTitle": "為什麼檔案有時反而變大？",
      "explain.r1t": "品質 100% 是無損模式",
      "explain.r1": "瀏覽器在品質 100% 時會改用無損編碼，檔案通常明顯較大。想縮小檔案，建議選 80%。",
      "explain.r2t": "原檔已經被最佳化",
      "explain.r2": "許多 PNG 已使用調色盤或壓縮工具（如 TinyPNG）優化，重新編碼會失去這些優勢。",
      "explain.r3t": "小圖的固定開銷",
      "explain.r3": "極小的圖檔中，格式本身的固定資料佔比很高，轉換後容易不減反增。",
      "explain.tip": "💡 想要最划算的壓縮，選擇 80% 品質；若轉換後變大，清單會以紅色「↑」提醒你。",
      "err.load": "圖片載入失敗，檔案可能已損毀或格式不支援",
      "foot.tech": "純前端工具・使用瀏覽器 Canvas API・可完全離線運行",
      "foot.techLink": "技術原理：canvas.toBlob()",
      "foot.copyright": "本工具在你的裝置本地執行，不會上傳任何圖片。",

      "privacy.updated": "最後更新：2026 年 7 月 6 日",
      "privacy.h.intro": "概述",
      "privacy.p.intro": "本工具是一個純前端（客戶端）的圖片轉換器。所有轉換都在你的瀏覽器中完成，你的圖片檔案永遠不會被上傳到任何伺服器。",
      "privacy.h.collect": "我們收集哪些資料",
      "privacy.p.collect": "我們不會收集、儲存或傳輸任何個人資料或圖片。本工具沒有帳號系統、不使用追蹤性 Cookie、也沒有任何識別你身分的分析工具。你選擇的圖片僅存在於你當下的瀏覽器分頁中，關閉即消失。",
      "privacy.h.local": "本機儲存",
      "privacy.p.local": "本網站僅會在你的瀏覽器 localStorage 中儲存你選擇的「語言偏好」與「品質設定」。這些資料只留在你的裝置上，不會傳送到任何地方。",
      "privacy.h.third": "第三方服務",
      "privacy.p.third": "本工具不會將你的檔案傳送給任何第三方。若本站託管於 GitHub Pages 等平台，該平台可能依其自身政策記錄一般的伺服器連線資訊（例如 IP 位址），此部分不在本工具控制範圍內。",
      "privacy.h.children": "兒童隱私",
      "privacy.p.children": "本工具不會刻意收集任何人的個人資料，包含兒童在內。",
      "privacy.h.changes": "政策變更",
      "privacy.p.changes": "我們可能會不定期更新本政策，更新內容將直接公布於本頁面。",
      "privacy.h.contact": "聯絡方式",
      "privacy.p.contact": "如對本政策有任何疑問，歡迎透過本專案的 GitHub 儲存庫與我們聯繫。",

      "terms.updated": "最後更新：2026 年 7 月 6 日",
      "terms.h.accept": "接受條款",
      "terms.p.accept": "使用本工具即表示你同意本使用條款。若你不同意，請勿使用本工具。",
      "terms.h.service": "服務說明",
      "terms.p.service": "本工具是一個免費的線上圖片格式轉換器，所有處理皆在使用者的瀏覽器本地完成。本服務以「現狀」提供，我們不保證其持續可用性或無中斷。",
      "terms.h.user": "使用者責任",
      "terms.p.user": "你必須擁有你所轉換圖片的合法權利，並自行負責轉換結果的使用方式。你不得利用本工具從事任何違法或侵害他人權利的行為。",
      "terms.h.ip": "智慧財產權",
      "terms.p.ip": "你上傳處理的圖片其權利仍屬於你。本工具的程式碼與介面設計則屬於其各自的作者所有。",
      "terms.h.warranty": "免責聲明",
      "terms.p.warranty": "本工具以「現狀」及「現有」基礎提供，不附帶任何明示或默示的擔保，包括但不限於適售性、特定用途適用性及轉換結果之正確性。",
      "terms.h.liability": "責任限制",
      "terms.p.liability": "在法律允許的最大範圍內，對於因使用或無法使用本工具所導致的任何直接、間接、附帶或衍生性損害（包含資料遺失），我們概不負責。",
      "terms.h.changes": "條款變更",
      "terms.p.changes": "我們可能隨時修訂本條款，修訂後的內容將公布於本頁面，並自公布時起生效。",
    },

    "zh-CN": {
      "site.name": "WebP 图片转换器",
      "nav.converter": "转换工具",
      "nav.privacy": "隐私政策",
      "nav.terms": "使用条款",

      "title.converter": "WebP 转换器｜WebP 转 JPG、PNG 免费在线工具（100% 本地处理）",
      "title.privacy": "隐私政策 — WebP 图片转换器",
      "title.terms": "使用条款 — WebP 图片转换器",

      "app.badge": "● 100% 本地处理，图片不会上传",
      "app.subtitle": "WebP ⇄ JPG / PNG 互转，支持批量、质量调整。所有运算都在你的浏览器完成。",
      "picker.input": "输入格式",
      "picker.output": "输出格式",
      "picker.chooseInput": "选择输入格式",
      "picker.chooseOutput": "选择输出格式",
      "picker.sameFmt": "输入与输出不能是同一种格式",
      "fmt.auto": "自动",
      "quality.q100": "100% - 原始质量",
      "quality.q80": "80% - 优质压缩",
      "quality.q60": "60% - 些微压缩",
      "quality.q40": "40% - 高效压缩",
      "quality.q20": "20% - 极大压缩",
      "drop.title": "拖放图片到这里，或点击选择文件",
      "drop.overlay": "松开鼠标，添加图片",
      "drop.hint": "支持 JPG、PNG、WebP、GIF、BMP 等，可一次多张",
      "btn.convertAll": "开始转换",
      "btn.downloadZip": "下载全部 (ZIP)",
      "btn.downloadTarGz": "下载全部 (TAR.GZ)",
      "btn.clear": "重置",
      "btn.download": "下载",
      "item.remove": "移除",
      "item.original": "原始",
      "item.pending": "待转换",
      "item.converting": "转换中…",
      "item.saved": "节省",
      "item.increased": "增加",
      "item.failed": "失败：",
      "msg.packing": "打包中…",
      "msg.skipped": "已跳过 {n} 个文件，因为不符合所选的输入格式（{fmt}）。",
      "msg.noGzip": "你的浏览器不支持 CompressionStream，无法生成 GZIP。请改用“下载全部 (ZIP)”。",
      "msg.confirmReset": "确定要重置吗？列表中的所有图片与转换结果将被清除。",
      "pager.showAll": "显示全部",
      "explain.title": "压缩原理说明",
      "explain.step1": "原始图片",
      "explain.step1d": "PNG / JPG / WebP",
      "explain.step2": "解码为像素",
      "explain.step2d": "还原成未压缩的位图数据",
      "explain.step3": "重新编码",
      "explain.step3d": "以所选格式与质量重新压缩",
      "explain.step4": "输出新文件",
      "explain.step4d": "文件名不变，仅更换扩展名",
      "explain.whyTitle": "为什么文件有时反而变大？",
      "explain.r1t": "质量 100% 是无损模式",
      "explain.r1": "浏览器在质量 100% 时会改用无损编码，文件通常明显较大。想缩小文件，建议选 80%。",
      "explain.r2t": "原文件已经被优化",
      "explain.r2": "许多 PNG 已使用调色板或压缩工具（如 TinyPNG）优化，重新编码会失去这些优势。",
      "explain.r3t": "小图的固定开销",
      "explain.r3": "极小的图片文件中，格式本身的固定数据占比很高，转换后容易不减反增。",
      "explain.tip": "💡 想要最划算的压缩，选择 80% 质量；若转换后变大，列表会以红色“↑”提醒你。",
      "err.load": "图片加载失败，文件可能已损坏或格式不支持",
      "foot.tech": "纯前端工具・使用浏览器 Canvas API・可完全离线运行",
      "foot.techLink": "技术原理：canvas.toBlob()",
      "foot.copyright": "本工具在你的设备本地运行，不会上传任何图片。",

      "privacy.updated": "最后更新：2026 年 7 月 6 日",
      "privacy.h.intro": "概述",
      "privacy.p.intro": "本工具是一个纯前端（客户端）的图片转换器。所有转换都在你的浏览器中完成，你的图片文件永远不会被上传到任何服务器。",
      "privacy.h.collect": "我们收集哪些数据",
      "privacy.p.collect": "我们不会收集、存储或传输任何个人数据或图片。本工具没有账号系统、不使用追踪性 Cookie，也没有任何识别你身份的分析工具。你选择的图片仅存在于你当前的浏览器标签页中，关闭即消失。",
      "privacy.h.local": "本地存储",
      "privacy.p.local": "本网站仅会在你的浏览器 localStorage 中存储你选择的“语言偏好”与“质量设置”。这些数据只留在你的设备上，不会发送到任何地方。",
      "privacy.h.third": "第三方服务",
      "privacy.p.third": "本工具不会将你的文件发送给任何第三方。若本站托管于 GitHub Pages 等平台，该平台可能依其自身政策记录一般的服务器连接信息（例如 IP 地址），此部分不在本工具控制范围内。",
      "privacy.h.children": "儿童隐私",
      "privacy.p.children": "本工具不会刻意收集任何人的个人数据，包含儿童在内。",
      "privacy.h.changes": "政策变更",
      "privacy.p.changes": "我们可能会不定期更新本政策，更新内容将直接公布于本页面。",
      "privacy.h.contact": "联系方式",
      "privacy.p.contact": "如对本政策有任何疑问，欢迎通过本项目的 GitHub 仓库与我们联系。",

      "terms.updated": "最后更新：2026 年 7 月 6 日",
      "terms.h.accept": "接受条款",
      "terms.p.accept": "使用本工具即表示你同意本使用条款。若你不同意，请勿使用本工具。",
      "terms.h.service": "服务说明",
      "terms.p.service": "本工具是一个免费的在线图片格式转换器，所有处理均在用户的浏览器本地完成。本服务以“现状”提供，我们不保证其持续可用性或无中断。",
      "terms.h.user": "用户责任",
      "terms.p.user": "你必须拥有你所转换图片的合法权利，并自行负责转换结果的使用方式。你不得利用本工具从事任何违法或侵害他人权利的行为。",
      "terms.h.ip": "知识产权",
      "terms.p.ip": "你上传处理的图片其权利仍属于你。本工具的代码与界面设计则属于其各自的作者所有。",
      "terms.h.warranty": "免责声明",
      "terms.p.warranty": "本工具以“现状”及“现有”基础提供，不附带任何明示或默示的担保，包括但不限于适销性、特定用途适用性及转换结果之正确性。",
      "terms.h.liability": "责任限制",
      "terms.p.liability": "在法律允许的最大范围内，对于因使用或无法使用本工具所导致的任何直接、间接、附带或衍生性损害（包含数据丢失），我们概不负责。",
      "terms.h.changes": "条款变更",
      "terms.p.changes": "我们可能随时修订本条款，修订后的内容将公布于本页面，并自公布时起生效。",
    },

    "en": {
      "site.name": "WebP Image Converter",
      "nav.converter": "Converter",
      "nav.privacy": "Privacy Policy",
      "nav.terms": "Terms of Service",

      "title.converter": "WebP Converter — Convert WebP to JPG/PNG Online Free (100% Local)",
      "title.privacy": "Privacy Policy — WebP Image Converter",
      "title.terms": "Terms of Service — WebP Image Converter",

      "app.badge": "● 100% local processing, images are never uploaded",
      "app.subtitle": "Convert between WebP, JPG and PNG. Batch and quality control supported. Everything runs in your browser.",
      "picker.input": "Input format",
      "picker.output": "Output format",
      "picker.chooseInput": "Choose input format",
      "picker.chooseOutput": "Choose output format",
      "picker.sameFmt": "Input and output cannot be the same format",
      "fmt.auto": "Auto",
      "quality.q100": "100% - Original quality",
      "quality.q80": "80% - Optimized compression",
      "quality.q60": "60% - Light compression",
      "quality.q40": "40% - Efficient compression",
      "quality.q20": "20% - Maximum compression",
      "drop.title": "Drop images here, or click to choose files",
      "drop.overlay": "Drop to add images",
      "drop.hint": "Supports JPG, PNG, WebP, GIF, BMP and more — multiple at once",
      "btn.convertAll": "Start converting",
      "btn.downloadZip": "Download all (ZIP)",
      "btn.downloadTarGz": "Download all (TAR.GZ)",
      "btn.clear": "Reset",
      "btn.download": "Download",
      "item.remove": "Remove",
      "item.original": "Original",
      "item.pending": "Pending",
      "item.converting": "Converting…",
      "item.saved": "saved",
      "item.increased": "larger",
      "item.failed": "Failed: ",
      "msg.packing": "Packing…",
      "msg.skipped": "Skipped {n} file(s) that did not match the selected input format ({fmt}).",
      "msg.noGzip": "Your browser does not support CompressionStream, so GZIP cannot be generated. Please use \"Download all (ZIP)\" instead.",
      "msg.confirmReset": "Are you sure you want to reset? All images and converted results in the list will be cleared.",
      "pager.showAll": "Show all",
      "explain.title": "How compression works",
      "explain.step1": "Original image",
      "explain.step1d": "PNG / JPG / WebP",
      "explain.step2": "Decode to pixels",
      "explain.step2d": "Restored to uncompressed bitmap data",
      "explain.step3": "Re-encode",
      "explain.step3d": "Compressed with the chosen format and quality",
      "explain.step4": "New file output",
      "explain.step4d": "Same filename, only the extension changes",
      "explain.whyTitle": "Why do files sometimes get bigger?",
      "explain.r1t": "100% quality is lossless",
      "explain.r1": "At 100% quality the browser switches to lossless encoding, which is usually much larger. Choose 80% to shrink files.",
      "explain.r2t": "The original was already optimized",
      "explain.r2": "Many PNGs are already optimized with palettes or tools like TinyPNG; re-encoding loses those advantages.",
      "explain.r3t": "Fixed overhead on tiny images",
      "explain.r3": "In very small files the format's fixed overhead dominates, so conversion can easily increase the size.",
      "explain.tip": "💡 For the best size/quality balance choose 80%; if a result grows, the list marks it with a red \"↑\".",
      "err.load": "Failed to load the image; the file may be corrupt or unsupported",
      "foot.tech": "Pure front-end tool · Uses the browser Canvas API · Works fully offline",
      "foot.techLink": "How it works: canvas.toBlob()",
      "foot.copyright": "This tool runs locally on your device and never uploads any images.",

      "privacy.updated": "Last updated: July 6, 2026",
      "privacy.h.intro": "Overview",
      "privacy.p.intro": "This tool is a purely front-end (client-side) image converter. All conversions happen inside your browser, and your image files are never uploaded to any server.",
      "privacy.h.collect": "What we collect",
      "privacy.p.collect": "We do not collect, store, or transmit any personal data or images. There is no account system, no tracking cookies, and no analytics that identify you. The images you select exist only in your current browser tab and disappear when you close it.",
      "privacy.h.local": "Local storage",
      "privacy.p.local": "This site stores only your chosen language preference and quality setting in your browser's localStorage. This data stays on your device and is never sent anywhere.",
      "privacy.h.third": "Third-party services",
      "privacy.p.third": "This tool does not send your files to any third party. If the site is hosted on a platform such as GitHub Pages, that platform may log standard server request information (for example, IP addresses) under its own policy, which is outside this tool's control.",
      "privacy.h.children": "Children's privacy",
      "privacy.p.children": "This tool does not knowingly collect personal data from anyone, including children.",
      "privacy.h.changes": "Changes to this policy",
      "privacy.p.changes": "We may update this policy from time to time. Any changes will be posted directly on this page.",
      "privacy.h.contact": "Contact",
      "privacy.p.contact": "If you have any questions about this policy, please reach out via this project's GitHub repository.",

      "terms.updated": "Last updated: July 6, 2026",
      "terms.h.accept": "Acceptance of terms",
      "terms.p.accept": "By using this tool, you agree to these Terms of Service. If you do not agree, please do not use the tool.",
      "terms.h.service": "Description of service",
      "terms.p.service": "This tool is a free online image format converter. All processing happens locally in the user's browser. The service is provided \"as is\" and we do not guarantee continuous availability or uninterrupted operation.",
      "terms.h.user": "User responsibilities",
      "terms.p.user": "You must hold the legal rights to any images you convert, and you are solely responsible for how you use the results. You may not use this tool for any unlawful purpose or in any way that infringes the rights of others.",
      "terms.h.ip": "Intellectual property",
      "terms.p.ip": "You retain all rights to the images you process. The tool's source code and interface design belong to their respective authors.",
      "terms.h.warranty": "Disclaimer of warranties",
      "terms.p.warranty": "This tool is provided on an \"as is\" and \"as available\" basis without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, and the accuracy of conversion results.",
      "terms.h.liability": "Limitation of liability",
      "terms.p.liability": "To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, or consequential damages (including data loss) arising from the use of, or inability to use, this tool.",
      "terms.h.changes": "Changes to these terms",
      "terms.p.changes": "We may revise these terms at any time. Revised terms will be posted on this page and take effect upon posting.",
    },

    "ja": {
      "site.name": "WebP 画像変換ツール",
      "nav.converter": "変換ツール",
      "nav.privacy": "プライバシーポリシー",
      "nav.terms": "利用規約",

      "title.converter": "WebP 変換ツール｜WebP を JPG・PNG に無料変換（100% ローカル処理）",
      "title.privacy": "プライバシーポリシー — WebP 画像変換ツール",
      "title.terms": "利用規約 — WebP 画像変換ツール",

      "app.badge": "● 100% ローカル処理、画像はアップロードされません",
      "app.subtitle": "WebP ⇄ JPG / PNG を相互変換。バッチ処理と品質調整に対応。すべてブラウザ内で完結します。",
      "picker.input": "入力形式",
      "picker.output": "出力形式",
      "picker.chooseInput": "入力形式を選択",
      "picker.chooseOutput": "出力形式を選択",
      "picker.sameFmt": "入力と出力に同じ形式は選べません",
      "fmt.auto": "自動",
      "quality.q100": "100% - オリジナル品質",
      "quality.q80": "80% - 高品質圧縮",
      "quality.q60": "60% - 軽度圧縮",
      "quality.q40": "40% - 高効率圧縮",
      "quality.q20": "20% - 最大圧縮",
      "drop.title": "画像をここにドロップ、またはクリックして選択",
      "drop.overlay": "ドロップして画像を追加",
      "drop.hint": "JPG、PNG、WebP、GIF、BMP などに対応。複数枚まとめて可",
      "btn.convertAll": "変換開始",
      "btn.downloadZip": "すべてダウンロード (ZIP)",
      "btn.downloadTarGz": "すべてダウンロード (TAR.GZ)",
      "btn.clear": "リセット",
      "btn.download": "ダウンロード",
      "item.remove": "削除",
      "item.original": "元",
      "item.pending": "変換待ち",
      "item.converting": "変換中…",
      "item.saved": "削減",
      "item.increased": "増加",
      "item.failed": "失敗：",
      "msg.packing": "パッケージ中…",
      "msg.skipped": "選択した入力形式（{fmt}）に合わない {n} 件のファイルをスキップしました。",
      "msg.noGzip": "お使いのブラウザは CompressionStream に対応していないため GZIP を生成できません。「すべてダウンロード (ZIP)」をご利用ください。",
      "msg.confirmReset": "リセットしてもよろしいですか？リスト内のすべての画像と変換結果が消去されます。",
      "pager.showAll": "すべて表示",
      "explain.title": "圧縮の仕組み",
      "explain.step1": "元の画像",
      "explain.step1d": "PNG / JPG / WebP",
      "explain.step2": "ピクセルへデコード",
      "explain.step2d": "非圧縮のビットマップに復元",
      "explain.step3": "再エンコード",
      "explain.step3d": "選択した形式と品質で再圧縮",
      "explain.step4": "新しいファイルを出力",
      "explain.step4d": "ファイル名は同じ、拡張子のみ変更",
      "explain.whyTitle": "ファイルが大きくなることがあるのはなぜ？",
      "explain.r1t": "品質 100% はロスレス",
      "explain.r1": "品質 100% ではブラウザがロスレス符号化に切り替わり、通常かなり大きくなります。縮小したい場合は 80% がおすすめです。",
      "explain.r2t": "元ファイルが最適化済み",
      "explain.r2": "多くの PNG はパレットや TinyPNG などで最適化済みで、再エンコードでその利点が失われます。",
      "explain.r3t": "小さい画像の固定オーバーヘッド",
      "explain.r3": "ごく小さなファイルでは形式自体の固定データの割合が高く、変換後に大きくなりがちです。",
      "explain.tip": "💡 サイズと品質のバランスは 80% が最適。大きくなった場合はリストに赤い「↑」が表示されます。",
      "err.load": "画像の読み込みに失敗しました。ファイルが破損しているか、非対応の形式の可能性があります",
      "foot.tech": "純フロントエンドツール・ブラウザの Canvas API 使用・完全オフライン動作",
      "foot.techLink": "技術原理：canvas.toBlob()",
      "foot.copyright": "本ツールはお使いの端末上でローカルに動作し、画像を一切アップロードしません。",

      "privacy.updated": "最終更新：2026 年 7 月 6 日",
      "privacy.h.intro": "概要",
      "privacy.p.intro": "本ツールは純粋なフロントエンド（クライアントサイド）の画像変換ツールです。すべての変換はブラウザ内で行われ、画像ファイルがサーバーにアップロードされることは一切ありません。",
      "privacy.h.collect": "収集する情報",
      "privacy.p.collect": "当方は個人データや画像を一切収集・保存・送信しません。アカウント機能、トラッキング Cookie、個人を識別する解析ツールはいずれも使用していません。選択した画像は現在のブラウザタブ内にのみ存在し、閉じると消えます。",
      "privacy.h.local": "ローカルストレージ",
      "privacy.p.local": "本サイトはブラウザの localStorage に「言語設定」と「品質設定」のみを保存します。これらのデータは端末内に留まり、どこにも送信されません。",
      "privacy.h.third": "第三者サービス",
      "privacy.p.third": "本ツールはファイルを第三者に送信しません。GitHub Pages などのプラットフォームでホストされている場合、そのプラットフォームが独自のポリシーに基づき一般的なサーバー接続情報（IP アドレスなど）を記録することがありますが、これは本ツールの管理外です。",
      "privacy.h.children": "子どものプライバシー",
      "privacy.p.children": "本ツールは、子どもを含むいかなる人物の個人データも意図的に収集しません。",
      "privacy.h.changes": "ポリシーの変更",
      "privacy.p.changes": "本ポリシーは随時更新されることがあります。変更内容は本ページに直接掲載されます。",
      "privacy.h.contact": "お問い合わせ",
      "privacy.p.contact": "本ポリシーに関するご質問は、本プロジェクトの GitHub リポジトリよりお寄せください。",

      "terms.updated": "最終更新：2026 年 7 月 6 日",
      "terms.h.accept": "規約への同意",
      "terms.p.accept": "本ツールを利用することで、本利用規約に同意したものとみなされます。同意されない場合は本ツールをご利用にならないでください。",
      "terms.h.service": "サービスの説明",
      "terms.p.service": "本ツールは無料のオンライン画像形式変換ツールであり、すべての処理は利用者のブラウザ内でローカルに実行されます。本サービスは「現状のまま」提供され、継続的な提供や無停止の動作を保証するものではありません。",
      "terms.h.user": "利用者の責任",
      "terms.p.user": "変換する画像について適法な権利を有している必要があり、変換結果の利用方法については利用者ご自身が責任を負います。違法な目的や他者の権利を侵害する態様で本ツールを利用してはなりません。",
      "terms.h.ip": "知的財産権",
      "terms.p.ip": "処理した画像に関する権利は利用者に帰属します。本ツールのソースコードおよびインターフェースデザインは、それぞれの作者に帰属します。",
      "terms.h.warranty": "保証の否認",
      "terms.p.warranty": "本ツールは「現状のまま」「提供可能な範囲で」提供され、商品性、特定目的への適合性、変換結果の正確性を含め、明示黙示を問わずいかなる保証も行いません。",
      "terms.h.liability": "責任の制限",
      "terms.p.liability": "法律で認められる最大限の範囲において、本ツールの利用または利用不能に起因する直接的・間接的・付随的・結果的損害（データの損失を含む）について、当方は一切責任を負いません。",
      "terms.h.changes": "規約の変更",
      "terms.p.changes": "本規約は随時改定されることがあります。改定後の規約は本ページに掲載され、掲載時点で効力を生じます。",
    },
  };

  const STORE_KEY = "webp_lang";

  function detect() {
    let saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* 隱私模式可能封鎖儲存 */ }
    if (saved && DICT[saved]) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    if (nav.startsWith("zh")) return /(cn|hans|sg)/.test(nav) ? "zh-CN" : "zh-TW";
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("en")) return "en";
    return "zh-TW";
  }

  let current = detect();

  function t(key, vars) {
    let s = (DICT[current] && DICT[current][key]) || (DICT.en && DICT.en[key]) || key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }

  function apply() {
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    const tk = document.body && document.body.dataset.titleKey;
    if (tk) document.title = t(tk);
    window.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: current } }));
  }

  // 自訂下拉選單（原生 select 無法顯示國旗圖示）
  function buildSwitcher() {
    const host = document.getElementById("langSwitch");
    if (!host) return;
    host.innerHTML = "";

    const dd = document.createElement("div");
    dd.className = "lang-dd";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-label", "Language");
    const menu = document.createElement("div");
    menu.className = "lang-menu";
    menu.hidden = true;

    const flagOf = (l) => {
      const img = document.createElement("img");
      img.src = l.flag;
      img.alt = "";
      img.className = "lang-flag";
      return img;
    };

    const renderBtn = () => {
      const cur = LANGS.find((l) => l.code === current);
      btn.innerHTML = "";
      btn.appendChild(flagOf(cur));
      const sp = document.createElement("span");
      sp.textContent = cur.label;
      btn.appendChild(sp);
      const caret = document.createElement("span");
      caret.className = "lang-caret";
      caret.textContent = "▾";
      btn.appendChild(caret);
    };

    LANGS.forEach((l) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "lang-item";
      item.dataset.lang = l.code;
      item.appendChild(flagOf(l));
      const sp = document.createElement("span");
      sp.textContent = l.label;
      item.appendChild(sp);
      item.addEventListener("click", () => {
        setLang(l.code);
        renderBtn();
        menu.hidden = true;
      });
      menu.appendChild(item);
    });

    btn.addEventListener("click", () => {
      if (menu.hidden) {
        menu.querySelectorAll(".lang-item").forEach((it) =>
          it.classList.toggle("active", it.dataset.lang === current));
      }
      menu.hidden = !menu.hidden;
    });
    document.addEventListener("click", (e) => { if (!dd.contains(e.target)) menu.hidden = true; });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") menu.hidden = true; });

    dd.appendChild(btn);
    dd.appendChild(menu);
    host.appendChild(dd);
    renderBtn();
  }

  function setLang(code) {
    if (!DICT[code]) return;
    current = code;
    try { localStorage.setItem(STORE_KEY, code); } catch (e) { /* 隱私模式可能封鎖儲存 */ }
    apply();
  }

  window.i18n = { t: t, setLang: setLang, get lang() { return current; } };

  document.addEventListener("DOMContentLoaded", () => { buildSwitcher(); apply(); });
})();
