import logo from '../../assets/Logo@2x.png'

function Logo() {
  return (
    // Shared logo block used across all auth pages.
    <div className="logo" aria-label="Able Pro">
      {/* Imported image path is handled by Vite bundler. */}
      <img src={logo} alt="Able Pro logo for dashboard application" />
    </div>
  )
}

export default Logo
