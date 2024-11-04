let players;

function createDeck() {
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function dealCard(deck) {
  return deck.pop();
}

function calculateScore(cards) {
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

async function playerDecision(
  deck,
  playerCards,
  player,
  resolvePlayerDecision
) {
  let score = calculateScore(playerCards);
  console.log(`您的牌是 ${JSON.stringify(playerCards)}，目前的分數是 ${score}`);
  if (score > 21) {
    console.log("爆牌了！");
    resolvePlayerDecision(); // 繼續下一個玩家的決定
    return;
  } else if (score === 21) {
    console.log("恭喜，您得到了21點！");
    resolvePlayerDecision(); // 繼續下一個玩家的決定
    return;
  }

  document.getElementById("hitButton").disabled = false;
  document.getElementById("standButton").disabled = false;

  document.getElementById("hitButton").onclick = function () {
    playerCards.push(dealCard(deck));
    player.DrawCount++;
    score = calculateScore(playerCards);
    console.log(
      `您的牌是 ${JSON.stringify(playerCards)}，目前的分數是 ${score}`
    );
    if (score > 21) {
      console.log("爆牌了！");
      resolvePlayerDecision(); // 繼續下一個玩家的決定
    }
    checkAllPlayersDone();
  };

  document.getElementById("standButton").onclick = function () {
    resolvePlayerDecision(); // 繼續下一個玩家的決定
    checkAllPlayersDone();
  };
}

function checkAllPlayersDone() {
  // 檢查是否所有玩家都已經做出了決定
  const allDone = players.every((player) => player.isDone);
  if (allDone) {
    // 如果所有玩家都做出了決定，禁用按鈕
    document.getElementById("hitButton").disabled = true;
    document.getElementById("standButton").disabled = true;
  }
}

async function playBlackjack(numPlayers) {
  const deck = createDeck();
  const players = Array.from({ length: numPlayers }, (_, i) => ({
    Name: `Player ${i + 1}`,
    Cards: [],
  }));

  const dealerIndex = Math.floor(Math.random() * numPlayers);
  const dealer = players[dealerIndex].Name;
  console.log(`\n本輪的莊家是：${dealer}`);

  players.forEach((player) => {
    player.Cards.push(dealCard(deck), dealCard(deck));
  });

  for (const player of players) {
    if (player.Name !== dealer) {
      console.log(`\n輪到 ${player.Name} 決定：`);
      await new Promise((resolve) => {
        playerDecision(deck, player.Cards, player, () => {
          player.isDone = true; // 標記玩家為完成狀態
          resolve();
        });
      });
    }
  }

  console.log(`\n輪到莊家 ${dealer} 決定：`);
  let dealerCards = players[dealerIndex].Cards;
  let dealerScore = calculateScore(dealerCards);
  console.log(
    `莊家的初始牌是 ${JSON.stringify(dealerCards)}，目前的分數是 ${dealerScore}`
  );
  while (dealerScore < 17) {
    dealerCards.push(dealCard(deck));
    dealerScore = calculateScore(dealerCards);
    console.log(
      `莊家拿了一張牌，現在的牌是 ${JSON.stringify(
        dealerCards
      )}，目前的分數是 ${dealerScore}`
    );
  }

  players[dealerIndex].isDone = true; // 標記莊家為完成狀態
  checkAllPlayersDone();

  // 顯示每個玩家的最後點數和持有的牌數
  console.log("\n遊戲結束，每個玩家的最後點數和持有的牌數如下：");
  players.forEach((player) => {
    const playerScore = calculateScore(player.Cards);
    const cardCount = player.Cards.length; // 計算玩家持有的牌數
    console.log(
      `${player.Name} 的最後點數是：${playerScore}，持有的牌數是：${cardCount}`
    );
  });
}

// 啟動遊戲
const playerNum = parseInt(prompt("請問多少人會參加這個游戲:"), 10);
playBlackjack(playerNum);
