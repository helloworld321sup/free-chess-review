export async function loadStockfish(): Promise<Worker> {
  const worker = new Worker('https://cdn.jsdelivr.net/npm/stockfish/stockfish.wasm.js');
  return worker;
}

export function analyzePosition(worker: Worker, fen: string): Promise<{ bestMove: string, eval: string }> {
  return new Promise((resolve) => {
    let bestMove = '';
    let evalScore = '';

    worker.onmessage = (e) => {
      const line = e.data;

      if (line.startsWith('info') && line.includes('score')) {
        const match = line.match(/score (cp|mate) (-?\d+)/);
        if (match) {
          const type = match[1];
          const value = parseInt(match[2]);
          evalScore = type === 'cp' ? (value / 100).toFixed(2) : `#${value}`;
        }
      }

      if (line.startsWith('bestmove')) {
        bestMove = line.split(' ')[1];
        resolve({ bestMove, eval: evalScore });
      }
    };

    worker.postMessage('uci');
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage('go depth 15');
  });
}
