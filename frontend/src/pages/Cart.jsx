import React from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiArrowLeft } from 'react-icons/fi'

export default function Cart() {
  const { cart, dispatch, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()

  const TAX_RATE = 0.08
  const DELIVERY_FEE = totalPrice > 30 ? 0 : 3.99
  const tax = totalPrice * TAX_RATE
  const grandTotal = totalPrice + tax + DELIVERY_FEE

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious dishes from our menu</p>
          <button className="cart-browse-btn" onClick={() => navigate('/dishes')}>
            Browse Menu <FiArrowRight />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1 className="cart-title">🛒 Your Cart
          <span className="cart-badge">{totalItems}</span>
        </h1>
        <button
          className="cart-clear-btn"
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
        >
          Clear All
        </button>
      </div>

      <div className="cart-layout">
        {/* Items list */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-emoji">{item.emoji}</div>
              <div className="cart-item-info">
                <h4 className="cart-item-name">{item.name}</h4>
                <span className="cart-item-unit">${item.price.toFixed(2)} each</span>
              </div>
              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => dispatch({ type: 'DECREASE_QTY', payload: item.id })}
                  aria-label="Decrease"
                >
                  <FiMinus />
                </button>
                <span className="cart-item-qty">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => dispatch({ type: 'INCREASE_QTY', payload: item.id })}
                  aria-label="Increase"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="cart-item-subtotal">
                ${(item.price * item.qty).toFixed(2)}
              </div>
              <button
                className="cart-remove-btn"
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                aria-label="Remove"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span className={DELIVERY_FEE === 0 ? 'free-delivery' : ''}>
              {DELIVERY_FEE === 0 ? '🎉 Free' : `$${DELIVERY_FEE.toFixed(2)}`}
            </span>
          </div>
          {DELIVERY_FEE > 0 && (
            <p className="free-delivery-hint">Add ${(30 - totalPrice).toFixed(2)} more for free delivery</p>
          )}
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            <FiShoppingBag /> Proceed to Checkout
          </button>
          <button className="continue-shopping-btn" onClick={() => navigate('/dishes')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
