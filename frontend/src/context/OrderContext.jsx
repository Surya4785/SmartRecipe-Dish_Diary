import React, { createContext, useContext, useReducer, useEffect } from 'react'

const OrderContext = createContext(null)

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'PLACE_ORDER':
      return { orders: [action.payload, ...state.orders] }
    case 'UPDATE_STATUS':
      return {
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        )
      }
    case 'CLEAR_ORDERS':
      return { orders: [] }
    default:
      return state
  }
}

const initialState = {
  orders: JSON.parse(localStorage.getItem('orders') || '[]')
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders))
  }, [state.orders])

  return (
    <OrderContext.Provider value={{ orders: state.orders, dispatch }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
