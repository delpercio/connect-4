// ─── Constants ───────────────────────────────────────────────────────────────
const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const P1 = 1;   // Human (Red)
const P2 = 2;   // Human or Computer (Yellow)

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const playerTurnEl = document.querySelector('.player-turn');
const tbRow        = document.querySelectorAll('#game-table tr');
const slots        = document.querySelectorAll('.slot');
const colArrows    = document.querySelectorAll('.col-arrow');
const modeBtns     = document.querySelectorAll('.mode-btn');
const diffBtns     = document.querySelectorAll('.diff-btn');
const diffRow      = document.getElementById('difficulty-row');

// ─── Game State ───────────────────────────────────────────────────────────────
let board          = [];   // 2D array [row][col], 0=empty 1=P1 2=P2
let currentPlayer  = P1;
let gameOver       = false;
let vsComputer     = false;
let difficulty     = 'easy';
let aiThinking     = false;

// ─── Setup buttons ────────────────────────────────────────────────────────────
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        vsComputer = btn.dataset.mode === 'computer';
        diffRow.style.display = vsComputer ? 'flex' : 'none';
        resetGame();
    });
});

diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.diff;
        resetGame();
    });
});

// ─── Column arrow hover / click ───────────────────────────────────────────────
colArrows.forEach(arrow => {
    arrow.addEventListener('mouseenter', () => {
        if (gameOver || aiThinking) return;
        const col = parseInt(arrow.dataset.col);
        previewColumn(col);
    });
    arrow.addEventListener('mouseleave', () => clearPreview());
    arrow.addEventListener('click', () => {
        if (gameOver || aiThinking) return;
        const col = parseInt(arrow.dataset.col);
        humanPlay(col);
    });
});

// Hover over table cells → highlight arrow + preview
slots.forEach(slot => {
    slot.addEventListener('mouseenter', () => {
        if (gameOver || aiThinking) return;
        const col = parseInt(slot.dataset.col);
        colArrows[col].classList.add('visible');
        previewColumn(col);
    });
    slot.addEventListener('mouseleave', () => {
        clearPreview();
        colArrows.forEach(a => a.classList.remove('visible'));
    });
    slot.addEventListener('click', () => {
        if (gameOver || aiThinking) return;
        const col = parseInt(slot.dataset.col);
        humanPlay(col);
    });
});

// ─── Core: human move ─────────────────────────────────────────────────────────
function humanPlay(col) {
    if (gameOver || aiThinking) return;
    if (!dropPiece(col, currentPlayer)) return; // column full

    clearPreview();
    if (checkEnd()) return;

    currentPlayer = P2;
    if (vsComputer) {
        scheduleComputerMove();
    } else {
        updateTurnDisplay();
    }
}

// ─── Core: drop piece into board model + DOM ──────────────────────────────────
function dropPiece(col, player) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === EMPTY) {
            board[row][col] = player;
            renderCell(row, col, player);
            return true;
        }
    }
    return false; // column full
}

function renderCell(row, col, player) {
    const cell = tbRow[row].children[col];
    cell.classList.remove('empty', 'player1', 'player2', 'preview-player1', 'preview-player2');
    cell.classList.add(player === P1 ? 'player1' : 'player2');
}

// ─── Preview (ghost piece) ────────────────────────────────────────────────────
function previewColumn(col) {
    clearPreview();
    if (gameOver || aiThinking) return;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === EMPTY) {
            const cell = tbRow[row].children[col];
            cell.classList.add(currentPlayer === P1 ? 'preview-player1' : 'preview-player2');
            break;
        }
    }
}

function clearPreview() {
    slots.forEach(s => s.classList.remove('preview-player1', 'preview-player2'));
}

// ─── Win / Tie detection ──────────────────────────────────────────────────────
function checkWinner(b, player) {
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (b[r][c] === player && b[r][c+1] === player && b[r][c+2] === player && b[r][c+3] === player)
                return [[r,c],[r,c+1],[r,c+2],[r,c+3]];
        }
    }
    // Vertical
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r <= ROWS - 4; r++) {
            if (b[r][c] === player && b[r+1][c] === player && b[r+2][c] === player && b[r+3][c] === player)
                return [[r,c],[r+1,c],[r+2,c],[r+3,c]];
        }
    }
    // Diagonal ↘
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (b[r][c] === player && b[r+1][c+1] === player && b[r+2][c+2] === player && b[r+3][c+3] === player)
                return [[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3]];
        }
    }
    // Diagonal ↙
    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (b[r][c] === player && b[r-1][c+1] === player && b[r-2][c+2] === player && b[r-3][c+3] === player)
                return [[r,c],[r-1,c+1],[r-2,c+2],[r-3,c+3]];
        }
    }
    return null;
}

function isBoardFull(b) {
    return b[0].every(cell => cell !== EMPTY);
}

function checkEnd() {
    const winCells = checkWinner(board, currentPlayer);
    if (winCells) {
        highlightWin(winCells);
        const name = playerName(currentPlayer);
        playerTurnEl.innerHTML = `<span class="chip-icon" style="background:${playerColor(currentPlayer)}"></span>${name} wins! 🎉`;
        gameOver = true;
        return true;
    }
    if (isBoardFull(board)) {
        playerTurnEl.innerHTML = "It's a draw! 🤝";
        gameOver = true;
        return true;
    }
    return false;
}

function highlightWin(cells) {
    cells.forEach(([r, c]) => tbRow[r].children[c].classList.add('winner'));
}

// ─── Turn display ─────────────────────────────────────────────────────────────
function updateTurnDisplay() {
    if (gameOver) return;
    const name = playerName(currentPlayer);
    const color = playerColor(currentPlayer);
    playerTurnEl.innerHTML =
        `<span class="chip-icon" style="background:${color}"></span>${name}'s turn`;
}

function playerName(player) {
    if (player === P1) return 'Red';
    return vsComputer ? 'Computer' : 'Yellow';
}

function playerColor(player) {
    return player === P1 ? '#e31c25' : '#ffd700';
}

// ─── AI ───────────────────────────────────────────────────────────────────────
function scheduleComputerMove() {
    aiThinking = true;
    playerTurnEl.innerHTML = `<span class="chip-icon" style="background:#ffd700"></span>Computer is thinking<span class="thinking">…</span>`;
    setTimeout(computerMove, 420);
}

function computerMove() {
    const col = chooseComputerCol();
    dropPiece(col, P2);
    aiThinking = false;
    if (checkEnd()) return;
    currentPlayer = P1;
    updateTurnDisplay();
}

function chooseComputerCol() {
    const validCols = getValidCols(board);

    if (difficulty === 'easy') {
        return randomChoice(validCols);
    }

    if (difficulty === 'medium') {
        // Win if possible
        for (const col of validCols) {
            if (simulatesWin(board, col, P2)) return col;
        }
        // Block opponent win
        for (const col of validCols) {
            if (simulatesWin(board, col, P1)) return col;
        }
        // Prefer center
        const centerOrder = [3, 2, 4, 1, 5, 0, 6];
        return centerOrder.find(c => validCols.includes(c)) ?? randomChoice(validCols);
    }

    // Hard: minimax with alpha-beta, depth scales with game progress
    const emptyCells = board.flat().filter(v => v === EMPTY).length;
    const depth = emptyCells <= 12 ? 9 : emptyCells <= 24 ? 7 : 5;
    const result = minimax(board, depth, -Infinity, Infinity, true);
    return result.col ?? randomChoice(validCols);
}

function getValidCols(b) {
    const cols = [];
    for (let c = 0; c < COLS; c++) {
        if (b[0][c] === EMPTY) cols.push(c);
    }
    return cols;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function simulatesWin(b, col, player) {
    const copy = cloneBoard(b);
    for (let row = ROWS - 1; row >= 0; row--) {
        if (copy[row][col] === EMPTY) {
            copy[row][col] = player;
            break;
        }
    }
    return checkWinner(copy, player) !== null;
}

// ─── Minimax ──────────────────────────────────────────────────────────────────
function minimax(b, depth, alpha, beta, maximizing) {
    const validCols = getValidCols(b);
    const isWinP2   = checkWinner(b, P2) !== null;
    const isWinP1   = checkWinner(b, P1) !== null;
    const full      = isBoardFull(b);

    if (isWinP2)        return { score:  100000 + depth, col: null };
    if (isWinP1)        return { score: -100000 - depth, col: null };
    if (full || depth === 0) return { score: scoreBoard(b), col: null };

    // Prefer center column ordering for better pruning
    const orderedCols = validCols.slice().sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3));

    let bestCol   = orderedCols[0];
    let bestScore = maximizing ? -Infinity : Infinity;

    for (const col of orderedCols) {
        const copy = cloneBoard(b);
        dropIntoBoard(copy, col, maximizing ? P2 : P1);
        const result = minimax(copy, depth - 1, alpha, beta, !maximizing);

        if (maximizing) {
            if (result.score > bestScore) { bestScore = result.score; bestCol = col; }
            alpha = Math.max(alpha, bestScore);
        } else {
            if (result.score < bestScore) { bestScore = result.score; bestCol = col; }
            beta = Math.min(beta, bestScore);
        }
        if (beta <= alpha) break;
    }
    return { score: bestScore, col: bestCol };
}

function scoreBoard(b) {
    let score = 0;
    // Center column preference
    for (let r = 0; r < ROWS; r++) {
        if (b[r][3] === P2) score += 4;
        if (b[r][3] === P1) score -= 4;
    }
    score += scoreDirection(b, 0, 1);   // horizontal
    score += scoreDirection(b, 1, 0);   // vertical
    score += scoreDirection(b, 1, 1);   // diagonal ↘
    score += scoreDirection(b, 1, -1);  // diagonal ↙
    return score;
}

function scoreDirection(b, dr, dc) {
    let score = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const window = [];
            for (let k = 0; k < 4; k++) {
                const nr = r + dr * k;
                const nc = c + dc * k;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) window.push(b[nr][nc]);
            }
            if (window.length === 4) score += scoreWindow(window);
        }
    }
    return score;
}

function scoreWindow(w) {
    const p2count = w.filter(v => v === P2).length;
    const p1count = w.filter(v => v === P1).length;
    const empty   = w.filter(v => v === EMPTY).length;
    if (p2count === 4)                      return 1000;
    if (p2count === 3 && empty === 1)       return 10;
    if (p2count === 2 && empty === 2)       return 2;
    if (p1count === 3 && empty === 1)       return -80;
    if (p1count === 4)                      return -1000;
    return 0;
}

function cloneBoard(b) {
    return b.map(row => row.slice());
}

function dropIntoBoard(b, col, player) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (b[row][col] === EMPTY) { b[row][col] = player; return; }
    }
}

// ─── Reset ────────────────────────────────────────────────────────────────────
function resetGame() {
    board         = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
    currentPlayer = P1;
    gameOver      = false;
    aiThinking    = false;

    slots.forEach(s => {
        s.className = 'slot empty';
    });
    colArrows.forEach(a => a.classList.remove('visible'));

    updateTurnDisplay();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.getElementById('myButton').addEventListener('click', resetGame);
resetGame();
