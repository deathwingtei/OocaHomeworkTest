'use client'
import { useEffect, useState } from 'react';
import { getCart, setMember, getMember, removeCart, removeMember, removeCartItem } from "../service/storage";
import { useRouter } from 'next/navigation';

export default function Checkout() {
    const [items, setItems] = useState([]);
    const [itemDiscount, setItemDiscount] = useState(0);
    const [itemDiscountType, setItemDiscountType] = useState('%');
    const [memberCode, setMemberCode] = useState('');
    const [memberDiscount, setMemberDiscount] = useState(0);
    const [memberDiscountType, setMemberDiscountType] = useState('%');
    const [memberStatus, setMemberStatus] = useState('');
    const [summaryPrice, SetsummaryPrice] = useState(0);
    const [totalPrice, SettotalPrice] = useState(0);
    const [statusType, setStatusType] = useState(''); 
    const [errorPopup, setErrorPopup] = useState(false); 
    const [errorContent, setErrorContent] = useState(''); 
    const [successPopup, setSuccessPopup] = useState(false); 
    const [successContent, setSuccessContent] = useState(''); 
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 
    useEffect(() => {
        // Initial load
        updateCartItems();
        // Custom event listener for cart updates
        const handleCartUpdate = () => {
            updateCartItems();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);
    
    const updateCartItems = async () => {
        try {
            const cartItems = getCart() || [];
            setItems(cartItems);
            
            let thissummary = 0;
            for (let index = 0; index < cartItems.length; index++) {
                const onCartItem = cartItems[index];
                thissummary += +onCartItem.price * onCartItem.quantity;
            }
            SetsummaryPrice(thissummary);

            await checkItemDiscount(cartItems);  // Await for discounts to be checked
            await checkoutCalculate(cartItems);  // Await for the checkout calculation

        } catch (error) {
            console.error('Error updating cart items:', error);
        }
    };

    const checkItemDiscount = async (cartItems) => {
        try {
            
            const response = await fetch(apiUrl + "shop/ckeckitemdiscount", {
                method: "POST",
                body: JSON.stringify({ cart: cartItems }),
                cache: 'no-cache',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                },
                redirect: 'follow', 
                referrerPolicy: 'no-referrer',
            });
            const data = await response.json();
            
            if (data.status === 200) {
                if (data.data.discount) {
                    setItemDiscount(data.data.amount);
                    setItemDiscountType(data.data.type);
                }else{
                    setItemDiscount(0);
                }
            } else {
                console.log('Failed to fetch discounts');
                setItemDiscount(0);
            }
        } catch (error) {
            console.error('Error checking item discounts:', error);
            setItemDiscount(0);
            removeCart();
            removeMember();
        }
    };

    const checkoutCalculate = async (cartItems) => {
        try {
            const response = await fetch(apiUrl + "shop/checkout", {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ member: memberCode, cart: cartItems }),
                cache: 'no-cache', 
                redirect: 'follow', 
                referrerPolicy: 'no-referrer',
            });

            const data = await response.json();

            if (data.status === 200) {
                SettotalPrice(data.data);
            } else {

                if(successPopup===false){
                    setErrorContent(data.error);
                    setErrorPopup(false);
                }
                
            }
        } catch (error) {
            console.error('Error processing checkout:', error);
        }
    };

    const handleMemberChange = (value) => {
        setMemberCode(value);
    };

    const checkMemberCode = async (member) => {
        try {
            const response = await fetch(apiUrl + "shop/member", {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ member: member }),
                cache: 'no-cache', 
                redirect: 'follow', 
                referrerPolicy: 'no-referrer',
            });
            const data = await response.json();

            if (data.status === 200) {
                setMemberStatus(data.data.name);
                setMemberDiscount(data.data.discount);
                setMemberDiscountType(data.data.discount_type);
                setStatusType('success');
                setMember(data.data);
            } else {
                setMemberStatus(data.error);
                setStatusType('error');
   
            }
        } catch (error) {
            console.error('Error checking member code:', error);
            setStatusType('error');
            setMemberStatus('Cannot process member');
            removeCart();
            removeMember();
        }

        await checkoutCalculate(items);
    };

    const setSuccessCart = async () => {
        return new Promise((resolve) => {
            setSuccessContent("Payment Success. Thank you for payment " + totalPrice.toLocaleString() + " THB");
            setSuccessPopup(true);
            resolve(); // Resolve the promise immediately after setting state
        });
    }
    
    const removeAllContent = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        removeCart();
        removeMember();
    }
    
    const handleCheckout = async () => {
        await setSuccessCart();
        await removeAllContent();
    };
    const removeFromCart = async (itemId) => {
        removeCartItem(itemId);
        const cartItems = getCart() || [];
        await checkItemDiscount(cartItems);  // Await for discounts to be checked
        await checkoutCalculate(cartItems);  // Await for the checkout calculation
    };

    const backToShop = () => {
        router.push('/');
    };

    return (
        <>
            <div className="container mx-auto mt-5">
                <h1 className='text-xl'>Summary Checkout</h1>
                { errorPopup && (
                    <div id="alert-error" className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                        <div className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <h3 className="text-lg font-medium">Error</h3>
                        </div>
                        <div className="mt-2 mb-4 text-sm">
                            { errorContent }
                        </div>
                    </div>
                )}

                { successPopup && (
                    <div id="alert-success" className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
                        <div className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <h3 className="text-lg font-medium">Payment Success</h3>
                        </div>
                        <div className="mt-2 mb-4 text-sm">
                            { successContent }
                        </div>
                        <div className="flex">
                            <button  
                                onClick={backToShop} 
                                type="button"
                                className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                            <svg className="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                            </svg>
                                Shop more
                            </button>
                        </div>
                    </div>
                )}

                {items.length > 0 ? (
                    <div>
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Count</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Summary</th>
                                    <th className="px-4 py-2">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border px-4 py-2">{item.name}</td>
                                        <td className="border px-4 py-2">{item.quantity}</td>
                                        <td className="border px-4 py-2">{item.price}</td>
                                        <td className="border px-4 py-2">{item.price * item.quantity}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))} 
                            </tbody>
                        </table>
                        <div className='summary pt-5'>
                            Member Code: 
                            <input
                                type='text' 
                                placeholder='Enter Member Code' 
                                className='mx-5 text-black'
                                value={memberCode}
                                onChange={(e) => handleMemberChange(e.target.value)}
                            />
                            <button
                                onClick={() => checkMemberCode(memberCode)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 mx-5 rounded"
                            >
                                Check Member Code
                            </button>
                            <label className="mx-5">
                                {memberStatus && (
                                    <span className={`mt-2 ${statusType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {memberStatus}
                                    </span>
                                )}
                            </label>
                        </div>
                        <div className='summary py-2'>
                            Summary price: {summaryPrice} THB
                        </div>
                        <div className='itemDiscount py-2'>
                            Item Discount : {itemDiscount} {itemDiscountType === "Percentage" ? '%' : itemDiscountType}
                        </div>
                        <div className='itemDiscount py-2'>
                            Member Discount : {memberDiscount} {memberDiscountType === "Percentage" ? '%' : memberDiscountType}
                        </div>
                        <div className='itemDiscount py-2'>
                            Total Price : {totalPrice.toLocaleString()} THB
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Payment
                        </button>
                    </div>
                ) : (
                    <>
                        <p>No items found.</p>
                        <button
                            onClick={backToShop}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 my-5 px-4 rounded"
                        >
                            Back
                        </button>
                    </>
                )}

            </div>
        </>
    )
}