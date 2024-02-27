const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const botsData = require("./src/botsData");
const {rollbarToken} = process.env;

// ROLLBAR
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: rollbarToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'))
// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  rollbar.info('GET request to /api/robots');
  try {
    res.status(200).send(botsData);
  } catch (error) {
    rollbar.error(error);
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  rollbar.info('GET request to /api/robots/shuffled');
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    rollbar.error(error);
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  rollbar.info('POST request to /api/duel');
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    rollbar.error("ERROR DUELING" + error);
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  rollbar.info('GET request to /api/player');
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    rollbar.error(`ERROR GETTING PLAYER STATS: ${error}`);
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
