import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  './PlaceOrder.css';
import { jwtDecode } from "jwt-decode";
// import { log } from 'console';


const PlaceOrder = () => {
    const [address, setAddress] = useState({
        userId: null,
        homeAddress: '',
        city: '',
        state: '',
        postalCode: '',
    });
    const [email, setEmail] = useState('');
    const [items, setItems] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
  

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded Token:", decoded);
                if (decoded && decoded._id) { // Use _id instead of id
                    console.log("User ID from token:", decoded._id);
                    setAddress((prevState) => ({
                        ...prevState,
                        userId: decoded._id,
                    }));
                } else {
                    console.error("Token decoding failed or missing '_id' field.");
                }
            } catch (err) {
                console.error("Error decoding token:", err.message);
            }
        } else {
            console.error("No token found in localStorage.");
        }
    }, []);
    

    // Fetch items from local storage when the component mounts
    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setItems(cartItems);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value,
            // userId: decodedToken.id,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setOrderStatus('Processing your order...');
    
        const orderDetails = {
            userId: address.userId,// Ensure userId is populated
            email,
            homeAddress: address.homeAddress,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            items,
        };
    
        console.log("Order Details to be sent:", orderDetails); // Debugging log
    
        try {
            const response = await fetch('http://localhost:8080/admin/orders', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(orderDetails),
            });
    
            if (response.ok) {
                const data = await response.json();
                setOrderStatus('Order placed successfully!');
                localStorage.removeItem('cartItems');
                setTimeout(() => {
                    navigate('/order-confirmation', { state: { orderDetails } });
                }, 2000);
            } else {
                const errorData = await response.json();
                setOrderStatus(`Error: ${errorData.message || 'Failed to place order.'}`);
            }
        } catch (error) {
            console.error('Error:', error.message);
            setOrderStatus('Failed to place order. Try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="place-order-container">
            <h2>Place Your Order</h2>
            <form onSubmit={handleSubmit} className="place-order-form">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="homeAddress">Home Address</label>
                <input
                    type="text"
                    id="homeAddress"
                    name="homeAddress"
                    value={address.homeAddress}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="city">City</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="state">State</label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="postalCode">Postal Code</label>
                <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={isSubmitting}>Place Order</button>
            </form>

            {isSubmitting && <div className="loading-spinner">Processing...</div>}
            {orderStatus && <div className="order-status">{orderStatus}</div>}
        </div>
    );
};
export default PlaceOrder;
