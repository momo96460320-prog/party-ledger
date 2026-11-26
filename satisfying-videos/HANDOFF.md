# 気持ちいい系ショート動画プロジェクト：引き継ぎメモ

TikTok / YouTube ショート向けに「中毒性の高いシンプル動画」を作っているプロジェクトです。
クラウドのセッションからはユーザーのMac・Chromeを操作できなかったため、ここで引き継ぎます。

## 今すぐやること（最優先）
**`videos/ring-breaker-2-fur-elise.mp4` を TikTok に投稿する。**

- 投稿先：https://www.tiktok.com/upload（ユーザーのChromeはログイン済みの想定）
- BGMは付けない（動画に音が入っている）
- 説明文：
  ```
  Name the song before it escapes 🎵 How many notes did you need? 👇
  #satisfying #oddlysatisfying #guessthesong #piano #physics #bouncingball #fyp
  ```
- カバー画像：後半の、軌跡の線がたくさん重なった場面
- **投稿ボタンを押す前にユーザーに確認する**
- 投稿後、自分のコメントとして「I got it in 4 notes 😏」を書いて固定する
- 余裕があれば YouTube ショートにも同じ動画を投稿する（タイトル：`Name the song before it escapes 🎵 #shorts`）

## ファイル
| パス | 中身 |
|---|---|
| `videos/ring-breaker-2-fur-elise.mp4` | **投稿する本命。** Ring Breaker 2.0『エリーゼのために』。1080×1920・30fps・54秒・音付き・音量調整済み（約-14 LUFS） |
| `videos/ring-breaker-1.mp4` | 旧版 Ring Breaker（太いネオン＋効果音）。57秒 |
| `web/ring-breaker-2.html` | 2.0 のソース。ブラウザで開いて「Play」で再生。1周ごとに曲が変わる |
| `web/ring-breaker.html` | 旧版（英語版 Ring Breaker）。重低音・NO TOUCH・PREMIUM演出入り |
| `web/escape-ball-ja.html` | 最初期の日本語版「10枚 全部ぶち破れる？」 |
| `render/` | HTML から MP4 を書き出すツール（下記） |

## Ring Breaker 2.0 の仕組み
- 10重のリングが交互に回転。ボールが重力で跳ね、隙間（0.46rad、狭め）から抜けるとリングが割れて次へ。
- **跳ねるたびにピアノで曲のメロディを1音ずつ鳴らす**（著作権切れのクラシック：エリーゼのために／歓喜の歌／カノン／きらきら星）。
- 跳ねた点を細いレーザー線で結んで残す → 糸のアート（string art）が育っていく。
- リングが割れると曲のキーの低音「ドン」。全部抜けたら冒頭フレーズを一気に弾いて和音で締め、"It was Für Elise / Beethoven" → "How many notes did you need?" と表示。
- 隙間の縁でギリギリ弾かれると火花（音なし）。1/80 の確率で PREMIUM（暗転→LUCKYランプ→ポキューン）。
- 1周およそ 50〜60 秒。

## 動画の書き出し方（再現手順）
リアルタイム録画だと 12fps 程度に落ちるので、**時間を仮想化してコマ送りで描画し、音は OfflineAudioContext で同期レンダリング**している。

```bash
# 1. HTML を「オフライン描画版」に変換（AudioContext→OfflineAudioContext、時間・setTimeoutを仮想化）
python3 render/make_offline.py web/ring-breaker-2.html /tmp/ring2-offline.html render/tail.js
# 2. Playwright で 1 周分のフレーム(JPEG)と音声(WAV)を書き出す
node render/render.js /tmp/ring2-offline.html /tmp/frames
# 3. MP4 にエンコード（音量正規化つき）
ffmpeg -y -framerate 30 -i /tmp/frames/f%05d.jpg -i /tmp/frames/audio.wav \
  -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -af "volume=-3dB,alimiter=limit=0.85:level=false,loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.84:level=false" \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out.mp4
```
- 曲は 1 周ごとに `SONGS` 配列の順で切り替わる（ロード時と起動時に reset が 2 回走るので、初期値 `songIdx = SONGS.length - 2` で 1 曲目＝エリーゼになる）。別の曲で書き出すときは `ring-breaker-2.html` の `songIdx` の初期値を変える。
- `render.js` は `window.__done` が立ってから 3.8 秒で止まる。

## 次にやること
1. 投稿 24 時間後に、再生数・平均視聴時間・完全視聴率・いいね・コメント・保存をユーザーから聞いて次の改善を決める。
2. 残りの曲（歓喜の歌・カノン・きらきら星）も書き出して 1 日 1 本投稿。
3. 今後の方向性：blend3dfy 系の **3D 質感**（Three.js 等）が最も伸びているので検討。

## ユーザーの好み（ここまでのフィードバックの要約）
**好評だったもの**
- 「10枚 全部ぶち破れる？」日本語版 →「いいやんこれ！」
- 通過時の重低音＋画面の揺れ、ジャグラーの「ペカッ」、パチンコの「ポキューン」、超低確率のプレミアム演出 →「最高！」
- 運と連続（連チャン）の気持ちよさは必須
- 「やっとの思い」で破れること。時間がかかる方がいい。叶いそうで叶わない、が大事
- 最終的に一番良いのは英語版 Ring Breaker。2.0 はそれをベースに、TikTok で伸びている要素（黒背景・細いネオン線・軌跡を残す・音を音楽にする・曲当てでコメントを誘う）を足したもの

**不評だったもの**
- スロー演出で流れが止まる／ランダムすぎてリズムが気持ちよくない
- 木の板版（連続が生まれない）
- アイテム・FEVER などゲームっぽすぎるもの（やり過ぎ）
- 実写風の Drop Test（見た目が安っぽい・演出がうざい・長くてテンポが悪い）
- 割れるまでが早すぎるもの（Neon Glass など）

**コミュニケーション**
- 返事は必ず日本語で。
- 英語は動画内のテロップとハッシュタグだけ（海外向け）。
