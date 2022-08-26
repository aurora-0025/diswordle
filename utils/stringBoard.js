/**
 * @param {string} board 
 */
module.exports = async function stringBoard(board) {
    const newBoard = [];
    for (let row of board) {
      newBoard.push(row.join(""));
    }
    return newBoard.join("\n");
  }