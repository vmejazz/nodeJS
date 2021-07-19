const { Router } = require("express");
const controller = require("../controllers/controller");
const { requireAuth, ckeckUser } = require("../middleware/authMiddleware");

const router = Router();

router.get("*", ckeckUser);
router.get("/singup", controller.singup_get);
router.post("/singup", controller.singup_post);
router.get("/login", controller.login_get);
router.post("/login", controller.login_post);
router.get("/error", controller[404]);
router.get("/logout", controller.logout);
router.get("/set-cookies", controller.set_cookies);
router.get("/read-cookies", controller.read_cookies);
router.get("/cool-page", requireAuth, (req, res) =>
  res.send("Успешная авторизация")
);

module.exports = router;
