import { createDeck, shuffle, dealCard } from "./deck.js";
import { calculateScore } from "./score.js";

let players = [];

export async function playerDecision(
  deck,
  playerCards,
  player,
  resolvePlayerDecision
) {
  let score = calculateScore(playerCards);
  console.log(`您的牌是 ${JSON.stringify(playerCards)}，目前的分數是 ${score}`);
  if (score > 21) {
    console.log("爆牌了！");
    resolvePlayerDecision();
    return;
  } else if (score === 21) {
    console.log("恭喜，您得到了21點！");
    resolvePlayerDecision();
    return;
  }

  document.getElementById("hitButton").disabled = false;
  document.getElementById("standButton").disabled = false;

  document.getElementById("hitButton").onclick = function () {
    playerCards.push(dealCard(deck));
    score = calculateScore(playerCards);
    console.log(
      `您的牌是 ${JSON.stringify(playerCards)}，目前的分數是 ${score}`
    );
    if (score > 21) {
      console.log("爆牌了！");
      resolvePlayerDecision();
    }
    checkAllPlayersDone();
  };

  document.getElementById("standButton").onclick = function () {
    resolvePlayerDecision();
    checkAllPlayersDone();
  };
}

function checkAllPlayersDone() {
  const allDone = players.every((player) => player.isDone);
  if (allDone) {
    document.getElementById("hitButton").disabled = true;
    document.getElementById("standButton").disabled = true;
  }
}

export async function playBlackjack(numPlayers) {
  const deck = createDeck();
  players = Array.from({ length: numPlayers }, (_, i) => ({
    Name: `Player ${i + 1}`,
    Cards: [],
    isDone: false,
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
          player.isDone = true;
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

  players[dealerIndex].isDone = true;
  checkAllPlayersDone();

  console.log("\n遊戲結束，每個玩家的最後點數和持有的牌數如下：");
  players.forEach((player) => {
    const playerScore = calculateScore(player.Cards);
    const cardCount = player.Cards.length;
    console.log(
      `${player.Name} 的最後點數是：${playerScore}，持有的牌數是：${cardCount}`
    );
  });
}
