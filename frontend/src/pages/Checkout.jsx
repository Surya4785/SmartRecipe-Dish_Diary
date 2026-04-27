import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { useNavigate } from 'react-router-dom'
import { FiLock, FiCreditCard, FiCheck, FiArrowLeft } from 'react-icons/fi'

const STEPS = ['Delivery', 'Payment', 'Confirm']

function StepIndicator({ current }) {
  return (
    <div className="checkout-steps">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
            <div className="step-circle">
              {i < current ? <FiCheck /> : i + 1}
            </div>
            <span className="step-label">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${i < current ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function Checkout() {
  const { cart, totalPrice, totalItems, dispatch: cartDispatch } = useCart()
  const { dispatch: orderDispatch } = useOrders()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')

  const TAX_RATE = 0.08
  const DELIVERY_FEE = totalPrice > 30 ? 0 : 3.99
  const tax = totalPrice * TAX_RATE
  const grandTotal = totalPrice + tax + DELIVERY_FEE

  const [delivery, setDelivery] = useState({
    name: '', phone: '', address: '', city: '', zip: '', notes: ''
  })
  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '', method: 'card'
  })
  const [errors, setErrors] = useState({})

  const validateDelivery = () => {
    const e = {}
    if (!delivery.name.trim()) e.name = 'Name is required'
    if (!delivery.phone.trim()) e.phone = 'Phone is required'
    if (!delivery.address.trim()) e.address = 'Address is required'
    if (!delivery.city.trim()) e.city = 'City is required'
    if (!delivery.zip.trim()) e.zip = 'ZIP is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePayment = () => {
    if (payment.method === 'cod') return true
    const e = {}
    if (!payment.cardName.trim()) e.cardName = 'Cardholder name required'
    if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter valid 16-digit card number'
    if (!payment.expiry.trim()) e.expiry = 'Expiry required'
    if (payment.cvv.length < 3) e.cvv = 'Enter valid CVV'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleDeliveryChange = e => {
    setDelivery(p => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  const handlePaymentChange = e => {
    let val = e.target.value
    if (e.target.name === 'cardNumber') {
      val = val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (e.target.name === 'expiry') {
      val = val.replace(/\D/g, '').slice(0, 4)
      if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
    }
    if (e.target.name === 'cvv') val = val.replace(/\D/g, '').slice(0, 4)
    setPayment(p => ({ ...p, [e.target.name]: val }))
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  const nextStep = () => {
    if (step === 0 && !validateDelivery()) return
    if (step === 1 && !validatePayment()) return
    setStep(s => s + 1)
  }

  const placeOrder = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    const id = 'ORD-' + Date.now().toString(36).toUpperCase()
    setOrderId(id)
    orderDispatch({
      type: 'PLACE_ORDER',
      payload: {
        id,
        items: cart,
        total: grandTotal,
        delivery,
        paymentMethod: payment.method,
        status: 'confirmed',
        placedAt: new Date().toISOString(),
      }
    })
    cartDispatch({ type: 'CLEAR_CART' })
    setLoading(false)
    setOrderPlaced(true)
  }

  if (cart.length === 0 && !orderPlaced) {
    navigate('/dishes')
    return null
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-ring">
            <div className="success-check"><FiCheck /></div>
          </div>
          <h2 className="success-title">Order Placed! 🎉</h2>
          <p className="success-sub">Your order <strong>{orderId}</strong> has been confirmed.</p>
          <p className="success-eta">Estimated delivery: <strong>30–45 minutes</strong></p>
          <div className="success-actions">
            <button className="checkout-btn" onClick={() => navigate('/orders')}>
              Track My Orders
            </button>
            <button className="continue-shopping-btn" onClick={() => navigate('/dishes')}>
              Order More
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => step === 0 ? navigate('/cart') : setStep(s => s - 1)}>
          <FiArrowLeft /> {step === 0 ? 'Back to Cart' : 'Back'}
        </button>
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <StepIndicator current={step} />

      <div className="checkout-layout">
        {/* Left: Form */}
        <div className="checkout-form-area">
          {/* Step 0: Delivery */}
          {step === 0 && (
            <div className="checkout-card">
              <h2 className="checkout-card-title">📍 Delivery Details</h2>
              <div className="checkout-form-grid">
                <div className="form-group">
                  <label htmlFor="co-name">Full Name *</label>
                  <input id="co-name" name="name" className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="John Smith" value={delivery.name} onChange={handleDeliveryChange} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="co-phone">Phone *</label>
                  <input id="co-phone" name="phone" className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+1 555 000 0000" value={delivery.phone} onChange={handleDeliveryChange} />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="form-group full-width">
                  <label htmlFor="co-address">Street Address *</label>
                  <input id="co-address" name="address" className={`form-input ${errors.address ? 'error' : ''}`}
                    placeholder="123 Main Street, Apt 4B" value={delivery.address} onChange={handleDeliveryChange} />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="co-city">City *</label>
                  <input id="co-city" name="city" className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="New York" value={delivery.city} onChange={handleDeliveryChange} />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="co-zip">ZIP Code *</label>
                  <input id="co-zip" name="zip" className={`form-input ${errors.zip ? 'error' : ''}`}
                    placeholder="10001" value={delivery.zip} onChange={handleDeliveryChange} />
                  {errors.zip && <span className="field-error">{errors.zip}</span>}
                </div>
                <div className="form-group full-width">
                  <label htmlFor="co-notes">Delivery Notes (optional)</label>
                  <textarea id="co-notes" name="notes" className="form-input form-textarea"
                    placeholder="Leave at door, ring bell, etc." value={delivery.notes}
                    onChange={handleDeliveryChange} rows={2} />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="checkout-card">
              <h2 className="checkout-card-title"><FiCreditCard /> Payment</h2>
              <div className="payment-method-tabs">
                <button className={`pay-tab ${payment.method === 'card' ? 'active' : ''}`}
                  onClick={() => setPayment(p => ({ ...p, method: 'card' }))}>
                  💳 Card
                </button>
                <button className={`pay-tab ${payment.method === 'cod' ? 'active' : ''}`}
                  onClick={() => setPayment(p => ({ ...p, method: 'cod' }))}>
                  💵 Cash on Delivery
                </button>
              </div>
              {payment.method === 'card' && (
                <div className="checkout-form-grid">
                  {/* Card preview */}
                  <div className="full-width">
                    <div className="card-preview">
                      <div className="card-preview-chip">💳</div>
                      <div className="card-preview-number">
                        {payment.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="card-preview-bottom">
                        <div>
                          <div className="card-preview-label">Card Holder</div>
                          <div className="card-preview-value">{payment.cardName || 'YOUR NAME'}</div>
                        </div>
                        <div>
                          <div className="card-preview-label">Expires</div>
                          <div className="card-preview-value">{payment.expiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="co-cardName">Cardholder Name *</label>
                    <input id="co-cardName" name="cardName" className={`form-input ${errors.cardName ? 'error' : ''}`}
                      placeholder="John Smith" value={payment.cardName} onChange={handlePaymentChange} />
                    {errors.cardName && <span className="field-error">{errors.cardName}</span>}
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="co-cardNumber">Card Number *</label>
                    <input id="co-cardNumber" name="cardNumber" className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                      placeholder="1234 5678 9012 3456" value={payment.cardNumber} onChange={handlePaymentChange} />
                    {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="co-expiry">Expiry *</label>
                    <input id="co-expiry" name="expiry" className={`form-input ${errors.expiry ? 'error' : ''}`}
                      placeholder="MM/YY" value={payment.expiry} onChange={handlePaymentChange} />
                    {errors.expiry && <span className="field-error">{errors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="co-cvv">CVV *</label>
                    <input id="co-cvv" name="cvv" type="password" className={`form-input ${errors.cvv ? 'error' : ''}`}
                      placeholder="•••" value={payment.cvv} onChange={handlePaymentChange} />
                    {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                  </div>
                </div>
              )}
              {payment.method === 'cod' && (
                <div className="cod-info">
                  <div className="cod-icon">💵</div>
                  <h4>Cash on Delivery</h4>
                  <p>Please keep exact change ready. Our delivery partner will collect payment at your door.</p>
                </div>
              )}
              <div className="secure-note">
                <FiLock /> Payments are 256-bit SSL encrypted
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="checkout-card">
              <h2 className="checkout-card-title">✅ Review Order</h2>
              <div className="confirm-section">
                <h4>📍 Delivery To</h4>
                <p>{delivery.name}</p>
                <p>{delivery.address}, {delivery.city} {delivery.zip}</p>
                <p>{delivery.phone}</p>
                {delivery.notes && <p className="confirm-notes">{delivery.notes}</p>}
              </div>
              <div className="confirm-section">
                <h4>💳 Payment</h4>
                <p>{payment.method === 'cod' ? 'Cash on Delivery' : `Card ending in ${payment.cardNumber.slice(-4)}`}</p>
              </div>
              <div className="confirm-items">
                <h4>🛒 Items ({totalItems})</h4>
                {cart.map(item => (
                  <div key={item.id} className="confirm-item">
                    <span>{item.emoji} {item.name} × {item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="checkout-nav-btns">
            {step < 2 ? (
              <button className="checkout-btn" onClick={nextStep}>
                {step === 0 ? 'Continue to Payment' : 'Review Order'} <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
              </button>
            ) : (
              <button className="checkout-btn place-order-btn" onClick={placeOrder} disabled={loading}>
                {loading ? (
                  <span className="placing-order">
                    <span className="mini-spinner" /> Placing Order...
                  </span>
                ) : (
                  '🎉 Place Order'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="checkout-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="checkout-summary-items">
            {cart.map(item => (
              <div key={item.id} className="checkout-sum-item">
                <span>{item.emoji} {item.name} × {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery</span><span className={DELIVERY_FEE === 0 ? 'free-delivery' : ''}>{DELIVERY_FEE === 0 ? 'Free' : `$${DELIVERY_FEE.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  )
}
