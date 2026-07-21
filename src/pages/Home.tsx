import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge">📁 Virtual Binders for Your Stuff</div>
        <h1>MyStuffsBetter</h1>
        <p className="hero-tagline">
          Show off your collection like a pro. Create binders, add cards, and share them with anyone — no account needed to view.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/login" className="btn btn-ghost btn-lg">I already have an account</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📁</div>
          <h3>Create Binders</h3>
          <p>Organize your cards into binders. Name them whatever you want — Pokemon, trading cards, art, anything.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🖼️</div>
          <h3>Add Cards with Pics</h3>
          <p>Upload a picture and give each card a name. Your binder fills up fast and looks awesome.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3>Share with Anyone</h3>
          <p>Get a link, send it to friends. They can see your binder without signing up. It's that easy.</p>
        </div>
      </section>

      <section className="cta-bottom">
        <h2>Ready to show your stuff?</h2>
        <Link to="/signup" className="btn btn-primary btn-lg">Create Your Account</Link>
      </section>
    </div>
  )
}
