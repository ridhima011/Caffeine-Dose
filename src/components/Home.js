import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { handleSucess } from '../utils';
import Chatbot from './chatboot.js'; 
import { ToastContainer, toast } from 'react-toastify';

import coffee1 from '../images/coffee1.jpg';
import coffee2 from '../images/coffee2.jpg';
import coffee3 from '../images/coffee3.jpg';
import coffee4 from '../images/coffee4.jpg';
import coffee5 from '../images/coffee5.jpg';
import coffee6 from '../images/coffee6.jpg';
import cup from '../images/cup.png';
import logo from '../images/logo.png'


import cafe1 from '../images/cafe1.jpg';
import cafe2 from'../images/cafe2.jpg';
import cafe3 from '../images/cafe3.jpg';
import cafe4 from '../images/cafe4.jpg';
import cafe5 from '../images/cafe5.jpg';
import cafe6 from '../images/cafe6.jpg';














function Home() {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);


    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);



    // function ReviewSection() {
    //     const [text, setText] = useState('');
    //     const [file, setFile] = useState(null);
    //     const [message, setMessage] = useState('');
      
    //     const handleSubmit = async (e) => {
    //       e.preventDefault(); // Prevent default form submission behavior
    //       setMessage('');
      
    //       const formData = new FormData();
    //       formData.append('text', text);
    //       formData.append('file', file);
      
    //       try {
    //         const response = await fetch('http://localhost:8080/reviews', {
    //           method: 'POST',
    //           body: formData,
    //         });
      
    //         if (response.ok) {
    //           setMessage('Review submitted successfully!');
    //           setText(''); // Clear the text input
    //           setFile(null); // Clear the file input
    //         } else {
    //           const errorData = await response.json();
    //           setMessage(`Error: ${errorData.error}`);
    //         }
    //       } catch (error) {
    //         setMessage('Error submitting review. Please try again.');
    //       }
    //     };
      

 //}

 const handleReviewSubmit = async (e) => {
   
    e.preventDefault();
    const formData = new FormData(e.target);
  
    try {
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.text();
        
        alert('Review submitted successfully: ' + result);
        e.preventDefault();
        setText(''); // Clear the text input
        setFile(null);
    
        
      } else {
        alert('Failed to submit the review. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  useEffect(() => {
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);
  

    const menuItems = [
        { id: 1, title: "Cappuccino", description: "Rich and foamy coffee.", price: 20, image: coffee1 },
        { id: 2, title: "Chocolate Cake", description: "Decadent and moist.", price: 25, image: coffee2 },
        { id: 3, title: "Sandwich", description: "Fresh and delicious.", price: 15, image: coffee3 },
        { id: 4, title: "Latte", description: "Smooth and creamy coffee.", price: 22, image: coffee4 },
        { id: 5, title: "Croissant", description: "Flaky and buttery pastry.", price: 12, image: coffee5 },
        { id: 6, title: "Pasta", description: "Savory and flavorful.", price: 18, image: coffee6 },
        { id: 7, title: "Croissant", description: "Flaky and buttery pastry.", price: 12, image: coffee5 },
        { id: 8, title: "Pasta", description: "Savory and flavorful.", price: 18, image: coffee6 },
        { id: 9, title: "Croissant", description: "Flaky and buttery pastry.", price: 12, image: coffee5 },
        { id: 10, title: "Pasta", description: "Savory and flavorful.", price: 18, image: coffee6 },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save cart items to localStorage
    }, [cartItems]);
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSucess('User logged out');
        setTimeout(() => navigate('/login'), 1000);
    };

    const addToCart = (item) => {
        if (!loggedInUser) {
            toast.success("Please log in to add items to your cart!");
            return;
        }
    
        setCartItems(prevItems => {
         
            const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
    
            if (existingItem) {
                
                return prevItems.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
               
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
      

    };
    

    
    
    const incrementQuantity = id => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };
    
    const decrementQuantity = id => {
        setCartItems(prevItems =>
            prevItems
                .map(item =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0) // Remove item if quantity is 0 or less
        );
    };
    
    const calculateTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const removeFromCart = id => {
        setCartItems(prevItems =>
            prevItems.filter(item => item.id !== id) // Filter out the item with matching ID
        );
    };
    

    return (
        <div className="home">
            <Chatbot />
            <header className="header">
              
                <nav className="navbar">
                <div className="logo">
                <img src={logo} alt="caffine Dose" className="logo-image" />
                </div>
                    <Link to="/#home">Home</Link>
                    <a href="#aboutus">About Us</a>
                    <a href="#menu">Menu</a>
                    <a href="#review">Reviews</a>
                    <a href="#giftcard">Giftcard</a>
                    <a href="#contact">Contact</a>
                    {loggedInUser ? (
                        <span className="user-greeting">Welcome, {loggedInUser}</span>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                
                
                <div className="icons">
    <button className="icon-button" onClick={toggleSearch}>🔍</button>
    <button className="icon-button" onClick={toggleCart}>
        🛒 
        {/* Calculate the total quantity of items in the cart */}
        {cartItems.reduce((total, item) => total + item.quantity, 0) > 0 && (
            <span className="cart-count">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
        )}
    </button>
    <button onClick={handleLogout} className='logout-button'>Logout</button>
</div>

                </nav>
            </header>

            <section className="home-section" id="home">
                <div className="content">
                    <h1>Welcome to Our Café</h1>
                    <p>Step into a world of flavors and cozy moments. Enjoy our curated menu!</p>
                </div>
              
               
                <img src={cup} alt="Coffee cup" className="background-image" />
               
            </section>

                
            {isSearchOpen && (
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for items..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={toggleSearch} className="close-search">Close</button>
                </div>
            )}

            {/* Cart Popup */}
            {isCartOpen && (
                <div className="cart-popup">
                    <h3>Cart</h3>
                    {cartItems.length > 0 ? (
                       <ul className="cart-items">
                       {cartItems.map((item) => (
                           <li key={item.id} className="cart-item">
                               <img src={item.image} alt={item.title} className="cart-item-image" />
                               <div>
                                   <p className="cart-item-title">{item.title}</p>
                                   <p>{item.description}</p>
                                   <p>Price: ${item.price}</p>
                                   <div className="cart-item-controls">
                                       <button onClick={() => decrementQuantity(item.id)}>-</button>
                                       <span>{item.quantity}</span>
                                       <button onClick={() => incrementQuantity(item.id)}>+</button>
                                       <button onClick={() => removeFromCart(item.id)}>Remove</button> {/* Add a Remove button */}
                                   </div>
                               </div>
                           </li>
                       ))}
                   </ul>
                   
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                    <div className="cart-total">
                        <strong>Total: ${calculateTotal().toFixed(2)}</strong>
                    </div>
                    <button className="place-order-btn" onClick={() => navigate('/place-order')}>
            Place Order
        </button>
                    <button className="close-cart" onClick={toggleCart}>Close cart</button>
                </div>
            )}

<section className="about-section" id='aboutus'>
                <div className="image-container"></div>
                <div className="text-container">
                    <h2>About Us</h2>
                    <p>
                        Welcome to our café! We are passionate about serving the finest coffee 
                        and creating a cozy environment where you can relax and connect with others.
                    </p>
                </div>
    </section>

            {/* Menu Section */}
            <section className="menu-section" id="menu">
                <h2>Our Menu</h2>
                <div className="menu-grid">
                    {filteredMenuItems.map((item) => (
                        <div key={item.id} className="menu-card">
                            <div className="image-circle">
                                <img src={item.image} alt={item.title} className="menu-image" />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <p>Price: {item.price}</p>
                            <button className="add-to-cart" onClick={() => addToCart(item)}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>

            </section>

<div class="circle small"></div>
<div class="circle medium"></div>
<div class="circle large"></div>
<div class="circle small"></div>
<div class="circle medium"></div>
<div class="circle large"></div>

<section class="review-section" id="review">
  <div class="review-container">
    <div class="review-content">
      <h2>Customer Reviews</h2>
      <p>
        "Absolutely love this place! The ambiance is cozy, and the coffee is perfect." <br />
        "Friendly staff and delicious pastries—my new favorite spot in town!"
      </p>

      {/* <!-- Fancy Review Form --> */}
      <form className="review-form" id="reviewForm" onSubmit={handleReviewSubmit}>
  <div className="form-group">
    <label htmlFor="name">Your Name:</label>
    <input type="text" id="name" name="name" placeholder="Enter your name" required />
  </div>

  <div className="form-group">
    <label htmlFor="rating">Rating:</label>
    <select id="rating" name="rating" required>
      <option value="">Select a rating</option>
      <option value="5">5 - Excellent</option>
      <option value="4">4 - Good</option>
      <option value="3">3 - Average</option>
      <option value="2">2 - Poor</option>
      <option value="1">1 - Terrible</option>
    </select>
  </div>

  <div className="form-group">
    <label htmlFor="review">Your Review:</label>
    <textarea id="review" name="review" placeholder="Write your review here" rows="4" required></textarea>
  </div>

  <div className="form-group">
    <label htmlFor="file">Upload an Image:</label>
    <input type="file" id="file" name="file" accept="image/*" />
  </div>

  <button type="submit" className="submit-btn">Submit Review</button>
</form>


    </div>
  </div>
</section>



{/* <section className="giftcard-section" id='giftcard'>
            <div className="giftcard-content">
                <h2>Give the Gift of Coffee</h2>
                <p>
                    Looking for the perfect gift for a coffee lover? Our gift cards are the ideal way 
                    to share the joy of a warm cup of coffee and delicious treats!
                </p>
                <button className="btn">Buy Gift Card</button>
            </div>
</section> */}

<section className="cafe-gallery">
      <h2>Gallery</h2>
      <div className="gallery-container">
        <div className="gallery-item">
          <img src={cafe1} alt="Cozy Interior" className="gallery-image" />
        </div>
        <div className="gallery-item">
          <img src={cafe2} alt="Outdoor Seating" className="gallery-image" />
        </div>
        <div className="gallery-item">
          <img src={cafe3} alt="Coffee Bar" className="gallery-image" />
        </div>
        <div className="gallery-item">
          <img src={cafe4} alt="Modern Decor" className="gallery-image" />
        </div>
        <div className="gallery-item">
          <img src={cafe5} alt="Specialty Drinks" className="gallery-image" />
        </div>
        <div className="gallery-item">
          <img src={cafe6} alt="Relaxing Lounge" className="gallery-image" />
        </div>
      </div>
    </section>

<footer className="footer">
    <div className="footer-container">
        <div className="footer-section about">
            <h3>The Cozy Coffee Shop</h3>
            <p>123 Brew Street, Coffee City, CO 80000</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: <a href="mailto:support@cozycoffee.com">support@cozycoffee.com</a></p>
        </div>

        <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="/menu">Menu</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/faq">FAQs</a></li>
            </ul>
        </div>

        <div className="footer-section hours">
            <h3>Shop Hours</h3>
            <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
            <p>Sat - Sun: 9:00 AM - 9:00 PM</p>
        </div>

        <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin-in"></i>
                </a>
            </div>
        </div>
    </div>

    <p className="copyright">
        &copy; 2024 The Cozy Coffee Shop. All rights reserved.
    </p>
</footer>



            {/* Remaining components like cart, menu, etc. */}
            <ToastContainer />
        </div>
    );
}

export default Home;
