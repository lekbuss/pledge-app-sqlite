# 誓約アプリ（Pledge App）

このアプリは、ユーザーが誓約を立て、達成できなかった場合に事前に指定した監督者（友人など）へ自動的に課金される仕組みを提供します。  
**「やると決めたことを守る」**ための自己管理ツールです。

---

## 📌 主な機能
- 誓約内容（期限・金額・監督者）を登録
- 証拠（達成したことの証明画像やファイル）をアップロード
- 監督者が承認すると課金なし
- 承認されなければ自動的に課金（Stripe経由）

---

## 🔧 必要なツール・サービス
1. **Node.js**（バージョン 18以上）
   - [Node.js公式サイト](https://nodejs.org/ja)
2. **GitHubアカウント**
   - [GitHub公式サイト](https://github.com/)
3. **Stripeアカウント**
   - [Stripe公式サイト](https://stripe.com/jp)
4. **Renderアカウント**（無料デプロイ用）
   - [Render公式サイト](https://render.com/)

---

## 📝 事前準備
1. Stripeに登録し、ダッシュボードからAPIキーを取得
   - 「開発者」 → 「APIキー」から`Publishable key`と`Secret key`をコピー
   - 「Connectアカウント」機能を有効化
2. GitHubからこのリポジトリをフォークまたはクローン

---

## ⚙ 環境変数の設定（.env）
プロジェクト直下に`.env`ファイルを作成し、以下を設定します。

```env
STRIPE_SECRET_KEY=sk_test_************
STRIPE_PUBLISHABLE_KEY=pk_test_************
DATABASE_URL=file:./dev.db
```

---

## 💻 ローカルでの実行
```bash
# 依存パッケージのインストール
npm install

# データベースの初期化
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```
ブラウザで `http://localhost:3000` にアクセスします。

---

## ☁ Renderでのデプロイ方法
1. [Render](https://render.com/) にログイン
2. 「New +」 → 「Web Service」を選択
3. GitHubと連携し、このリポジトリを選択
4. Build Command に  
   ```
   npm install && npx prisma migrate deploy
   ```  
   を設定
5. Start Command に  
   ```
   npm run start
   ```  
   を設定
6. Environment Variables に `.env` の内容を登録
7. 「Deploy」をクリック

---

## ⚠ 注意事項
- 課金はStripeを通じて行われます。テストモードでは実際に課金されません。
- 実運用する際は必ず本番APIキーを使用してください。
- セキュリティのため、`.env`ファイルはGitHubにアップロードしないでください。

---

## 📄 ライセンス
MIT License
