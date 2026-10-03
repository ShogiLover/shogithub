import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Shogi } from 'shogi.js';
import Encoding from 'encoding-japanese';
import 'shogi-player';

// Web Component (shogi-player-wc) の JSX 型定義

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'shogi-player-wc': any;
      }
    }
  }
}

export const ShogiApp: React.FC = () => {
  // Shogi.js のインスタンスを保持
  const shogiRef = useRef<any>(new Shogi());
  const playerRef = useRef<any>(null);

  // 生成された KIF テキスト（UTF-8）
  const [kifText, setKifText] = useState<string>('');

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // shogi-player 上で指し手（ドラッグ＆ドロップ操作など）が発生したときのイベント
    const handleMove = (event: CustomEvent) => {
      const detail = event.detail;
      const shogi = shogiRef.current;

      try {
        // イベントから移動情報を取得
        // detail の構造: { from: { x: 7, y: 7 }, to: { x: 7, y: 6 }, piece: 'FU', promote: false }
        if (detail.from) {
          // 盤上の駒を移動
          shogi.move(
            detail.from.x,
            detail.from.y,
            detail.to.x,
            detail.to.y,
            detail.promote
          );
        } else if (detail.piece) {
          // 持ち駒を打つ動作
          shogi.drop(detail.to.x, detail.to.y, detail.piece);
        }

        // 最新の KIF テキストを取得して更新
        const currentKif = shogi.toKIF();
        setKifText(currentKif);
      } catch (err) {
        console.error('無効な手、または処理エラー:', err);
      }
    };

    // shogi-player のカスタムイベントを購読
    player.addEventListener('shogi-player-move', handleMove);

    return () => {
      player.removeEventListener('shogi-player-move', handleMove);
    };
  }, []);

  // KIF ファイルのダウンロード機能 (Shift_JIS エンコーディング)
  const handleDownloadKif = () => {
    if (!kifText) return;

    // 1. KIFテキストを UTF-8 から Shift_JIS (SJIS) のバイト配列に変換
    const unicodeArray = Encoding.stringToCode(kifText);
    const sjisAray = Encoding.convert(unicodeArray, {
      to: 'SJIS',
      from: 'UNICODE',
    });
    const uint8Array = new Uint8Array(sjisAray);

    // 2. Shift_JIS の Blob を生成
    const blob = new Blob([uint8Array], { type: 'text/plain;charset=shift_jis' });

    // 3. ブラウザでダウンロードを実行
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shogi_game_${Date.now()}.kif`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // リセット処理
  const handleReset = () => {
    shogiRef.current = new Shogi();
    setKifText('');
    if (playerRef.current) {
      playerRef.current.sp_kif = ''; // 盤面リセット
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>将棋盤ドラッグ操作 & KIF生成アプリ</h2>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* 将棋盤 UI コンポーネント */}
        <div style={{ width: '420px' }}>
          <shogi-player-wc
            ref={playerRef}
            mode="play" // 対局・動かせるモード
            sp_turn="0"
          />
        </div>

        {/* リアルタイム KIF 表示 & 操作パネル */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3>生成されたKIF</h3>
          <textarea
            value={kifText}
            readOnly
            rows={15}
            style={{ width: '100%', fontFamily: 'monospace', padding: '10px' }}
            placeholder="盤上の駒をドラッグして動かすと、ここにKIFが表示されます..."
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleDownloadKif}
              disabled={!kifText}
              style={{
                padding: '10px 16px',
                backgroundColor: '#2b6cb0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: kifText ? 'pointer' : 'not-allowed',
              }}
            >
              .kif ファイルをダウンロード (Shift_JIS)
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 16px',
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShogiApp;

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ShogiApp />
    </React.StrictMode>
  );
}
