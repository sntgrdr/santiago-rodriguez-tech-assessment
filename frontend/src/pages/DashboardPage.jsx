import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsGrid from '../components/dashboard/StatsGrid';
import OrdersList from '../components/dashboard/OrdersList';
import Modal from '../components/ui/Modal';
import CreateOrderForm from '../components/orders/CreateOrderForm';

const DashboardPage = () => {
  const { logout, user } = useAuth();
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersData = await api.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setError(null);
      const updatedOrder = await api.updateOrder(id, { status: newStatus });

      setOrders(prevOrders =>
        prevOrders.map(order => order.id === id ? { ...order, status: updatedOrder.status } : order)
      );

      fetchStats();
      return true;
    } catch (err) {
      const message = err.response?.data?.errors || 'Failed to update order status';
      setError(message);
      return false;
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      setError(null);
      await api.deleteOrder(id);

      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));

      fetchStats();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete order';
      setError(message);
    }
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const handleOrderCreated = () => {
    setShowCreateModal(false);
    fetchStats();
    fetchOrders();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onCreateOrder={handleCreateOrder}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <StatsGrid stats={stats} loading={statsLoading} />
        </div>

        <div>
          <OrdersList
            orders={orders}
            loading={ordersLoading}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteOrder}
            serverError={error}
            currentUser={user}
            clearError={() => setError(null)}
          />
        </div>
      </main>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Order"
        size="md"
      >
        <CreateOrderForm
          onClose={() => setShowCreateModal(false)}
          onOrderCreated={handleOrderCreated}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;