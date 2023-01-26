var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

const userController = require("../controllers/userController");
/* GET users listing. */
router.get("/sign-up", userController.sign_up_get);

router.post("/sign-up", upload.single("image"), userController.sign_up_post);

router.get("/log-out", userController.logout_get);

router.get("/log-in", userController.login_get);

router.post("/log-in", userController.login_post);

module.exports = router;
