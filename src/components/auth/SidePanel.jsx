import { Rate } from 'antd'
import AvatarAllie from '../../assets/default.png'
import AvatarMartha from '../../assets/default.png'
import AvatarKevin from '../../assets/default.png'

// Static testimonial content shown in the signup carousel.
const testimonials = [
  {
    name: 'Allie Grater',
    handle: '@alliegrater',
    avatar: AvatarAllie,
    rating: 2,
    quote:
      'Very good customer service!👌 I liked the design and there was nothing wrong, but found out after testing that it did not quite match the functionality and overall design that I needed for my type of software. I therefore contacted customer service and it was no problem even though the deadline for refund had actually expired.😍',
  },
  {
    name: 'Martha Ellis',
    handle: '@marthaellis',
    avatar: AvatarMartha,
    rating: 5,
    quote:
      'The onboarding flow was clean and easy to use. We had a few customization questions and the team responded fast with clear guidance.',
  },
  {
    name: 'Kevin Marsh',
    handle: '@kmarsh',
    avatar: AvatarKevin,
    rating: 2.5,
    quote:
      'Solid design and smooth login journey. We adjusted a few form rules, and after that the product fit our internal workflow well.',
  },
]

function TestimonialPanel() {
  return (
    // Bootstrap carousel container.
    <section className="panel testimonial">
      <div id="authTestimonialCarousel" className="carousel slide testimonial-carousel" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {/* Small dot buttons at bottom that switch slides. */}
          {testimonials.map((item, index) => (
            <button
              key={item.handle}
              type="button"
              data-bs-target="#authTestimonialCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner testimonial-inner">
          {/* Each testimonial becomes one carousel slide. */}
          {testimonials.map((item, index) => (
            <div key={item.handle} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className="avatar" aria-hidden="true">
                <img src={item.avatar} alt={`${item.name} profile photo`} />
              </div>
              <h3>{item.name}</h3>
              <p className="username">{item.handle}</p>
              <Rate allowHalf disabled value={item.rating} aria-label={`${item.rating} star rating`} />
              <p className="quote">{item.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IllustrationPanel() {
  return (
    // Decorative right-side artwork for login/register screens.
    <section className="panel illustration-panel" aria-hidden="true">
      
    </section>
  )
}

export { TestimonialPanel, IllustrationPanel }
