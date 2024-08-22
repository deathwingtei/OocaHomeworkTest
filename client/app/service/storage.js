export const setCart = (itemId,count,name,price,currency,unit) => {
    if (typeof window !== "undefined") {
  
        if (count > 0) {
            let setCart = [];
            let onCart = getCart();

            if (onCart) {
                const existingItem = onCart.find(item => item.id === itemId);
                
                if (existingItem) {
                    existingItem.quantity += count;
                } else {
                    onCart.push({ id: itemId, quantity: count, name: name, price: price, currency: currency,unit:unit });
                }

                setCart = onCart;
            } else {
                setCart.push({ id: itemId, quantity: count, name: name, price: price, currency: currency,unit:unit });
            }

            // Save to sessionStorage
            sessionStorage.setItem("cart", JSON.stringify(setCart));

            // Dispatch custom event to notify about the cart update
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }
};

export const setMember=(member)=>{
    if(window !== undefined || !sessionStorage.getItem("member")){
        sessionStorage.setItem("member",JSON.stringify(member));
    }
}

//get token data
export const getCart=()=>{
    if(window !== undefined){
        if(sessionStorage.getItem("cart")){
            try {
                return JSON.parse(sessionStorage.getItem("cart"));
            } catch (error) {
                removeCart();
                removeMember();
                window.dispatchEvent(new Event('cartUpdated'));
            }
        }else{
            return false;
        }
    }
}

export const getMember=()=>{
    if(window !== undefined){
        if(sessionStorage.getItem("cart")){
            try {
                return JSON.parse(sessionStorage.getItem("member"));
            } catch (error) {
                removeCart();
                removeMember();
                window.dispatchEvent(new Event('cartUpdated'));
            }
        }else{
            return false;
        }
    }
}

export const removeCartItem=(itemId)=>{
    if(window !== undefined){
        if (itemId) {
            let onCart = getCart() || []; 
            if (onCart) {

                const itemIndex = onCart.findIndex(item => item.id === itemId);
                if (itemIndex !== -1) {
                    onCart.splice(itemIndex, 1); // Remove the item using the index
                }

                // Save the updated cart to sessionStorage
                sessionStorage.setItem("cart", JSON.stringify(onCart));
                // Dispatch custom event to notify about the cart update
                window.dispatchEvent(new Event('cartUpdated'));
            }
        }
    }
}

export const removeCart=()=>{
    if(window !== undefined){
        sessionStorage.removeItem("cart");
        window.dispatchEvent(new Event('cartUpdated'));
    }
}

export const removeMember=()=>{
    if(window !== undefined){
        sessionStorage.removeItem("member");
    }
}
