const express = require('express');
const router = express.Router();
const Order = require('../Modals/order');
const { sendMail } = require('../Helpers/sendMail');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found.' });
        }

        console.log("Fetched Orders:", orders);
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId, email, homeAddress, city, state, postalCode, items } = req.body;
        console.log(req.body);
        console.log(userId);
        
        

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const totalPrice = items.reduce((sum, item) => 
            sum + (item.price * item.quantity || 0), 0);

        const newOrder = new Order({
            userId, // Corrected usage of userId from req.body
            items,
            totalPrice,
            homeAddress,
            city,
            state,
            postalCode,
        });

        await newOrder.save();
        console.log('New Order Created:', newOrder);

        await sendMail(email, items, totalPrice);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderConfirmation: {
                email,
                homeAddress,
                city,
                state,
                postalCode,
                items,
                totalPrice,
            },
        });
    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to place order. Try again later.',
            error: error.message,
        });
    }
});


module.exports = router;
