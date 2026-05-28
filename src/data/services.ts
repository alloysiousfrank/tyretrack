export interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
  icon: string
  image: string
}

export const services: Service[] = [
  {
    id: 'wheel-alignment',
    title: 'Wheel Alignment',
    description:
      'Precision laser alignment for perfect handling, even tyre wear, and a smoother drive on every road.',
    price: 'From ₹899',
    duration: '45–60 min',
    icon: '◎',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
  },
  {
    id: 'tyre-services',
    title: 'Tyre Services',
    description:
      'Premium tyre fitting, balancing, rotation, and puncture repair with manufacturer-grade equipment.',
    price: 'From ₹499',
    duration: '30–90 min',
    icon: '◉',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
  },
  {
    id: 'water-wash',
    title: 'Water Wash',
    description:
      'Multi-stage exterior wash with pH-balanced foam, underbody rinse, and hydrophobic finish.',
    price: 'From ₹399',
    duration: '25–40 min',
    icon: '◇',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d229ec?w=800&q=80',
  },
  {
    id: 'interior-cleaning',
    title: 'Interior Cleaning',
    description:
      'Deep vacuum, leather conditioning, dashboard detailing, and odour-neutralising treatment.',
    price: 'From ₹1,299',
    duration: '60–120 min',
    icon: '▣',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  },
]

export const GARAGE = {
  name: 'TyreTrack',
  tagline: 'Precision. Performance. Perfection.',
  phone: '+91 98765 43210',
  email: 'hello@tyretrack.in',
  address: '42 Motorway Industrial Estate, Andheri East, Mumbai 400069',
  hours: 'Mon–Sat 8:00 AM – 8:00 PM · Sun 9:00 AM – 5:00 PM',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.532326464887!2d72.8777!3d19.1136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzQ5LjAiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  mapLink: 'https://maps.google.com/?q=Andheri+East+Mumbai',
}
