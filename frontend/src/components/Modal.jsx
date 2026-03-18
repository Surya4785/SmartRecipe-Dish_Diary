import React from 'react'

export default function Modal({ children, onClose }) {
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        {children}
      </div>
    </>
  )
}