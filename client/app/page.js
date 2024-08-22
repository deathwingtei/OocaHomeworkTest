'use client'
import { useEffect, useState } from 'react';
import { setCart, getCart, setMember, getMember, removeCart, removeMember } from "./service/storage";

export default function Home() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [items, setItems] = useState([]);
    const [itemCounts, setItemCounts] = useState({}); // State to keep track of item counts

    useEffect(() => {
        fetchItem();
    }, []);

    const fetchItem = () => {
        fetch(apiUrl + "shop", {
            method: "GET",
            cache: 'no-cache', 
            redirect: 'follow', 
            referrerPolicy: 'no-referrer',
        })
        .then(response => response.json())
        .then(data => {
            try {
                if (data.status === 200) {
                    const getItems = Object.values(data.data); // Convert the object to an array
                    setItems(getItems);

                    // Initialize itemCounts with 0 for each item
                    const initialCounts = {};
                    getItems.forEach(item => {
                        initialCounts[item.id] = 0;
                    });
                    setItemCounts(initialCounts);
                } else {
                    removeCart();
                    removeMember();
                }
            } catch (error) {
                removeCart();
                removeMember();
            }
        });
    };

    const handleItemCountChange = (itemId, count) => {
        setItemCounts(prevCounts => ({
            ...prevCounts,
            [itemId]: count
        }));
    };

    const updateCart = (itemId,itemCount,itemName,itemPrice,itemCurrency,itemUnit) =>{
        setCart(itemId,itemCount,itemName,itemPrice,itemCurrency,itemUnit);
        setItemCounts(prevCounts => ({
            ...prevCounts,
            [itemId]: 0
        }));
    }

    return (
        <div className="container mx-auto mt-5">
            {items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} className='pt-2 pb-4 border-b border-gray-300 flex justify-between items-center grid grid-cols-4'>
                        <h1  className=''>{item.name}</h1>
                        <p className=''>{item.price} {item.currency} / {item.unit}</p>
                        <input
                            type="number"
                            className='w-20 text-black'
                            value={itemCounts[item.id]} // Bind the input to the state
                            onChange={(e) => handleItemCountChange(item.id, Number(e.target.value))}
                            min="0"
                        />
                        <button className='' key={item.id} onClick={() => updateCart(item.id, itemCounts[item.id],item.name,item.price,item.currency, item.unit)}>Add to cart</button>
                    </div>
                ))
            ) : (
                <p>No items found.</p>
            )}
        </div>
    );
}
