import React, { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'

export default function CartIcon() {
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const prevCount = useRef(totalItems)
  const badgeRef = useRef(null)

  useEffect(() => {
    if (totalItems > prevCount.current && badgeRef.current) {
      badgeRef.current.classList.remove('cart-badge-bump')
      // Force reflow
      void badgeRef.current.offsetWidth
      badgeRef.current.classList.add('cart-badge-bump')
    }
    prevCount.current = totalItems
  }, [totalItems])

  return (
    <button
      className="cart-nav-btn"
      onClick={() => navigate('/cart')}
      aria-label={`Cart (${totalItems} items)`}
    >
      <FiShoppingCart />
      {totalItems > 0 && (
        <span className="cart-nav-count" ref={badgeRef}>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
