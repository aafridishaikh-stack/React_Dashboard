function DashboardFooter() {
  const footerLinks = ['Support', 'License', 'Terms of Use', 'Blog']

  return (
    // Footer row: copyright on left + links on right.
    <footer className="db-footer">
      <span className="db-footer-copy">© 2022 Able pro. All Rights Reserved. Made with Phoenixcoded!</span>
      <nav aria-label="Footer links">
        {footerLinks.map((link, index) => (
          <a key={link} href="#" className={index === 0 ? 'active' : ''}>
            {link}
          </a>
        ))}
      </nav>
    </footer>
  )
}

export default DashboardFooter
