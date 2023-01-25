var express = require("express");
var router = express.Router();
const chatController = require("../controllers/chatController");
/* GET home page. */
router.get("/", chatController.index);

router.post("/", chatController.index_post);

router.get("/username", chatController.username_get);

router.post("/username", chatController.username_post);

module.exports = router;
