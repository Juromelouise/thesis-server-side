const express = require("express");
const app = express();
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const google = require("./router/google");
const user = require("./router/user");
const announce = require("./router/announcement");

app.use(
  cors({
    origin: `${process.env.ORIGIN}`,
    credentials: true,
  })
);
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", google);
app.use("/user", user);
app.use("/announce", announce);

module.exports = app;
