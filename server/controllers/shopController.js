const fs = require('fs').promises;
const itemData = './data/itemData.json';
const memberCardData = './data/memberCardData.json';
exports.getAllItem = async (req,res)=>{
    try {
        const itemJson = await fs.readFile(itemData, 'utf8');
        const allItem = JSON.parse(itemJson);
        res.status(200).json({ status: 200, data: allItem });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
}

exports.checkMember = async (req,res)=>{
    const memberCardNumber = req.body.member;
    try {
        const memberCardJson = await fs.readFile(memberCardData, 'utf8');
        const memberCards = JSON.parse(memberCardJson);
        const matchingCard = Object.values(memberCards).find(card => card.code === memberCardNumber);
        if (matchingCard) {
            res.status(200).json({ status: 200, data: matchingCard });
        } else {
            res.status(404).json({ status: 404, error: 'Member card not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
}


exports.checkoutCart = async (req, res) => {
  const cart = req.body.cart;
  const memberCardCode = req.body.member;
  let totalPrice = 0;
  let memberDiscount = 0;
  let doubleDiscount = 0;

  if (!cart || cart.length === 0) {
    return res.status(500).json({
      status: 500,
      error: 'Cart is empty',
    });
  }

  try {
    const memberCardDataJson = await fs.readFile(memberCardData, 'utf8');
    const memberCards = JSON.parse(memberCardDataJson);
    const memberCard = Object.values(memberCards).find(
      (card) => card.code === memberCardCode
    );
    if (memberCard) {
      memberDiscount = memberCard.discount;
    }

    const itemDataJson = await fs.readFile(itemData, 'utf8');
    const items = JSON.parse(itemDataJson);
    for (let key in cart) {
      const foundItem = Object.values(items).find(
        (itemList) => itemList.id === cart[key].id
      );
      if (cart[key].quantity > 1 && foundItem.double_promotion) {
        doubleDiscount = foundItem.discount;
      }
      totalPrice += foundItem.price * cart[key].quantity;
    }

    if (memberDiscount > 0) {
      totalPrice = totalPrice * (1 - memberDiscount / 100);
    }
    if (doubleDiscount > 0) {
      totalPrice = totalPrice * (1 - doubleDiscount / 100);
    }

    res.status(200).json({
      status: 200,
      data: parseFloat(totalPrice.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};
