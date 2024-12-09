import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './AdminPage.css';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminPage = () => {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [ordersFetched, setOrdersFetched] = useState(false);

  const salesData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: [120, 150, 180, 200, 170, 250, 300],
        backgroundColor: '#6b4226',
        borderColor: '#362115',
        borderWidth: 1,
      },
    ],
  };

  const stockData = {
    labels: ['Coffee Beans', 'Milk', 'Sugar', 'Cups', 'Other'],
    datasets: [
      {
        label: 'Stock Level (%)',
        data: [80, 60, 50, 90, 70],
        backgroundColor: ['#6b4226', '#4e3023', '#362115', '#ffba92', '#a58b72'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const fetchOrders = async () => {
    if (!ordersFetched) {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/admin/orders');
        if (response?.data?.success) {
          setOrders(response.data.orders);
          const sales = response.data.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
          console.log("my sale are:",sales);
          
          setTotalSales(sales);
          const pending = response.data.orders.filter(order => order.status === 'Pending').length;
          console.log(pending);
          
          setPendingOrders(pending);
          setOrdersFetched(true);
        } else {
          console.error('Failed to fetch orders. Please check the API.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (currentView === 'Orders') {
      fetchOrders();
    }
  }, [currentView]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Café Admin Dashboard</h1>
      </header>
      <nav className="admin-sidebar">
        <ul>
          <li
            className={currentView === 'Dashboard' ? 'active' : ''}
            onClick={() => handleViewChange('Dashboard')}
          >
            Dashboard
          </li>
          <li
            className={currentView === 'Orders' ? 'active' : ''}
            onClick={() => handleViewChange('Orders')}
          >
            Orders
          </li>
          <li
            className={currentView === 'Inventory' ? 'active' : ''}
            onClick={() => handleViewChange('Inventory')}
          >
            Inventory
          </li>
          <li
            className={currentView === 'Staff Management' ? 'active' : ''}
            onClick={() => handleViewChange('Staff Management')}
          >
            Staff Management
          </li>
          <li
            className={currentView === 'Settings' ? 'active' : ''}
            onClick={() => handleViewChange('Settings')}
          >
            Settings
          </li>
        </ul>
      </nav>
      <main className="admin-main">
        <h2>{currentView}</h2>
        {currentView === 'Dashboard' && (
          <>
            <p>Here’s an overview of your coffee shop’s performance today.</p>
            <div className="admin-stats">
              <div className="stat-card">
                <h3>Today's Sales</h3>
                <p>{totalSales > 0 ? `$${totalSales.toFixed(2)}` : 'No sales yet'}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p>{pendingOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Available Stock</h3>
                <p>85%</p>
              </div>
            </div>
            <div className="admin-charts">
              <div className="chart-container">
                <h3>Sales Trend</h3>
                <Line data={salesData} />
              </div>
              <div className="chart-container">
                <h3>Stock Distribution</h3>
                <Bar data={stockData} />
              </div>
            </div>
          </>
        )}

        {currentView === 'Orders' && (
          <div>
            <h3>Order Management</h3>
            {isLoading ? (
              <p>Loading orders...</p>
            ) : (
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.userId?.name || 'Unknown User'}</td>
                        <td>
                          {Array.isArray(order.items) && order.items.length > 0 ? (
                            order.items
                              .map((item) => {
                                const itemTitle = item?.title || 'Unnamed Item';
                                const itemQuantity = item?.quantity || 1;
                                return `${itemTitle} (x${itemQuantity})`;
                              })
                              .join(', ')
                          ) : (
                            'No items available'
                          )}
                        </td>
                        <td>{order.status || 'Pending'}</td>
                        <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
