export function createDeck() {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks = [
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];
  const deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({ Suit: suit, Rank: rank });
    });
  });

  shuffle(deck);
  return deck;
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function dealCard(deck) {
  return deck.pop();
}
