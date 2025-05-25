// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
        <div className="container footer-container">
            <div className="footer-column">
                <h4 className="footer-column__title">COMPANY</h4>
                <ul>
                    <li><a href="#">About Last.fm</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Jobs</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4 className="footer-column__title">HELP</h4>
                <ul>
                    <li><a href="#">Track My Music</a></li>
                    <li><a href="#">Community Support</a></li>
                    <li><a href="#">Community Guidelines</a></li>
                    <li><a href="#">Help</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4 className="footer-column__title">GOODIES</h4>
                <ul>
                    <li><a href="#">Download Scrobbler</a></li>
                    <li><a href="#">Developer API</a></li>
                    <li><a href="#">Free Music Downloads</a></li>
                    <li><a href="#">Merchandise</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4 className="footer-column__title">ACCOUNT</h4>
                <ul>
                    <li><a href="#">Inbox</a></li>
                    <li><a href="#">Settings</a></li>
                    <li><a href="#">Last.fm Pro</a></li>
                    <li><a href="#">Logout</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4 className="footer-column__title">FOLLOW US</h4>
                <ul>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Twitter</a></li>
                    <li><a href="#">Instagram</a></li>
                    <li><a href="#">YouTube</a></li>
                </ul>
            </div>
        </div>
        <div className="container footer-bottom-bar">
            <div className="footer-language-switcher">
                <span>English</span> <a href="#">Deutsch</a> <a href="#">Español</a> </div>
            <div className="footer-copyright">
                <p>Audioscrobbler</p>
                <p>Time zone: <span>Europe/Moscow</span></p>
                <p>© CBS Interactive © 2024 Last.fm Ltd. All rights reserved · <a href="#">Terms of Use</a> · <a href="#">Privacy Policy</a> · <a href="#">Legal Policies</a> · <a href="#">Cookies Policy</a> · <a href="#">Do Not Sell My Personal Information</a></p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;