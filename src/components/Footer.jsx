import { Share2, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-white relative overflow-hidden">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-black text-brand-purple tracking-tight">
              INSTRUCTIS<span className="text-brand-orange">.</span>
            </Link>

            <p className="text-gray-400 text-sm mt-4 mb-6 leading-relaxed">
              Comprehensive learning platform for competitive exams, AI & ML, coding, and career-oriented paths.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-dark-secondary flex items-center justify-center hover:bg-brand-purple transition-colors group">
                <Share2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-dark-secondary flex items-center justify-center hover:bg-brand-purple transition-colors group">
                <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="mailto:contact@instructis.co.in" className="w-9 h-9 rounded-xl bg-surface-dark-secondary flex items-center justify-center hover:bg-brand-purple transition-colors group">
                <Mail className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Competitive Exams */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-5">Competitive Exams</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/competitive-exams/jee" className="hover:text-brand-orange transition-colors">JEE Main & Advanced</Link></li>
              <li><Link to="/competitive-exams/neet" className="hover:text-brand-orange transition-colors">NEET UG</Link></li>
              <li><Link to="/competitive-exams/upsc" className="hover:text-brand-orange transition-colors">UPSC Civil Services</Link></li>
              <li><Link to="/competitive-exams/cat" className="hover:text-brand-orange transition-colors">CAT</Link></li>
              <li><Link to="/competitive-exams/gate" className="hover:text-brand-orange transition-colors">GATE</Link></li>
              <li><Link to="/competitive-exams" className="hover:text-brand-orange transition-colors font-medium">View All →</Link></li>
            </ul>
          </div>

          {/* Learning Paths */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-5">Learning Paths</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/ai-ml" className="hover:text-brand-orange transition-colors">AI & Machine Learning</Link></li>
              <li><Link to="/coding" className="hover:text-brand-orange transition-colors">Coding & Programming</Link></li>
              <li><Link to="/careers" className="hover:text-brand-orange transition-colors">Career Paths</Link></li>
              <li><a href="/#book-session" className="hover:text-brand-orange transition-colors">Test Series</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-5">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link to="/partner" className="hover:text-brand-orange transition-colors">Partner With Us</Link></li>
              <li><Link to="/centers" className="hover:text-brand-orange transition-colors">Centers</Link></li>
              <li><a href="mailto:contact@instructis.co.in" className="hover:text-brand-orange transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-5">Get in Touch</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-gray-300">Call:</span> +91 7093858372
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-gray-300">Email:</span> contact@instructis.co.in
              </li>
              <li className="flex items-start gap-2 mt-3">
                <span className="font-semibold text-gray-300">Address:</span>
                <span>Zebrold Tech Park, Plot no.13, Software units layout, Madhapur, Hyderabad - 500081</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Instructis. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="/#about" className="hover:text-gray-300 transition-colors">Disclaimer</a>
            <a href="/#about" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="/#about" className="hover:text-gray-300 transition-colors">Terms of Services</a>
            <a href="/sitemap.xml" className="hover:text-gray-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
