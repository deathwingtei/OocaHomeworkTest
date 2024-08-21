'use client'

import { useEffect, useState } from 'react';
import { getCart } from '../service/storage';
import { useRouter } from 'next/navigation';

const CartPopup = () => {
    const [items, setItems] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
	const router = useRouter();

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

    const updateCartItems = () => {
        const cartItems = getCart() || [];
        setItems(cartItems);
    };
    
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const handleCheckout = () => {
        // Navigate to the checkout page
        router.push('/checkout');
    };

    return (
        <div className="relative">
            <button
                onClick={toggleVisibility}
                className=" top-4 right-4"
            >
                <svg className="flex-1 w-8 h-8 fill-current" viewBox="0 0 24 24" >
                    <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"/>
                </svg>
                <span className="absolute right-0 top-0 rounded-full bg-red-600 w-4 h-4 top right p-0 m-0 text-white font-mono text-sm  leading-tight text-center">
                    {items.reduce((acc, item) => acc + item.count, 0)}
                </span>
            </button>

            {isVisible && (
                <div className="absolute top-12 right-0 bg-white text-gray-800 border border-gray-200 shadow-lg rounded-lg w-64 p-4 z-50">
                    <h2 className="text-lg font-semibold mb-2">Your Cart</h2>
                    {items.length > 0 ? (
                        <>
                            {items.map((item) => (
                                <div key={item.itemId} className="flex justify-between items-center mb-2">
                                    <span>{item.name}</span>
                                    <span>{item.count} x {item.price} {item.currency}</span>
                                </div>
                            ))}
                            <button
                                onClick={handleCheckout}
                                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Checkout
                            </button>
                        </>
                    ) : (
                        <p className="text-gray-500">Your cart is empty.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartPopup;
