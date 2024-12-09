import React, { createContext, useState, useContext } from 'react';

// Create the CartContext
const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);

// CartProvider to manage global cart state
export const CartProvider = ({ children }) => {    const [cartItems, setCartItems] = useState([]);

    // Function to add items to the cart
    const addItemToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    // Function to remove items from the cart
    const removeItemFromCart = (index) => {
        setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    return (
        <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
