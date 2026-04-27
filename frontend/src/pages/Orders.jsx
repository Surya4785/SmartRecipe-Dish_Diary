import React, { useState } from 'react'
import { useOrders } from '../context/OrderContext'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi'

const STATUS_CONFIG = {
  confirmed:  { label: 'Confirmed',  icon: <FiCheckCircle />, color: '#7f5af0', step: 1 },
  preparing:  { label: 'Preparing',  icon: <FiPackage />,     color: '#ff8906', step: 2 },
  on_the_way: { label: 'On the Way', icon: <FiTruck />,       color: '#2cb67d', step: 3 },
  delivered:  { label: 'Delivered',  icon: <FiCheckCircle />, color: '#43e97b', step: 4 },
  cancelled:  { label: 'Cancelled',  icon: <FiXCircle />,     color: '#f25f4c', step: 0 },
}

function OrderStatusBar({ status }) {
  const steps = ['confirmed', 'preparing', 'on_the_way', 'delivered']
  const currentStep = STATUS_CONFIG[status]?.step ?? 0

  if (status === 'cancelled') {
    return (
      <div className="order-status-bar cancelled">
        <FiXCircle /> Order Cancelled
      </div>
    )
  }

  return (
    <div className="order-progress">
      {steps.map((s, i) => {
        const cfg = STATUS_CONFIG[s]
        const done = i + 1 <= currentStep
        const active = i + 1 === currentStep
        return (
          <React.Fragment key={s}>
            <div className={`progress-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              <div className="progress-step-icon" style={done ? { background: cfg.color } : {}}>
                {cfg.icon}
              </div>
              <span className="progress-step-label">{cfg.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`progress-line ${i + 1 < currentStep ? 'done' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function Orders() {
  const { orders, dispatch } = useOrders()
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState(null)

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <div className="empty-state-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Place your first order from our delicious menu!</p>
          <button className="cart-browse-btn" onClick={() => navigate('/dishes')}>
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1 className="orders-title">📦 My Orders</h1>
        <span className="orders-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="orders-list">
        {orders.map(order => {
          const isExpanded = expandedId === order.id
          const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed
          return (
            <div key={order.id} className="order-card">
              {/* Order header */}
              <div className="order-card-header" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                <div className="order-id-section">
                  <span className="order-id">{order.id}</span>
                  <span
                    className="order-status-badge"
                    style={{ background: `${statusCfg.color}22`, color: statusCfg.color, border: `1px solid ${statusCfg.color}44` }}
                  >
                    {statusCfg.icon} {statusCfg.label}
                  </span>
                </div>
                <div className="order-header-meta">
                  <span className="order-date"><FiClock /> {formatDate(order.placedAt)}</span>
                  <span className="order-total">${order.total.toFixed(2)}</span>
                  <span className="order-expand-toggle">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="order-card-body">
                  <OrderStatusBar status={order.status} />

                  <div className="order-details-grid">
                    <div className="order-detail-section">
                      <h4>🛒 Items</h4>
                      {order.items.map(item => (
                        <div key={item.id} className="order-item-row">
                          <span>{item.emoji} {item.name} × {item.qty}</span>
                          <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-detail-section">
                      <h4>📍 Delivery To</h4>
                      <p>{order.delivery.name}</p>
                      <p>{order.delivery.address}</p>
                      <p>{order.delivery.city} {order.delivery.zip}</p>
                      <p>{order.delivery.phone}</p>
                    </div>

                    <div className="order-detail-section">
                      <h4>💳 Payment</h4>
                      <p>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</p>
                    </div>
                  </div>

                  {/* Simulate status change for demo */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="order-actions">
                      <select
                        className="status-change-select"
                        value={order.status}
                        onChange={e => dispatch({ type: 'UPDATE_STATUS', payload: { id: order.id, status: e.target.value } })}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="on_the_way">On the Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <span className="status-hint">* Simulate status update</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
