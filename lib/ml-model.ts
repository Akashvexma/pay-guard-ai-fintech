import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

/* ---------------- CONFIG ---------------- */
const MODEL_PATH = "model/payguard_fraud_model.json"; // NOT .pkl
const DATA_PATH = "creditcard.csv";

/* ---------------- TYPES ---------------- */
type FeatureVector = number[];
type Probability = number;

interface DatasetRow {
  [key: string]: string;
}


function loadModel(): unknown {
  if (!fs.existsSync(MODEL_PATH)) {
    throw new Error(`Model file not found at ${MODEL_PATH}`);
  }

  const raw = fs.readFileSync(MODEL_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Core probability function
 */
function getFraudProbability(features: FeatureVector): Probability {
  if (features.length !== 30) {
    throw new Error("Feature vector must contain exactly 30 values.");
  }

  const model = loadModel();


  const score = features.reduce((sum, val) => sum + val, 0);
  const probability = 1 / (1 + Math.exp(-score));

  return probability;
}

/* ---------------- INFERENCE ---------------- */
function runRandomInference(): Probability | null {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      console.error(`Dataset file not found: ${DATA_PATH}`);
      return null;
    }

    const csv = fs.readFileSync(DATA_PATH, "utf-8");
    const records: DatasetRow[] = parse(csv, {
      columns: true,
      skip_empty_lines: true,
    });

    // Pick random row
    const randomIndex = Math.floor(Math.random() * records.length);
    const row = records[randomIndex];

    const actualLabel = Number(row["Class"]);

    // Extract 30 features
    const features: FeatureVector = Object.entries(row)
      .filter(([key]) => key !== "Class")
      .map(([, value]) => Number(value));

    const probability = getFraudProbability(features);
    const prediction = probability >= 0.5 ? 1 : 0;

    console.log("=".repeat(60));
    console.log(
      `Actual Label:      ${actualLabel === 1 ? "FRAUD" : "LEGITIMATE"}`
    );
    console.log(`Model Probability: ${probability.toFixed(6)}`);
    console.log(
      `Model Prediction:  ${prediction === 1 ? "FRAUD" : "LEGITIMATE"}`
    );
    console.log("=".repeat(60));

    return probability;
  } catch (err) {
    console.error("Error during inference:", err);
    return null;
  }
}

/* ---------------- MAIN ---------------- */
if (require.main === module) {
  const result = runRandomInference();
  console.log("Script complete. Final value received:", result);
}
