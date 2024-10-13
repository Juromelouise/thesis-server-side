const Tesseract = require("tesseract.js");

(async () => {
  const worker = await Tesseract.createWorker();

  const { data: { text } } = await worker.recognize('C:/Thesis/System/backend/image/Capture.PNG');
  console.log(text);

  await worker.terminate();
})();
