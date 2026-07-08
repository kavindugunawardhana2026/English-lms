import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-white border-t border-gray-100 ${className}`}>
      <div className="container-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & About */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-glow">
                KE
              </div>
              <span className="font-display font-bold text-gray-900 text-xl tracking-tight">
                Kavindu's English
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Empowering students in grades 6-11 to master the English language through interactive exercises, instant feedback, and personalized tracking.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                <motion.a 
                  key={social}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  {/* Placeholder SVG */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3.5c0-.88-.72-1.5-1.5-1.5s-1.5.62-1.5 1.5V17H9v-6h2v1.1c.4-.7 1.2-1.1 2-1.1 1.66 0 3 1.34 3 3V17z"/></svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/#features" className="text-gray-500 hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="/#how-it-works" className="text-gray-500 hover:text-indigo-600 transition-colors">How it works</a></li>
              <li><Link to="/exercises" className="text-gray-500 hover:text-indigo-600 transition-colors">Practice Library</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-indigo-600 transition-colors">Student Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-gray-900 mb-6">Legal</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Kavindu's English LMS. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            Designed with <span className="text-rose-500">♥</span> for education.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;