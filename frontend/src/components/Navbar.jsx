import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import CartIcon from './CartIcon'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  let token = localStorage.getItem("token")
  const [isLogin, setIsLogin] = useState(token ? false : true)
  let user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    setIsLogin(token ? false : true)
  }, [token])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLogin(true)
      window.location.reload()
    } else {
      setIsOpen(true)
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🍳</span>
          SmartRecipe
        </NavLink>

        <button className="menu-toggle" onClick={() => setMenuOpen(prev => !prev)} aria-label="Toggle menu">
          <span className={menuOpen ? 'open-bar-1' : ''}></span>
          <span className={menuOpen ? 'open-bar-2' : ''}></span>
          <span className={menuOpen ? 'open-bar-3' : ''}></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" end onClick={closeMenu}>
              🏠 Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dishes" onClick={closeMenu}>
              🍽️ Dishes
            </NavLink>
          </li>
          <li onClick={() => { if (isLogin) setIsOpen(true) }}>
            <NavLink to={!isLogin ? "/myRecipe" : "/"} onClick={closeMenu}>
              📖 My Recipes
            </NavLink>
          </li>
          <li onClick={() => { if (isLogin) setIsOpen(true) }}>
            <NavLink to={!isLogin ? "/favRecipe" : "/"} onClick={closeMenu}>
              ❤️ Favourites
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" onClick={closeMenu}>
              📦 Orders
            </NavLink>
          </li>
          <li className="cart-nav-item">
            <CartIcon />
          </li>
          <li>
            {isLogin ? (
              <button className="nav-btn login-btn" onClick={() => { checkLogin(); closeMenu(); }}>
                ✨ Login
              </button>
            ) : (
              <div className="nav-user-section">
                {user?.email && <span className="nav-user-email">{user.email}</span>}
                <button className="nav-btn logout-btn" onClick={() => { checkLogin(); closeMenu(); }}>
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}