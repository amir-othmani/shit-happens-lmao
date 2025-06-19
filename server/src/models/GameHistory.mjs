function GameHistory(gameId, dateGame, wonGame, cards = []) {
    this.gameId = gameId;
    this.dateGame = dateGame;
    this.wonGame = wonGame;
    this.cards = cards;
}

export default GameHistory;