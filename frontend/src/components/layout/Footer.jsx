import { motion } from 'framer-motion';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer 
      className={`${className} border-t border-gray-200 mt-auto`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center text-sm text-gray-500">
            &copy; {currentYear} Kavindu's English Learning Platform. All rights reserved.
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;