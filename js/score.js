export function calculateScore(cards) {
  let score = 0;
  let aceCount = 0;
  const cardValues = {
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 10,
    Queen: 10,
    King: 10,
    Ace: 1,
  };

  cards.forEach((card) => {
    const rank = card.Rank;
    if (rank === "Ace") {
      aceCount++;
    } else {
      score += cardValues[rank];
    }
  });

  for (let i = 0; i < aceCount; i++) {
    if (score + 11 > 21) {
      score += 1;
    } else {
      score += 11;
    }
  }

  return score;
}
