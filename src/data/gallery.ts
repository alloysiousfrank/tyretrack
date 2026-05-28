export interface GalleryItem {
  id: string
  vehicle: string
  service: string
  before: string
  after: string
  date: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: '1',
    vehicle: 'BMW 3 Series',
    service: 'Full Detail + Interior',
    before: 'https://images.unsplash.com/photo-1550355291-bbee04a66027?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80',
    date: 'Apr 2026',
  },
  {
    id: '2',
    vehicle: 'Mercedes C-Class',
    service: 'Wheel Alignment',
    before: 'https://images.unsplash.com/photo-1494976388531-d1058498cdd8?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
    date: 'Mar 2026',
  },
  {
    id: '3',
    vehicle: 'Audi Q5',
    service: 'Tyre Replacement',
    before: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',
    date: 'Mar 2026',
  },
  {
    id: '4',
    vehicle: 'Tesla Model 3',
    service: 'Premium Water Wash',
    before: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1619767886554-ef9f320cd315?w=600&q=80',
    date: 'Feb 2026',
  },
]
