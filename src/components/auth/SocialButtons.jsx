import facebook from '../../assets/Facebook.png'
import google from '../../assets/Google.png'
import twitter from '../../assets/Twitter.png'
import Email from '../../assets/email.png'

// Master list of social providers used to build UI buttons.
const SOCIAL_PLATFORMS = [
  {
    name: 'Facebook',
    iconSrc: facebook,
    className: 'facebook',
    href: 'https://www.facebook.com/login/',
  },
  {
    name: 'Google',
    iconSrc: google,
    className: 'google',
    href: 'https://accounts.google.com/',
  },
  {
    name: 'Twitter',
    iconSrc: twitter,
    className: 'twitter',
    href: 'https://x.com/i/flow/login',
  },
]

function SocialButtons({ prefix = 'Continue with', includeWorkEmail = false, onWorkEmailClick = () => {} }) {
  // Convert platform list into button-ready objects.
  const items = SOCIAL_PLATFORMS.map((platform) => ({
    iconSrc: platform.iconSrc,
    text: `${prefix} ${platform.name}`,
    className: platform.className,
    href: platform.href,
  }))

  // Optional extra button for wizard mode.
  if (includeWorkEmail) {
    items.push({
      iconSrc: Email,
      text: 'Continue with work email',
      className: 'work-email',
      onClick: onWorkEmailClick,
    })
  }

  return (
    <div className="social-list">
      {items.map((item) => (
        <button
          key={item.text}
          className={`social-btn ${item.className}`}
          type="button"
          onClick={() => {
            if (item.onClick) {
              item.onClick()
              return
            }
            if (item.href) {
              window.open(item.href, '_blank', 'noopener,noreferrer')
            }
          }}
        >
          <span className="social-icon">
            {/* Social buttons show image icon, work-email fallback shows `@` text. */}
            {item.iconSrc ? <img src={item.iconSrc} alt="" aria-hidden="true" /> : item.iconText}
          </span>
          <span>{item.text}</span>
        </button>
      ))}
    </div>
  )
}

export default SocialButtons
