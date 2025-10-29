// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>ProCV Builder</h1>
          </div>
          <div className="nav-actions">
            <Link to="/builder" className="nav-btn secondary">Sign In</Link>
            <Link to="/builder" className="nav-btn primary">Create CV</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Create Professional CVs That Get You <span className="highlight">Hired</span>
            </h1>
            <p className="hero-subtitle">
              Build a standout CV in minutes with our easy-to-use builder, professional templates, 
              and AI-powered cover letter generation.
            </p>
            <div className="hero-actions">
              <Link to="/builder" className="cta-btn primary">Start Building Your CV</Link>
              <Link to="/builder" className="cta-btn secondary">View Templates</Link>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>No Sign Up Required</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>12 Professional Templates</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>AI Cover Letter Generator</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="template-showcase">
              <div className="template-preview main-preview">
                <div className="preview-content">
                  <div className="preview-header">
                    <div className="preview-name">John Doe</div>
                    <div className="preview-title">Software Engineer</div>
                  </div>
                  <div className="preview-body">
                    <div className="preview-section">
                      <div className="section-title">Experience</div>
                      <div className="section-item">
                        <div className="item-title">Senior Developer</div>
                        <div className="item-company">Tech Solutions Inc.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-preview secondary-preview">
                <div className="preview-content">
                  <div className="preview-header">
                    <div className="preview-name">Jane Smith</div>
                    <div className="preview-title">Marketing Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need for a Professional CV</h2>
            <p>Our tools are designed to help you create a CV that stands out to employers</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Professional Templates</h3>
              <p>Choose from 12 carefully designed templates suitable for all industries and career levels.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Industry-Tailored</h3>
              <p>Templates designed specifically for tech, creative, academic, corporate, and entrepreneurial roles.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Cover Letters</h3>
              <p>Generate tailored cover letters based on your CV and the specific job you're applying for.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Easy Customization</h3>
              <p>Change colors, layouts, and content with our intuitive form-based editor.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Instant PDF Export</h3>
              <p>Download your CV as a professional PDF file ready to send to employers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Your data stays on your device. We don't store your personal information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="templates-section">
        <div className="container">
          <div className="section-header">
            <h2>Professional Templates for Every Career</h2>
            <p>From corporate positions to creative roles, we have a template that fits your needs</p>
          </div>
          <div className="templates-grid">
            <div className="template-category">
              <h3>Corporate & Professional</h3>
              <ul>
                <li>Classic Professional</li>
                <li>Corporate Clean</li>
                <li>Executive Leadership</li>
                <li>Elegant Traditional</li>
              </ul>
            </div>
            <div className="template-category">
              <h3>Creative & Modern</h3>
              <ul>
                <li>Modern Minimalist</li>
                <li>Creative Timeline</li>
                <li>Creative Arts</li>
                <li>Bold Modern</li>
              </ul>
            </div>
            <div className="template-category">
              <h3>Tech & Startup</h3>
              <ul>
                <li>Tech Innovator</li>
                <li>Startup Entrepreneur</li>
                <li>Minimal Tech</li>
                <li>Academic Scholar</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Your Professional CV?</h2>
            <p>Build your CV now and take the next step in your career journey</p>
            <div className="cta-actions">
              <Link to="/builder" className="cta-btn primary large">Start Building for Free</Link>
              <div className="cta-note">
                <span>Pay only when you download your CV</span>
                <span className="price">R19.99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>ProCV Builder</h3>
              <p>Creating professional CVs that help you stand out</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <Link to="/builder">CV Builder</Link>
                <Link to="/builder">Templates</Link>
                <Link to="/builder">Pricing</Link>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#contact">Contact Us</a>
              </div>
              <div className="link-group">
                <h4>Legal</h4>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} ProCV Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;