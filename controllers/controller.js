const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "secret line", {
    expiresIn: maxAge,
  });
};

module.exports = {
  singup_get: (req, res) => res.send("Sing up get"),
  singup_post: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie("JWT", token, { maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    } catch (error) {
      console.log(error);
      res.status(400).send("user not created, error");
    }
  },
  login_get: (req, res) => res.send("Login get"),

  login_post: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.login({ email, password });
      const token = createToken(user._id);
      res.cookie("JWT", token, { maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } catch (error) {
      res.status(400).json({});
    }
  },

  404: (req, res) => res.send("404"),

  set_cookies: (req, res) => {
    res.cookie("newUser", false);
    res.cookie("isEmployee", true, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.send("you got the cookies!");
  },

  read_cookies: (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);

    res.json(cookies);
  },

  logout: (req, res) => {
    res.cookies("JWT", "", { maxAge: 1 });
    res.redirect("/");
  },
};
