// Import libraries
const natural = require("natural");
const classifier = new natural.BayesClassifier();

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

// Function to classify new user reports and return an array of violations
const classifyReport = (userDescription) => {
  const descriptionTokens = userDescription.toLowerCase().split(' '); // Tokenize description
  const detectedViolations = [];

  // Check each violation report for keywords
  violationReports.forEach((report) => {
    let found = false;
    // Tokenize the report description and check if any words are present in the user report
    report.description.toLowerCase().split(' ').forEach((word) => {
      if (descriptionTokens.includes(word)) {
        found = true;
      }
    });

    // If words match, add violation to the result array
    if (found) {
      detectedViolations.push(report.violation);
    }
  });

  console.log(
    `Report: "${userDescription}" -> Detected Violations: [${detectedViolations.join(
      ', '
    )}]`
  );
  return detectedViolations;
}

// Example usage
const newReport =
  "The car is parked in front of the fire hydrant and blocking the driveway";
const violationTypes = classifyReport(newReport);

module.exports = classifyReport;
