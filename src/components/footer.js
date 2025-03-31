import React from 'react';
import './footer.css';

import logo from "../images/PlateItUpLogo.png"

{/*FIX ME: MAKE THIS LOOK BETTER, the layout is too awkward, too much empty space*/ }

const Footer = ({ siteTitle }) => {
  return (
    <footer className="footer bg-dark text-light py-4">
      <div className="container">
        {/* Top Section */}
        <div className="row align-items-center footer-top">
          {/* Site Title */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="d-flex flex-row align-items-center">
                <img src={logo} alt="logo" className="footer-logo me-2"/>
                <h1 className="mb-0">{siteTitle}</h1>
            </div>
          </div>
          {/* Products List */}
          <div className="col-md-8 text-end">
            <div className="d-inline-block me-5">
                <h6>Products</h6>
                <ul className="list-unstyled">
                <li><a href="/recipes" className="text-light">Recipes</a></li>
                <li><a href="/mealplan" className="text-light">Meal Plan</a></li>
                <li><a href="/budget" className="text-light">Budget</a></li>
                </ul>
            </div>
            {/* About Us */}
            <div className="d-inline-block">
                <h6>Company</h6>
                <ul className="list-unstyled">
                <li><a href="/about-us" className="text-light">About Us</a></li>
                <li><a href="/careers" className="text-light">Careers</a></li>
                <li><a href="/press" className="text-light">Press</a></li>
                </ul>
            </div>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Bottom Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small>&copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.</small>
          <div>
            <a href="/community-guidelines" className="text-light me-2">Community Guidelines</a>
            <a href="/feedback" className="text-light me-2">Feedback</a>
            <a href="/terms" className="text-light me-2">Terms</a>
            <a href="/privacy" className="text-light me-2">Privacy</a>
            <a href="/api" className="text-light me-2">API</a>
            <a href="/cookie-preferences" className="text-light">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
