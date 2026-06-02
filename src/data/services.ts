import wheelAlignmentImg from '../assets/wheel-alignment.png'
import wheelBalancingImg from '../assets/wheel-balancing.png'
import multiBrandTyresImg from '../assets/multi-brand-tyres.png'
import automaticCarSpaImg from '../assets/automatic-car-spa.png'
import foamWashImg from '../assets/foam-wash.png'
import interiorCleaningImg from '../assets/interior-cleaning.png'
import teflonCoatingImg from '../assets/teflon-coating.png'
import ceramicCoatingImg from '../assets/ceramic-coating.png'


export interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
  icon: string
  image: string
}

export const GARAGE = {
  name: 'TYRE TRACK',

  owner: 'Rtn A Charles',

  phone1: '9443738487',
  phone2: '7448787979',

  whatsapp: '9443738487',

  email: 'tyretrack2024@gmail.com',

  address:
    '107/2 Andipalayam, Opposite Gokulam Apartment, Mangalam Road, Tirupur',

  mapLink:
    'https://maps.app.goo.gl/RNxAmWY4DbxqEm3g9',

  mapEmbed:
    'https://maps.google.com/maps?q=TYRE%20TRACK%20Tirupur&t=&z=15&ie=UTF8&iwloc=&output=embed',
}

export const services = [
  {
    id: 'wheel-alignment',
    title: 'Wheel Alignment',
    description:
      'Precision wheel alignment service for smooth handling, tyre life improvement, and driving stability for all four wheelers.',
    price: 'Premium Alignment',
    duration: '45 mins',
    image: wheelAlignmentImg,
    icon: '⦿',
  },

  {
    id: 'wheel-balancing',
    title: 'Wheel Balancing',
    description:
      'Advanced wheel balancing service for vibration-free driving and maximum tyre performance.',
    price: 'Professional Service',
    duration: '30 mins',
    image: wheelBalancingImg,
    icon: '⛭',
  },

  {
    id: 'multi-brand-tyres',
    title: 'Multi Brand Tyres',
    description:
      'Tyres available for both four wheelers and two wheelers including Bridgestone, Apollo, Michelin, Yokohama, Pirelli, Continental and Goodyear.',
    price: 'All Brands Available',
    duration: 'Instant',
    image: multiBrandTyresImg,
    icon: '⍟',
  },

  {
    id: 'automatic-car-spa',
    title: 'Automatic Car Spa',
    description:
      'Premium automatic car spa with foam wash, detailing, and luxury finish for all vehicle types.',
    price: 'Starting from ₹499',
    duration: '60 mins',
    image: automaticCarSpaImg,
    icon: '◈' ,
  },

  {
    id: 'foam-wash',
    title: 'Foam Wash',
    description:
      'High-pressure foam wash service with deep exterior cleaning and glossy finish.',
    price: 'Quick Wash',
    duration: '25 mins',
    image: foamWashImg,
    icon: '✺',
  },

  {
    id: 'interior-cleaning',
    title: 'Interior Cleaning',
    description:
      'Complete interior cleaning including seats, dashboard, carpets, and deep vacuum detailing.',
    price: 'Detailing Service',
    duration: '90 mins',
    image: interiorCleaningImg,
    icon: '⬡' ,
  },

  {
    id: 'teflon-coating',
    title: 'Teflon Coating',
    description:
      'Premium Teflon coating protection for long-lasting shine and paint protection.',
    price: 'Premium Coating',
    duration: '2 hrs',
    image: teflonCoatingImg,
    icon:'✴',
  },

  {
    id: 'ceramic-coating',
    title: 'Ceramic Coating',
    description:
      'Luxury ceramic coating with water repellence and mirror gloss protection.',
    price: 'Luxury Package',
    duration: '4 hrs',
    image: ceramicCoatingImg,
    icon: '✦',
  },
]