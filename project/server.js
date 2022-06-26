if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const initializepassport = require("./passport-config");
initializepassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: "chandu" });
});
app.get("/Login", (req, res) => {
  res.render("Login.ejs");
});
app.post(
  "/Login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/Login",
    failureFlash: true
  })
);

app.get("/Register", (req, res) => {
  res.render("Register.ejs");
});
app.post("/Register", async (req, res) => {
  try {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedpassword
    });
    res.redirect("/Login");
  } catch {
    res.redirect("/Register");
  }
});
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/Login");
}

app.listen(3000);
