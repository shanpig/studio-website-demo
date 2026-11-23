# 序間 SPACE NOTES — 台灣空間案例研究

**公開網站（須 GitHub Pages 部署成功）**：https://shanpig.github.io/studio-website-demo/

這是一個以正式內容產品的體驗標準製作的示範網站，展示三個**真實、可追溯來源**的台灣公共建築案例。本站與下列建築設計團隊、場館均無隸屬、委託或合作關係，**不宣稱為序間設計或承攬作品**。

## 真實案例

1. **臺中國家歌劇院** — Toyo Ito & Associates；設計概念、曲面與公共動線研究。
2. **臺北表演藝術中心** — OMA；劇場量體與公共動線研究。
3. **臺南市立圖書館總館** — Mecanoo + MAYU Architects；遮陽與公共閱讀研究。

每篇研究的資料來源與圖片授權明細，均可在網站中打開案例、查看「資料出處與影像授權」。內容包含我們的設計分析（屬編輯觀點），不得將其誤認為設計團隊的官方解說。

## 設計／體驗要求

- 響應式版面：一致的 max-width、邊緣留白及節奏。
- 編輯型排版：清楚的標題階層、較高對比和可掃讀的資訊架構。
- 微互動：作品 hover、細微箭頭位移、閱讀進度條與內容入場。
- 無障礙：繁體中文 lang、skip link、可見鍵盤焦點、modal 對話框、表單 label、44px 左右的互動目標與減少動態選項。
- SEO：標題、描述、OpenGraph 標籤、語意化 section、原創 favicon。
- 內容：完整案例研究、圖片署名、第三方參考來源。
- 隱私：網站需求工具只在本地產生文字摘要，**不蒐集、保存或寄送資料**。

## 開發與驗證

純靜態 HTML/CSS/JavaScript，不需依賴 npm 套件。GitHub Actions 在部署前執行：

```bash
node tests/smoke.cjs
```

此檢查涵蓋必要檔案、基本 a11y/SEO、案例資料欄位、授權來源及需求工具程式的存在性。它**不是**完整 Lighthouse、跨瀏覽器、無障礙稽核或端到端測試，不能把測試通過稱作所有品質標準已達標。

在 GitHub 的 **Settings → Pages → Build and deployment → Source** 選取 **GitHub Actions** 才能透過 `.github/workflows/deploy.yml` 自動上線。

## 正式商業交付尚需

- 由真正的品牌擁有者提供並授權品牌資料、原創作品與照片。
- 依客戶需求決定完整頁面架構與管理後台。
- 如需實際詢問收件，須增設後端、垃圾訊息防護、告知事項與安全控管。
- 對正式域名進行效能、SEO、跨裝置、瀏覽器和無障礙測試。
- 客戶擁有權、主機維護、備份、保固和服務範圍的書面確認。

## 主要設計參考

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [Nielsen Norman Group — Visual Design](https://www.nngroup.com/articles/visual-design/)

## 授權註記

臺中照片：Wpcpey / Wikimedia Commons，CC BY 4.0。臺北照片：臺北市政府文化局公開授權。臺南照片：臺南市政府公開授權。各案例內提供完整原始文件及授權頁面。

本站的編輯文案與介面原創部分不會改變第三方原設計及照片的智慧財產歸屬。外部圖片可能在初次載入時需要網路連線。
