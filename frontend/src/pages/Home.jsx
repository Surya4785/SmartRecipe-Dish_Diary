import React, { useState } from 'react'
import RecipeItems from '../components/RecipeItems'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'

export default function Home() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const addRecipe = () => {
    let token = localStorage.getItem("token")
    if (token) navigate("/addRecipe")
    else setIsOpen(true)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating decorative emojis */}
        <span className="hero-deco" aria-hidden="true">🍕</span>
        <span className="hero-deco" aria-hidden="true">🥗</span>
        <span className="hero-deco" aria-hidden="true">🍰</span>
        <span className="hero-deco" aria-hidden="true">🥘</span>
        <span className="hero-deco" aria-hidden="true">🍜</span>
        <span className="hero-deco" aria-hidden="true">🧁</span>

        <div className="hero-content">
          <div className="hero-badge">🔥 Your Digital Cookbook</div>
          <h1 className="hero-title">
            Cook, Share &<br />
            <span className="gradient-text">Discover Recipes</span>
          </h1>
          <p className="hero-description">
            Your personal recipe diary where you can store, organize, and share
            your favorite dishes with friends and the community. Start your
            culinary journey today!
          </p>
          <button className="hero-cta" onClick={addRecipe}>
            <span>🍳</span> Share Your Recipe
          </button>
        </div>

        {/* Decorative wave */}
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              fill="rgba(26,25,40,0.6)"
              d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="recipes-section">
        <div className="section-header">
          <h2>🍽️ Latest Recipes</h2>
          <p>Explore delicious recipes shared by our community</p>
        </div>
        <RecipeItems />
      </section>

      {/* Auth Modal */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}