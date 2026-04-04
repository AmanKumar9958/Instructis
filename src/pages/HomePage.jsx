import { Link } from 'react-router-dom'
import './HomePage.css'

const advantages = [
  {
    title: 'Conceptual clarity through visualisation',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Personalised learning programs',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Unmatched individual attention',
    image:
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80',
  },
]

const testimonials = [
  {
    quote: "Instructis is the best app for my daughter to strengthen her Science basics.",
    person: 'Mother of Devananda',
    meta: 'Class 6 | Bangalore',
    image: 'https://randomuser.me/api/portraits/women/62.jpg',
  },
  {
    quote: 'My son understands Math better with Instructis',
    person: 'Father of Souradip',
    meta: 'Class 6 | Kolkata',
    image: 'https://randomuser.me/api/portraits/men/61.jpg',
  },
  {
    quote: 'Instructis helped me understand the concepts through real-life examples',
    person: 'Suraj Peela',
    meta: 'Class 11 | Hyderabad',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
]

const HomePage = () => {
  return (
    <section className="instructis-home">
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-left">
            <img
              src="https://images.unsplash.com/photo-1624022350493-d4e94190775b?auto=format&fit=crop&w=1100&q=80"
              alt="Happy student"
            />
          </div>

          <form className="hero-form" onSubmit={(event) => event.preventDefault()}>
            <h2>Book your Free Session</h2>
            <p>Learn from India&apos;s best teachers</p>

            <div className="section-title">Select the Session Mode</div>
            <div className="mode-switch">
              <button type="button" className="active">
                Online
              </button>
              <button type="button">Offline</button>
            </div>

            <div className="section-title">Enter Your Details</div>
            <input type="text" placeholder="Enter Name of your Child" />

            <div className="mobile-row">
              <input type="tel" placeholder="Enter your Mobile Number" />
              <button type="button">Send OTP</button>
            </div>

            <input type="email" placeholder="Email Address" />

            <select defaultValue="">
              <option value="" disabled>
                State
              </option>
              <option>Delhi</option>
              <option>Maharashtra</option>
              <option>Karnataka</option>
              <option>West Bengal</option>
            </select>

            <button type="submit" className="cta-button">
              Schedule a Free Class
            </button>
          </form>
        </div>
      </section>

      <section className="program-intro">
        <h3>Comprehensive learning programs</h3>
        <h3>&amp; classes for all students</h3>
        <p>Become lifelong learners with India&apos;s best teachers,</p>
        <p>engaging video lessons and personalised learning journeys</p>
      </section>

      <section className="tracks-section">
        <div className="tracks-wrap">
          <div className="tracks-pill">JEE/NEET</div>
          <div className="track-grid">
            <div className="track-card left">
              <img
                src="https://images.unsplash.com/photo-1596496050827-8299e0220de1?auto=format&fit=crop&w=800&q=80"
                alt="JEE classroom"
              />
              <p>Comprehensive learning program for JEE preparation</p>
              <Link to="/jee">Explore JEE</Link>
            </div>

            <div className="center-logo">Instructis</div>

            <div className="track-card right">
              <img
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80"
                alt="NEET classroom"
              />
              <p>Comprehensive learning program for NEET aspirants</p>
              <Link to="/neet">Explore NEET</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="advantage-section">
        <h2>Get the Instructis advantage</h2>
        <div className="advantage-grid">
          {advantages.map((item) => (
            <article key={item.title}>
              <img src={item.image} alt={item.title} />
              <h4>{item.title}</h4>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Our students and parents love us</h2>

        <div className="stats-row">
          <div>
            <span className="stat-icon" aria-hidden>
              ⬇
            </span>
            <p className="big">150+ Million</p>
            <p>downloads</p>
          </div>
          <div>
            <span className="stat-icon" aria-hidden>
              ✦
            </span>
            <p className="big">4.7+ Star</p>
            <p>app rating</p>
          </div>
          <div>
            <span className="stat-icon" aria-hidden>
              ⌖
            </span>
            <p className="big">1701+ Cities</p>
            <p>worldwide</p>
          </div>
          <div>
            <span className="stat-icon" aria-hidden>
              ◔
            </span>
            <p className="big">71 mins avg.</p>
            <p>time spent daily</p>
          </div>
        </div>

        <div className="quotes-row">
          {testimonials.map((item) => (
            <article key={item.person}>
              <img src={item.image} alt={item.person} />
              <p className="quote">{item.quote}</p>
              <p className="person">{item.person}</p>
              <p className="meta">{item.meta}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default HomePage
