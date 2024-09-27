const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

dotenv.config({ path: "./config/.env" });

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((con) => {
      console.log(
        `Connected with Host: ${con.connection.host}:${process.env.PORT}`
      );
    });
};

connectDatabase();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

app.listen(process.env.PORT);
