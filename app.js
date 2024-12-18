const express = require("express");
const app = express();
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const google = require("./router/google");
const user = require("./router/user");
const announce = require("./router/announcement");
const report = require("./router/report");

app.use(
  cors({
    origin: `${process.env.ORIGIN}`,
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
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
app.use("/report", report);

module.exports = app;
