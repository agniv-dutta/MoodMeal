import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, Sparkles, Leaf, Wine, Heart, Zap, 
  ChefHat, Timer, Gauge, Users, ArrowUp, RefreshCw 
} from 'lucide-react';

const MOODS = [
  { id: "cozy",         label: "Cozy",         Icon: Sparkles, desc: "Warm, comforting, soul-soothing", color: "#C4763A", bg: "rgba(196,118,58,0.12)"  },
  { id: "celebratory",  label: "Celebratory",  Icon: Wine,     desc: "Joyful, festive, indulgent",      color: "#D4AF37", bg: "rgba(212,175,55,0.12)"  },
  { id: "stressed",     label: "Stressed",      Icon: Leaf,     desc: "Calming, simple, grounding",      color: "#6B9E7A", bg: "rgba(107,158,122,0.12)" },
  { id: "adventurous",  label: "Adventurous",  Icon: Flame,    desc: "Bold, exotic, unexpected",         color: "#C94040", bg: "rgba(201,64,64,0.12)"   },
  { id: "romantic",     label: "Romantic",     Icon: Heart,    desc: "Elegant, sensuous, intimate",      color: "#B5607A", bg: "rgba(181,96,122,0.12)"  },
  { id: "energized",    label: "Energized",    Icon: Zap,      desc: "Fresh, vibrant, powerful",         color: "#5B9FD4", bg: "rgba(91,159,212,0.12)"  },
];

const DIETARY_OPTIONS = [
  "None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Halal"
];

export default function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [ingredients, setIngredients] = useState("");
  const [dietary, setDietary] = useState("None");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const recipeRef = useRef(null);

  useEffect(() => {
    if (recipe && recipeRef.current) {
      const timer = setTimeout(() => {
        recipeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [recipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood.id,
          mood_desc: selectedMood.desc,
          ingredients: ingredients.trim() || "None specified",
          dietary: dietary,
        }),
      });

      if (!response.ok) throw new Error("Our chef is currently unavailable. Please try again.");
      
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setIngredients("");
    setDietary("None");
    setRecipe(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SelectedIcon = selectedMood?.Icon;

  return (
    <div className="app-container">
      <div className="bg-gradients" />
      
      <main className="content-wrapper">
        {/* Header */}
        <header className="header fade-up stagger-1">
          <div className="header-decoration">
            <span className="line"></span>
            <span className="star">✦</span>
            <span className="line"></span>
          </div>
          <h1 className="logo">MOODMEAL</h1>
          <p className="subtitle">Tell us how you feel. We'll tell you what to cook.</p>
        </header>

        {!recipe && !loading && (
          <form onSubmit={handleSubmit} className="form-container">
            {/* Mood Grid */}
            <section className="section fade-up stagger-2">
              <div className="section-label">Select Your Mood</div>
              <div className="mood-grid">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    className={`mood-card ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(mood)}
                    style={{ 
                      '--mood-color': mood.color, 
                      '--mood-bg': mood.bg,
                      borderColor: selectedMood?.id === mood.id ? mood.color : 'var(--border)'
                    }}
                  >
                    <div className="mood-icon">
                      <mood.Icon size={28} strokeWidth={1.5} color={mood.color} />
                    </div>
                    <div className="mood-label">{mood.label}</div>
                    <div className="mood-desc">{mood.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Inputs Row */}
            <section className="section fade-up stagger-3">
              <div className="inputs-grid">
                <div className="input-group">
                  <div className="section-label">Ingredients on hand</div>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. chicken, lemon, garlic..."
                    className="styled-input"
                  />
                </div>
                <div className="input-group">
                  <div className="section-label">Dietary preference</div>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="styled-select"
                  >
                    {DIETARY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="cta-wrapper fade-up stagger-4">
              <button 
                type="submit" 
                className="cta-button" 
                disabled={!selectedMood}
              >
                Compose My Meal
              </button>
              {error && <p className="error-text"><i>{error}</i></p>}
            </div>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container fade-up">
            <div className="spinner"></div>
            <p className="loading-text"><i>The chef is thinking...</i></p>
          </div>
        )}

        {/* Recipe Card */}
        {recipe && (
          <div className="recipe-card-wrapper fade-up" ref={recipeRef}>
            <article className="recipe-card">
              {/* Recipe Header */}
              <header className="recipe-header" style={{ '--mood-color': selectedMood?.color }}>
                <div className="recipe-tag">
                  {SelectedIcon && <SelectedIcon size={12} strokeWidth={2} />}
                  <span>{selectedMood?.label} · {recipe.cuisine}</span>
                </div>
                <h2 className="recipe-title">{recipe.title}</h2>
                <p className="recipe-why">"{recipe.why}"</p>
                
                <div className="recipe-meta">
                  <div className="meta-item">
                    <span className="meta-label">Time</span>
                    <span className="meta-value">{recipe.time}</span>
                  </div>
                  <div className="meta-divider"></div>
                  <div className="meta-item">
                    <span className="meta-label">Difficulty</span>
                    <span className="meta-value">{recipe.difficulty}</span>
                  </div>
                  <div className="meta-divider"></div>
                  <div className="meta-item">
                    <span className="meta-label">Serves</span>
                    <span className="meta-value">2</span>
                  </div>
                </div>
              </header>

              {/* Recipe Body */}
              <div className="recipe-body">
                <section className="recipe-ingredients">
                  <div className="section-label">Ingredients</div>
                  <ul className="ingredients-list">
                    {recipe.ingredients.map((item, i) => (
                      <li key={i} className="ingredient-item">
                        <span className="bullet">—</span> {item}
                      </li>
                    ))}
                  </ul>
                </section>
                
                <section className="recipe-method">
                  <div className="section-label">Method</div>
                  <ol className="method-list">
                    {recipe.steps.map((step, i) => (
                      <li key={i} className="method-step">
                        <span className="step-number">{i + 1}</span>
                        <p className="step-text">{step}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>

              {/* Chef's Note */}
              <footer className="recipe-footer">
                <div className="chef-note-header">
                  <ChefHat size={18} strokeWidth={1.5} color="var(--gold-dim)" />
                  <span className="section-label-small">Chef's Note</span>
                </div>
                <p className="chef-note-text">
                  <i>{recipe.chefNote}</i>
                </p>
              </footer>
            </article>

            <button onClick={handleReset} className="reset-button">
              <ArrowUp size={14} /> Cook Something Else
            </button>
          </div>
        )}
      </main>

      <style>{`
        .app-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 24px;
          position: relative;
          z-index: 2;
        }

        .header {
          text-align: center;
          margin-bottom: 80px;
        }

        .header-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .header-decoration .line {
          height: 1px;
          width: 40px;
          background: var(--gold-dim);
          opacity: 0.5;
        }

        .header-decoration .star {
          color: var(--gold);
          font-size: 14px;
        }

        .logo {
          font-weight: 300;
          font-size: 4rem;
          letter-spacing: 0.12em;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .subtitle {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.78rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.7);
        }

        .section {
          margin-bottom: 48px;
        }

        .section-label {
          font-weight: 500;
          font-size: 0.68rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.6);
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(212, 175, 55, 0.15);
          margin-left: 16px;
        }

        .mood-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .mood-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 24px 16px;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mood-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--mood-bg);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .mood-card:hover::before, .mood-card.selected::before {
          opacity: 1;
        }

        .mood-icon {
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
        }

        .mood-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .mood-desc {
          font-size: 0.68rem;
          font-weight: 300;
          color: var(--text-muted);
        }

        .inputs-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
        }

        .styled-input, .styled-select {
          width: 100%;
          background: var(--surface);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 14px;
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 300;
          border-radius: 2px;
          transition: border-color 0.3s ease;
        }

        .styled-input:focus, .styled-select:focus {
          border-color: var(--gold-dim);
        }

        .styled-select option {
          background: #1A1A1A;
          color: var(--text-primary);
        }

        .cta-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }

        .cta-button {
          background: transparent;
          border: 1px solid var(--gold-dim);
          color: var(--gold);
          font-weight: 500;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 18px 56px;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(212, 175, 55, 0.08);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: -1;
        }

        .cta-button:hover:not(:disabled) {
          border-color: rgba(212, 175, 55, 0.85);
        }

        .cta-button:hover:not(:disabled)::before {
          transform: scaleX(1);
        }

        .cta-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .error-text {
          margin-top: 16px;
          color: #C94040;
          font-size: 0.85rem;
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 0;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-top: 1px solid rgba(212, 175, 55, 0.6);
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
          margin-bottom: 24px;
        }

        .loading-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        /* Recipe Card */
        .recipe-card {
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.025);
          overflow: hidden;
          margin-bottom: 32px;
        }

        .recipe-header {
          padding: 48px 48px 36px;
          border-bottom: 1px solid var(--gold-faint);
          text-align: center;
        }

        .recipe-tag {
          font-weight: 500;
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--mood-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .recipe-title {
          font-weight: 300;
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .recipe-why {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.15rem;
          color: var(--text-muted);
          margin-bottom: 32px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .recipe-meta {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meta-label {
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold-dim);
        }

        .meta-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .meta-divider {
          width: 1px;
          height: 32px;
          background: var(--gold-faint);
        }

        .recipe-body {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          align-items: start;
        }

        .recipe-ingredients {
          padding: 40px;
        }

        .ingredients-list {
          list-style: none;
        }

        .ingredient-item {
          font-size: 0.88rem;
          font-weight: 300;
          padding: 12px 0;
          color: rgba(232, 224, 212, 0.75);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .ingredient-item .bullet {
          color: var(--gold-faint);
          flex-shrink: 0;
        }

        .recipe-method {
          padding: 40px;
        }

        .method-list {
          list-style: none;
        }

        .method-step {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
        }

        .method-step:last-child {
          margin-bottom: 0;
        }

        .step-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: var(--gold);
          opacity: 0.25;
          width: 24px;
          flex-shrink: 0;
          line-height: 1;
        }

        .step-text {
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .recipe-footer {
          padding: 32px 48px;
          background: rgba(212, 175, 55, 0.03);
          border-top: 1px solid var(--gold-faint);
        }

        .chef-note-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .section-label-small {
          font-weight: 500;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-dim);
        }

        .chef-note-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-muted);
        }

        .reset-button {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
          padding: 12px;
          transition: color 0.3s ease;
        }

        .reset-button:hover {
          color: var(--gold);
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
          .logo { font-size: 2.8rem; }
          .mood-grid { grid-template-columns: repeat(2, 1fr); }
          .inputs-grid { grid-template-columns: 1fr; }
          .recipe-body { grid-template-columns: 1fr; }
          .recipe-header, .recipe-ingredients, .recipe-method, .recipe-footer {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}
