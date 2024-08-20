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
        const allMemberCard = JSON.parse(memberCardJson);
        const matchingCard = Object.values(allMemberCard).find(card => card.code === memberCardNumber);
        if (matchingCard) {
            res.status(200).json({ status: 200, data: matchingCard });
        } else {
            res.status(404).json({ status: 404, error: 'Member card not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
}


exports.checkoutCart = async (req,res)=>{
    const cart = req.body.cart;
    const memberCardNumber = req.body.member;
    let summaryPrice = 0;
    let discountMember = 0;
    let discountDouble = 0;
    // can add check discount type if it has more than one discount type
    try {
        if(!cart || cart.length === 0){
            res.status(500).json({ status: 500, error: 'Cart is empty' });
            return;
        }
        const memberCardJson = await fs.readFile(memberCardData, 'utf8');
        const allMemberCard = JSON.parse(memberCardJson);
        const matchingCard = Object.values(allMemberCard).find(card => card.code === memberCardNumber);
        if (matchingCard) {
            // get discount
            discountMember = matchingCard.discount;
        }
        const itemJson = await fs.readFile(itemData, 'utf8');
        const allItem = JSON.parse(itemJson);
        for (let key in cart) {
            const checkItem = Object.values(allItem).find(itemList => itemList.id === cart[key].id);
            if (cart[key].quantity > 1 && checkItem.double_promotion) {
                if(discountDouble==0){
                    discountDouble = checkItem.discount;
                }
            }
            summaryPrice+=checkItem.price*cart[key].quantity;
        }
        if(discountMember>0){
            summaryPrice = summaryPrice*(1-discountMember/100);
        }
        if(discountDouble>0){
            summaryPrice = summaryPrice*(1-discountDouble/100);
        }
        
        res.status(200).json({ status: 200, data:  parseFloat(summaryPrice.toFixed(2)) });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }

}
