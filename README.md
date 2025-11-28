# Google Calendar Prefix Buttons (Chrome Extension)

タイトルプリフィックス挿入ボタンを Chrome 拡張としてパッケージしました。Google カレンダーの予定タイトル入力欄にカスタマイズ可能なボタンを追加します。

## 使い方（ローカルでテスト）
1. Chrome の `chrome://extensions/` を開き「デベロッパーモード」を ON。
2. 「パッケージ化されていない拡張機能を読み込む」からこのフォルダを選択。
3. Google カレンダーの予定編集画面を開くとタイトル入力欄の下にボタンが表示されます。

## 設定
- 拡張機能の詳細ページから「拡張機能のオプション」を開くとボタン設定を編集できます。
- ラベル / 挿入テキスト / 背景色 / 文字色 / 先頭に固定 を行ごとに設定・追加・削除できます。
- 保存すると `chrome.storage.sync` に記録され、複数 PC 間で同期されます。

## リリースメモ
- `manifest.json` は Manifest V3。
- 権限は `storage` のみ。コンテンツスクリプトのマッチ（`https://calendar.google.com/calendar/*`）で必要なサイト権限が宣言されます。
- アイコン（16/48/128px）を同梱済み（`icons/`）。

## Chrome ウェブストア公開手順メモ
1. ルートのファイルを ZIP 化（`manifest.json` と `icons/`, `content.js`, `options.html`, `options.js`, `README.md` を含める）。
2. デベロッパーダッシュボードで新規アイテムを作成し ZIP をアップロード。
3. アイテム名・説明・スクリーンショット（推奨 1280x800）を登録。権限は `storage` と `https://calendar.google.com/*` のみで表示されます。
4. プライバシーポリシー URL（同期ストレージのみ利用で、個人情報収集なしと明記）。
5. 審査後に公開。
