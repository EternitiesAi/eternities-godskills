#!/usr/bin/env node
import { createInterface } from "node:readline";
import {
  createInitialBinState,
  enumerateSpinnerOutcomes,
  evaluateSpinnerTrial,
  spinnerDistribution,
  transferBins,
} from "./simulation.mjs";

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
let inputClosed = false;
const queuedLines = [];
const pendingQuestions = [];
rl.on("line", (line) => {
  const resolve = pendingQuestions.shift();
  if (resolve) resolve(line);
  else queuedLines.push(line);
});
rl.on("close", () => {
  inputClosed = true;
  while (pendingQuestions.length > 0) pendingQuestions.shift()(null);
});

function ask(prompt) {
  process.stdout.write(prompt);
  if (queuedLines.length > 0) return Promise.resolve(queuedLines.shift());
  if (inputClosed) return Promise.resolve(null);
  return new Promise((resolve) => pendingQuestions.push(resolve));
}

function showBins(state) {
  console.log(`Current state: A=${state.A} tokens; B=${state.B}/4 tokens capacity.`);
}

async function runBinTransferAssessment() {
  const state = { A: 2, B: 3 };
  const k = 2;
  console.log(
    "Transfer check (separate hypothetical state): A=2, B=3, B capacity=4, proposed k=2.",
  );
  const prediction = await ask("Predict: accept the whole transfer? Enter yes or no: ");
  if (prediction === null) return;
  const explanation = await ask("Which source and capacity checks determine your answer? ");
  if (explanation === null) return;

  const result = transferBins(state, k);
  const predictedAcceptance = /^yes$/i.test(prediction.trim());
  console.log(
    `Feedback: the proposal is ${result.accepted ? "accepted" : "rejected"}; state remains A=${result.state.A}, B=${result.state.B}.`,
  );
  if (/^(yes|no)$/i.test(prediction.trim())) {
    console.log(
      predictedAcceptance === result.accepted
        ? "Your accept/reject prediction matches this rule. Compare your reason with the checks below."
        : "Your accept/reject prediction differs from this rule. Compare your reason with the checks below.",
    );
  } else {
    console.log("No yes/no prediction was scored; compare the rule and your explanation below.");
  }
  console.log(
    `Answer key: A>=k is ${result.checks.enoughInA}; B+k<=4 is ${result.checks.capacityAvailableInB}. Both must pass, so the whole proposal is rejected and neither count changes.`,
  );
  console.log(`Your explanation: ${explanation.trim() || "(blank)"}`);
}

async function runBinsLesson() {
  console.log("LESSON 1 — Atomic token transfer");
  console.log(
    "Objective: predict whether a proposed transfer is accepted as a whole, using the source-count and destination-capacity checks.",
  );
  console.log("Rule: k moves from A to B only when A>=k and B+k<=4, checked on the old state.");
  console.log("Enter k from 0 to 3, r to reset, t for a transfer check, or q to quit.");
  let state = createInitialBinState();
  showBins(state);

  while (true) {
    const rawAction = await ask("Action: ");
    if (rawAction === null) break;
    const action = rawAction.trim().toLowerCase();
    if (action === "q") break;
    if (action === "r") {
      state = createInitialBinState();
      console.log("Reset restores A=3, B=2. No learner responses are saved.");
      showBins(state);
      continue;
    }
    if (action === "t") {
      await runBinTransferAssessment();
      continue;
    }
    if (!/^(0|[1-3])$/.test(action)) {
      console.log("Rejected input: enter one whole-number k from 0 to 3. State is unchanged.");
      showBins(state);
      continue;
    }

    const k = Number(action);
    const prediction = await ask(
      `Before committing k=${k}, predict: accepted or rejected, and what will A and B be? `,
    );
    if (prediction === null) break;
    console.log(`Prediction recorded for this session: ${prediction.trim() || "(blank)"}`);

    const result = transferBins(state, k);
    console.log(
      `Old-state checks: A>=k is ${result.checks.enoughInA}; B+k<=4 is ${result.checks.capacityAvailableInB}.`,
    );
    if (result.accepted) {
      console.log(`Feedback: accepted as a whole; new state is A=${result.state.A}, B=${result.state.B}.`);
    } else {
      console.log(
        `Feedback: rejected as a whole (${result.reason}); neither bin changed. State is A=${result.state.A}, B=${result.state.B}.`,
      );
    }
    console.log("Both checks read the same old state; the two counts commit together only if both pass.");
    const explanation = await ask("Explain the observed change using those checks: ");
    if (explanation === null) break;
    console.log(`Explanation prompt response: ${explanation.trim() || "(blank)"}`);
    state = result.state;
  }
}

function printAllSpinnerOutcomes() {
  console.log("Exact enumeration: all 16 ordered sector pairs, grouped below by their identities.");
  for (const outcome of enumerateSpinnerOutcomes()) {
    const status = outcome.success ? "SUCCESS" : "not success";
    console.log(
      `${outcome.first.id}(${outcome.first.value}) + ${outcome.second.id}(${outcome.second.value}) = ${outcome.total}: ${status}`,
    );
  }

  const distribution = spinnerDistribution();
  console.log("Total | ordered pairs | exact proportion");
  for (const row of distribution.byTotal) {
    console.log(`${row.total}     | ${row.count}/16         | ${row.count}/16`);
  }
  console.log(
    `Success (total>=3): ${distribution.successCount}/16; not success: ${distribution.failureCount}/16.`,
  );
}

function predictionMatchesExactCount(prediction, exactCount) {
  const normalized = prediction.trim().replaceAll(" ", "");
  return normalized === String(exactCount) || normalized === `${exactCount}/16`;
}

async function runSpinnerTransferAssessment() {
  console.log(
    "Transfer check: a new hypothetical spinner has equally likely sectors T0=0, T1=1, T2=2; two independent spins; success means total>=3.",
  );
  const count = await ask("Before checking: how many of the 9 ordered pairs are successful? ");
  if (count === null) return;
  const explanation = await ask("Name the successful pairs and explain what one replay can show: ");
  if (explanation === null) return;
  if (count.trim() === "3") {
    console.log("Your count matches the exact transfer answer: 3/9 = 1/3.");
  } else {
    console.log(`Exact transfer answer: 3/9 = 1/3; the successful pairs are (T1,T2), (T2,T1), and (T2,T2).`);
  }
  console.log(
    `Answer key: a replayed single pair shows that pair's result; it does not enumerate the other eight pairs. Your explanation: ${explanation.trim() || "(blank)"}`,
  );
}

async function runSpinnerLesson() {
  console.log("LESSON 2 — One spinner trial and the full finite distribution");
  console.log(
    "Objective: explain why repeating one selected trial does not reveal the exact distribution of all permitted outcomes.",
  );
  console.log(
    "Sectors: S0=0, S1=1, S2=1, S3=2. The supplied toy rule says each sector is equally likely and the two spins are independent; success means total>=3.",
  );
  console.log(
    "This offline lesson makes no random draw: you choose one legal pair, may replay it, then inspect an exact enumeration of all pairs.",
  );

  const wholeSpacePrediction = await ask(
    "Before the enumeration, predict how many of the 16 ordered pairs succeed (or give a fraction): ",
  );
  if (wholeSpacePrediction === null) return;

  let chosen;
  while (!chosen) {
    const firstInput = await ask("Choose the first sector identity (S0-S3, or q to quit): ");
    if (firstInput === null) return;
    const firstId = firstInput.trim().toUpperCase();
    if (firstId === "Q") return;

    const secondInput = await ask("Choose the second sector identity (S0-S3, or q to quit): ");
    if (secondInput === null) return;
    const secondId = secondInput.trim().toUpperCase();
    if (secondId === "Q") return;

    chosen = evaluateSpinnerTrial(firstId, secondId);
    if (!chosen.valid) {
      console.log("Rejected input: use sector identities S0, S1, S2, or S3. No trial state changed.");
      chosen = null;
    }
  }

  const trialPrediction = await ask(
    `Before reveal, predict the total and whether ${chosen.first.id}+${chosen.second.id} succeeds: `,
  );
  if (trialPrediction === null) return;
  console.log(`Prediction recorded for this session: ${trialPrediction.trim() || "(blank)"}`);
  console.log(
    `Feedback: ${chosen.first.id}(${chosen.first.value}) + ${chosen.second.id}(${chosen.second.value}) = ${chosen.total}; ${chosen.success ? "SUCCESS" : "not success"}.`,
  );
  const explanation = await ask("What did this one selected pair establish, and what remains unknown from it? ");
  if (explanation === null) return;
  console.log(`Explanation prompt response: ${explanation.trim() || "(blank)"}`);

  const replayChoice = await ask("Replay the exact same selected pair? Enter yes or no: ");
  if (replayChoice === null) return;
  if (/^yes$/i.test(replayChoice.trim())) {
    const replayPrediction = await ask("Before replay, predict whether the result will change: ");
    if (replayPrediction === null) return;
    const replay = evaluateSpinnerTrial(chosen.first.id, chosen.second.id);
    console.log(
      `Replay: ${replay.first.id}(${replay.first.value}) + ${replay.second.id}(${replay.second.value}) = ${replay.total}; ${replay.success ? "SUCCESS" : "not success"}. Same chosen inputs give the same arithmetic result.`,
    );
    console.log("A replay is still one selected pair; it is not the distribution of all permitted pairs.");
    const replayExplanation = await ask("Explain why the replay does not replace the full enumeration: ");
    if (replayExplanation === null) return;
    console.log(`Replay explanation response: ${replayExplanation.trim() || "(blank)"}`);
  } else {
    console.log("No replay run. The selected pair remains a single illustrative outcome.");
  }

  printAllSpinnerOutcomes();
  const exact = spinnerDistribution();
  if (predictionMatchesExactCount(wholeSpacePrediction, exact.successCount)) {
    console.log("Your whole-space count matches the exact enumeration; a matching guess alone does not show understanding.");
  } else {
    console.log(`Exact whole-space success count: ${exact.successCount}/16. Compare the 16 rows with your prediction.`);
  }
  const wholeSpaceExplanation = await ask("Explain why one replay and the 16-pair distribution answer different questions: ");
  if (wholeSpaceExplanation === null) return;
  console.log(`Explanation prompt response: ${wholeSpaceExplanation.trim() || "(blank)"}`);
  await runSpinnerTransferAssessment();
}

async function main() {
  const mode = process.argv[2];
  if (mode === "bins") {
    await runBinsLesson();
  } else if (mode === "spinner") {
    await runSpinnerLesson();
  } else {
    console.log("Offline toy lesson package (Node.js 18+; no install or network).");
    console.log("Usage: node learner.mjs bins | spinner");
    console.log("Checks: node --test");
    if (mode !== undefined) process.exitCode = 2;
  }
}

try {
  await main();
} finally {
  rl.close();
}
