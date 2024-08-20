const express = require("express");
const router = express.Router();
const { getAllItem,checkMember,checkoutCart } = require("../controllers/shopController");

router.get('/',getAllItem);
router.post('/member',checkMember);
router.post('/checkout',checkoutCart);

module.exports = router;