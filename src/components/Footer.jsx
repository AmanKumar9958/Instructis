import { Share2, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1C1D1F] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div>
            <Link to="/" className="text-2xl font-black text-brand-purple tracking-tight">
              INSTRUCTIS<span className="text-brand-orange">.</span>
            </Link>

            <p className="text-gray-400 text-sm mb-6">
              Instructis offers you multiple payment methods. Payment gateway partners use secure encryption technology to keep your transaction details confidential at all times.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-purple transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-purple transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="mailto:contact@instructis.co.in" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-purple transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Exam Preparation</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/jee" className="hover:text-brand-orange transition-colors">JEE Main</Link></li>
              <li><Link to="/jee" className="hover:text-brand-orange transition-colors">JEE Advanced</Link></li>
              <li><Link to="/neet" className="hover:text-brand-orange transition-colors">NEET (UG)</Link></li>
              <li><a href="/#boards" className="hover:text-brand-orange transition-colors">Class 12 Boards</a></li>
              <li><a href="/#boards" className="hover:text-brand-orange transition-colors">Class 11 Boards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><a href="/#book-session" className="hover:text-brand-orange transition-colors">Contact Us</a></li>
              <li><a href="/#testimonials" className="hover:text-brand-orange transition-colors">Student Reviews</a></li>
              <li><a href="/#book-session" className="hover:text-brand-orange transition-colors">Careers</a></li>
              <li><Link to="/centers" className="hover:text-brand-orange transition-colors">Instructis Centers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="font-bold text-white mr-2">Call:</span> +91 7093858372
              </li>
              <li className="flex items-start">
                <span className="font-bold text-white mr-2">Email:</span> contact@instructis.co.in
              </li>
              <li className="flex items-start mt-4">
                <span className="font-bold text-white mr-2">Address:</span> Zebrold Tech Park, Plot no.13, Software units layout, Madhapur, Hyderabad- 500081
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Instructis. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/#about" className="hover:text-white transition-colors">Disclaimer</a>
            <a href="/#about" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/#about" className="hover:text-white transition-colors">Terms of Services</a>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
