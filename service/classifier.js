// Import libraries
const natural = require("natural");
const classifier = new natural.BayesClassifier();
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

// Example training data (user reports)
const violationReports = [
  {
    description: "driveway",
    violation: "Blocking Driveway",
  },
  { description: "no parking zone", violation: "No Parking Zone" },
  {
    description: "fire hydrant",
    violation: "Fire Hydrant Parking",
  },
  {
    description: "sidewalk",
    violation: "Sidewalk Parking",
  },
];

// Training the classifier
violationReports.forEach((report) => {
  classifier.addDocument(report.description.toLowerCase(), report.violation);
});

// Train the classifier with the training data
classifier.train();

// TensorFlow model training data (more structured for TensorFlow)
const trainingData = violationReports.map((report) => ({
  input: report.description.toLowerCase(),
  output: report.violation,
}));

// Convert string inputs to numerical values
const tokenizeText = (text) => {
  const words = text.split(" ");
  return words.map((word) => word.length); // Simple encoding (length of words) - can be improved
};

// Prepare input and output tensors for TensorFlow.js
const inputs = tf.tensor2d(
  trainingData.map((data) => tokenizeText(data.input)),
  [trainingData.length, trainingData[0].input.split(" ").length]
);
const outputs = tf.oneHot(
  trainingData.map((data) =>
    violationReports.findIndex((v) => v.violation === data.output)
  ),
  violationReports.length
);

// Build and compile a TensorFlow.js model
const model = tf.sequential();
model.add(
  tf.layers.dense({
    units: 16,
    inputShape: [inputs.shape[1]],
    activation: "relu",
  })
);
model.add(
  tf.layers.dense({ units: violationReports.length, activation: "softmax" })
);

model.compile({
  optimizer: "adam",
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

// Train the TensorFlow.js model
(async () => {
  await model.fit(inputs, outputs, { epochs: 100 });
})();

// Function to classify new user reports and return an array of violations
const classifyReport = (userDescription) => {
  const descriptionTokens = userDescription.toLowerCase().split(" "); // Tokenize description
  const detectedViolations = [];

  // Natural keyword matching
  violationReports.forEach((report) => {
    let found = false;
    // Tokenize the report description and check if any words are present in the user report
    report.description
      .toLowerCase()
      .split(" ")
      .forEach((word) => {
        if (descriptionTokens.includes(word)) {
          found = true;
        }
      });

    // If words match, add violation to the result array
    if (found) {
      detectedViolations.push(report.violation);
    }
  });

  // TensorFlow.js prediction (improves over natural matching)
  const tokenizedDescription = tokenizeText(userDescription);
  const inputTensor = tf.tensor2d(
    [tokenizedDescription],
    [1, tokenizedDescription.length]
  );

  const prediction = model.predict(inputTensor);
  const predictionIndex = prediction.argMax(-1).dataSync()[0];
  const predictedViolation = violationReports[predictionIndex].violation;

  console.log(
    `Report: "${userDescription}" -> Detected Violations: [${detectedViolations.join(
      ", "
    )}], TensorFlow Prediction: ${predictedViolation}`
  );

  return {
    natural: detectedViolations,
    tensorflow: predictedViolation,
  };
};

// Example usage
const newReport =
  "The car is parked in front of the fire hydrant and blocking the driveway";
const violationTypes = classifyReport(newReport);

module.exports = classifyReport;
