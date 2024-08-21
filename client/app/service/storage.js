export const setCart = (itemId,count,name,price,currency) => {
    if (typeof window !== "undefined") {
        if (count > 0) {
            let setCart = [];
            let onCart = getCart();

            if (onCart) {
                const existingItem = onCart.find(item => item.itemId === itemId);
                
                if (existingItem) {
                    existingItem.count += count;
                } else {
                    onCart.push({ itemId: itemId, count: count, name: name, price: price, currency: currency });
                }

                setCart = onCart;
            } else {
                setCart.push({ itemId: itemId, count: count, name: name, price: price, currency: currency });
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
            }
        }else{
            return false;
        }
    }
}

export const removeCartItem=()=>{
    if(window !== undefined){

    }
}

export const removeCart=()=>{
    if(window !== undefined){
        sessionStorage.removeItem("cart");
    }
}

export const removeMember=()=>{
    if(window !== undefined){
        sessionStorage.removeItem("member");
    }
}
