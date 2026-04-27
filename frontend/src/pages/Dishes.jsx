import React, { useState } from 'react'
import { DISHES, CATEGORIES } from '../data/dishes'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiStar, FiClock, FiZap, FiPlus, FiCheck } from 'react-icons/fi'

export default function Dishes() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [addedIds, setAddedIds] = useState({})
  const { dispatch, cart } = useCart()

  const filtered = DISHES
    .filter(d => {
      const matchCat = activeCategory === 'All' || d.category === activeCategory
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.rating - a.rating
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  const handleAdd = (dish) => {
    dispatch({ type: 'ADD_ITEM', payload: { id: dish.id, name: dish.name, price: dish.price, emoji: dish.emoji } })
    setAddedIds(prev => ({ ...prev, [dish.id]: true }))
    setTimeout(() => setAddedIds(prev => ({ ...prev, [dish.id]: false })), 1500)
  }

  const getCartQty = (id) => {
    const item = cart.find(i => i.id === id)
    return item ? item.qty : 0
  }

  return (
    <div className="dishes-page">
      {/* Hero banner */}
      <div className="dishes-hero">
        <div className="dishes-hero-bg" />
        <div className="dishes-hero-content">
          <span className="dishes-hero-badge">🍽️ Restaurant Menu</span>
          <h1 className="dishes-hero-title">
            Order <span className="gradient-text">Delicious</span> Food
          </h1>
          <p className="dishes-hero-sub">
            Handcrafted by our chefs, delivered fresh to your door
          </p>
          {/* Search */}
          <div className="dishes-search">
            <span className="dishes-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="dishes-search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="dishes-main">
        {/* Filters row */}
        <div className="dishes-filters">
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sort-select-wrap">
            <label htmlFor="sortBy" className="sort-label">Sort:</label>
            <select
              id="sortBy"
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="rating">Rating</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        {search && (
          <p className="dishes-count">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{search}&quot;
          </p>
        )}

        {filtered.length === 0 && (
          <div className="empty-state" style={{ marginTop: '3rem' }}>
            <div className="empty-state-icon">🙈</div>
            <h3>No dishes found</h3>
            <p>Try a different category or search term</p>
          </div>
        )}

        {/* Dish Grid */}
        <div className="dishes-grid">
          {filtered.map((dish, idx) => {
            const qty = getCartQty(dish.id)
            const justAdded = addedIds[dish.id]
            return (
              <div key={dish.id} className="dish-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                {/* Card Image / Gradient */}
                <div className="dish-card-img" style={{ background: dish.gradient }}>
                  <span className="dish-emoji">{dish.emoji}</span>
                  {dish.popular && (
                    <span className="dish-popular-badge"><FiZap /> Popular</span>
                  )}
                  {qty > 0 && (
                    <span className="dish-qty-badge">{qty} in cart</span>
                  )}
                </div>

                {/* Card Body */}
                <div className="dish-card-body">
                  <div className="dish-card-top">
                    <div>
                      <h3 className="dish-name">{dish.name}</h3>
                      <span className="dish-category">{dish.category}</span>
                    </div>
                    <div className="dish-rating">
                      <FiStar className="star-icon" />
                      <span>{dish.rating}</span>
                      <span className="dish-reviews">({dish.reviews})</span>
                    </div>
                  </div>

                  <p className="dish-description">{dish.description}</p>

                  <div className="dish-meta">
                    <span className="dish-meta-item"><FiClock /> {dish.time}</span>
                    <span className="dish-meta-item">🔥 {dish.calories} cal</span>
                    {dish.tags.slice(0, 2).map(t => (
                      <span key={t} className="dish-tag">{t}</span>
                    ))}
                  </div>

                  <div className="dish-card-footer">
                    <span className="dish-price">${dish.price.toFixed(2)}</span>
                    <button
                      className={`add-to-cart-btn ${justAdded ? 'added' : ''}`}
                      onClick={() => handleAdd(dish)}
                      aria-label={`Add ${dish.name} to cart`}
                    >
                      {justAdded ? (
                        <><FiCheck /> Added!</>
                      ) : (
                        <><FiPlus /> Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
