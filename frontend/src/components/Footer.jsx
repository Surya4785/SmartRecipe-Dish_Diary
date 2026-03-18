import React from 'react'
import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-brand">🍳 SmartRecipe</span>
        <p className="footer-text">
          Crafted with ❤️ by <a href="https://github.com/Surya4785" target="_blank" rel="noopener noreferrer">Surya Prakash Yadav</a>
        </p>
        <div className="footer-links">
          <a href="https://github.com/Surya4785" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  )
}