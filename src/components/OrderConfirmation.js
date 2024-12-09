import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();  
    const { orderDetails } = location.state || {};

    const calculateTotalPrice = () => {
        return orderDetails?.items?.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // const orderName = orderDetails?.items?.[0]?.name || "Order";

    useEffect(() => {
  
        if (orderDetails) {
            const sendConfirmationEmail = async () => {
                try {
                    await axios.post('http://localhost:8080/send-confirmation-email', {
                        
                        
                        email: orderDetails.email,
                        items: orderDetails.items,
                    });
                } catch (error) {
                    console.error('Failed to send confirmation email', error);
                }
            };

            sendConfirmationEmail();
        }
    }, [orderDetails]);
    

    return (
        <div className="order-confirmation-container">
            <h2>Order Confirmation</h2>
            <p>Your order has been successfully placed!</p>

    

        
            <h3>Total Price: ${calculateTotalPrice()}</h3>

            <h3>Order Details</h3>
            <p>Email: {orderDetails?.email}</p>
            <p>Address: {orderDetails?.homeAddress}, {orderDetails?.city}, {orderDetails?.state}, {orderDetails?.postalCode}</p>
            
            <h4>Items in your order:</h4>
            <ul>
                {orderDetails?.items?.map((item, index) => (
                    <li key={index}>
                        {/* console.log({item.name}); */}
                        {item.title}= {item.title} - ${item.price} x {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderConfirmation;
