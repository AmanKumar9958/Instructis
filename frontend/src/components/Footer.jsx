import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/faculty-marks-upload', label: 'Faculty Marks Upload' }
]

const Footer = () => {
  return (
    <footer className="mt-8 border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm text-neutral-600">© {new Date().getFullYear()} Instructis. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-3" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-2 py-1 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
