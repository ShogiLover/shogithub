document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const kifFile = document.getElementById("kif-file");

    const pieces = [
        "bP", "bL", "bN", "bS", "bG", "bK", "bB", "bR",
        "bP", "bL", "bN", "bS", "bG", "bK", "bB", "bR",
        "bP", "bL", "bN", "bS", "bG", "bK", "bB", "bR",
        "bP", "bL", "bN", "bS", "bG", "bK", "bB", "bR",
        "bP", "bL", "bN", "bS", "bG", "bK", "bB", "bR",
        "eP", "eP", "eP", "eP", "eP", "eP", "eP", "eP",
        "wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP",
        "wL", "wN", "wS", "wG", "wK", "wB", "wS", "wR"
    ];

    pieces.forEach(piece => {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add("chess-piece");
        pieceElement.innerText = piece;
        pieceElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", piece);
        });
        board.appendChild(pieceElement);
    });

    board.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });

    board.addEventListener("drop", (e) => {
        e.preventDefault();
        const droppedPiece = e.dataTransfer.getData("text/plain");
        const target = e.target;

        if (target.classList.contains("chess-piece")) {
            target.remove();
        }

        const targetIndex = Array.from(board.children).indexOf(target);
        const pieceIndex = pieces.indexOf(droppedPiece);
        if (pieceIndex === -1) return;

        pieces.splice(pieceIndex, 1);
        pieces.splice(targetIndex, 0, droppedPiece);

        updateKIFFile();
    });

    function updateKIFFile() {
        kifFile.textContent = pieces.join(" ");
    }
});
