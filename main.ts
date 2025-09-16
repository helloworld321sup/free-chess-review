import { Chess } from 'chess.js';
import 'chessboardjs'; // assumes global usage
import { loadStockfish, analyzePosition } from './stockfish';

declare var Chessboard: any;

const game = new Chess();
let board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: (source: string, target: string) => {
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';
  }
});

const analyzeBtn = document.getElementById('analyzeBtn')!;
const output = document.getElementById('analysisOutput')! as HTMLTextAreaElement;

let stockfish: Worker;

window.addEventListener('DOMContentLoaded', async () => {
  stockfish = await loadStockfish();
});

analyzeBtn.addEventListener('click', async () => {
  const fen = game.fen();
  output.value = "Analyzing...";
  const result = await analyzePosition(stockfish, fen);
  output.value = `Evaluation: ${result.eval}\nBest move: ${result.bestMove}`;
});
