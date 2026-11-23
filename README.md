# 有譜 AI — Cinematic Design Intelligence (v7)

公開網址（`main` 經 CI 通過後自動部署）：https://shanpig.github.io/studio-website-demo/

## 使用者看到什麼

這不是一般 Landing Page，也不是滿版發光儀表板。平時以中央**可辨識的光學機械智能體**與簡短引導對話為主，視覺採深色礦物材質、柔和金屬光澤、低飽和青綠色。需要資料時才出現一至兩個**浮動玻璃視窗**，可以並排、拖曳或重疊；避免同時出現四個大面板造成閱讀壓力。

## 一分鐘內可以理解的流程

1. **釐清需求** — 五個非技術問題：客戶產業、主要行動、購買疑慮、第一版核心功能與素材。
2. **挑選風格** — 四種可比較的方向，能即時調整品牌名稱與主標題。
3. **整理修改** — 以位置／方向／優先度建立可執行的修改清單。
4. **帶走需求書** — 匯出以上資訊與正式交付前需釐清的安全、資料、素材及維護事項。

頁面初次載入時不開啟任何浮動工具；使用者能從底部清楚的 CTA 或四步導航開始。前一個面板會適時改成精簡摘要，最多同時顯示兩個。

## 版本控制

持續沿用 `feature/holographic-agent-hud-v6` 進行同一個智能體產品的視覺與流程修改，使用 commits 保留各次修正；通過 Pull Request 後合併至 `main` 發布 GitHub Pages。這條 branch 在上次 v6 合併後已重新對齊 `main`，上次 PR 歷史仍可保留查閱。

## 測試與交付

- `node tests/smoke.cjs` — 靜態結構、語法、主要介面以及本地下載流程檢查。
- `node tests/browser.cjs` — Playwright/Chromium 的桌面和手機瀏覽器流程驗證，包含：中央智能體位置、初始畫面簡潔度、五題問答、風格比較、修改意見、需求書下載、重新開始與手機版檢查。
- GitHub Actions 在 PR 執行兩類測試，並上傳 `website-review-screenshots` 供視覺審核；通過後合併才會部署正式 Pages。

## 真正商業交付的界線

本網站是**規則式對話原型**，沒有連接任何大型語言模型、真人客服、CRM、付款、實際客戶資料庫或 AI 推論服務。網站的示範訊息與表單答案只在瀏覽器內使用，不向後端傳送。未來正式營業前必須建立授權、真人審核、資料保存與刪除機制、安全監控及服務合約。

正式的視覺品質與效能驗收需要檢視 CI 截圖、真機操作、Lighthouse 及 WCAG 2.2 審核。**程式測試通過不代表美感或正式商業可用性已獲客戶驗證**。

## v8 — The agent speaks from the center (interaction redesign)

The fixed bottom chat dock has been removed. The central mascot is no longer only a decorative, vertically bobbing image:

- Its most recent response is **projected directly beneath the core** using a progressive text-reveal effect.
- The central optic reacts subtly to pointer direction; mechanical wings, lens ring, luminous voice emitters and a small waveform animate **during the response**, then settle when finished.
- A compact command input replaces the full-width messenger panel; suggested next steps live next to the projected message.
- Transcript history is available as an **optional drawer**, hidden by default; the customer is not forced to browse a chat log.
- Business discovery, four website styles, structured revisions and downloadable requirements remain usable in floating task windows.
- Respect `prefers-reduced-motion`: instant text rendering and reduced physical movement.
- The assistant is still rule-driven, **not a connected LLM** and not a staffed human service; the visual speaking effect is not synthesized voice audio.

CI now checks the presence-led experience, including speaking animations, the optional transcript, optical gaze, full guided journey, and mobile interaction screenshots. Visual elegance is still subject to real client acceptance and cannot be inferred from passing automated checks alone.
