const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  Asset,
  Keypair,
  TransactionBuilder,
  Operation,
  Networks,
} = require("diamante-base");
const { Horizon } = require("diamante-sdk-js");
const DiamSdk = require("diamnet-sdk");
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());


app.get("/account-detail", async (req, res) => {
  try {
    console.log("fetching account details");
    const { publicKey } = req.body;
    const fetch = await import("node-fetch").then((mod) => mod.default);
    const response = await fetch(
      `https://diamtestnet.diamcircle.io/accounts/${publicKey}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch account ${publicKey}: ${response}`);
    }
    const result = await response.json();
    res.json({ message: result });
  } catch (error) {
    console.error("Error in fetching account details:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/create-keypair", (req, res) => {
  try {
    console.log("Creating keypair started");
    const pair = DiamSdk.Keypair.random();
    res.json({
      publicKey: pair.publicKey(),
      secret: pair.secret(),
    });
  } catch (error) {
    console.error("Error in create-keypair:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/activate-account", async (req, res) => {
  try {
    console.log("Account activation started");
    const { publicKey } = req.body;
    const response = await fetch(
      `https://friendbot.diamcircle.io?addr=${encodeURIComponent(publicKey)}`
    );
    const data = response.json();
    res.json({
      message: `Account ${publicKey} activated successfully`,
      data: data,
    });
  } catch (error) {
    console.error("Error in fund-account:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/pay", async (req, res) => {
  try {
    console.log("Payment initiated");
    const { sender, receiver, amount } = req.body;
    const server = new DiamSdk.Aurora.Server("https://diamtestnet.diamcircle.io");
    const sourceKeys = DiamSdk.Keypair.fromSecret(sender);
    const destinationId = receiver;
    let transaction;
    server
      .loadAccount(destinationId)
      .catch(function (error) {
        if (error instanceof DiamSdk.NotFoundError) {
          throw new Error("The destination account does not exist!");
        } else return error;
      })
      .then(function () {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then(function (sourceAccount) {
        transaction = new DiamSdk.TransactionBuilder(sourceAccount, {
          fee: DiamSdk.BASE_FEE,
          networkPassphrase: DiamSdk.Networks.TESTNET,
        })
          .addOperation(
            DiamSdk.Operation.payment({
              destination: destinationId,
              asset: DiamSdk.Asset.native(),
              amount: amount,
            })
          )
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Diamante treats the transaction.
          .addMemo(DiamSdk.Memo.text("Test Transaction"))
          // Wait a maximum of three minutes for the transaction
          .setTimeout(180)
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Diamante!
        return server.submitTransaction(transaction);
      })
      .then(function (result) {
        console.log("Success! Results:", result);
        res.status(200).json({message: "Success"});
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        res.status(500).json({message: error})
      });
  } catch (error) {
    console.log("Error in making the payment", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/check-balance", async (req, res) => {
  try {
    console.log("Fetching account balance started");
    // const { publicKey } = req.body;
    const { publicKey } = req.query;
    const server = new DiamSdk.Aurora.Server(
      "https://diamtestnet.diamcircle.io/"
    );
    const account = await server.loadAccount(publicKey);
    let balanceList = [];
    account.balances.forEach(function (balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
      balanceList.push({
        asset_type: balance.asset_type,
        balance: balance.balance,
      });
    });
    res.json({ balanceInfo: balanceList });
  } catch (error) {
    console.error("Error in fetching account details:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Diamante backend listening at http://localhost:${port}`);
});
