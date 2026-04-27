import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'INCREASE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload ? { ...i, qty: i.qty + 1 } : i
        )
      }
    case 'DECREASE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload ? { ...i, qty: Math.max(1, i.qty - 1) } : i
        )
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]')
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const totalItems = state.items.reduce((acc, i) => acc + i.qty, 0)
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart: state.items, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
