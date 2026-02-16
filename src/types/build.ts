// Component Categories
export type ComponentCategory =
  | 'frame'
  | 'fork'
  | 'brakes'
  | 'seat_post'
  | 'seat_post_clamp'
  | 'rear_disc'
  | 'sprocket'
  | 'rear_cog'
  | 'rear_tire'
  | 'front_tire'
  | 'chain'
  | 'headset'
  | 'cranks'
  | 'spider'
  | 'bottom_bracket'
  | 'stem'
  | 'bars'
  | 'grips'
  | 'pedals'
  | 'seat'
  | 'wheelset'
  | 'front_hub'
  | 'front_wheel'
  | 'rear_hub'
  | 'rear_wheel'
  | 'spokes'
  | 'nipples'
  | 'tubes'
  | 'other'

export const COMPONENT_CATEGORY_LABELS: Record<ComponentCategory, string> = {
  frame: 'Frame',
  fork: 'Fork',
  brakes: 'Brakes',
  seat_post: 'Seat Post',
  seat_post_clamp: 'Seat Post Clamp',
  rear_disc: 'Rear Disc',
  sprocket: 'Sprocket',
  rear_cog: 'Rear Cog',
  rear_tire: 'Rear Tire',
  front_tire: 'Front Tire',
  chain: 'Chain',
  headset: 'Headset',
  cranks: 'Cranks',
  spider: 'Spider',
  bottom_bracket: 'Bottom Bracket',
  stem: 'Stem',
  bars: 'Handlebars',
  grips: 'Grips',
  pedals: 'Pedals',
  seat: 'Seat',
  wheelset: 'Wheelset',
  front_hub: 'Front Hub',
  front_wheel: 'Front Wheel',
  rear_hub: 'Rear Hub',
  rear_wheel: 'Rear Wheel',
  spokes: 'Spokes',
  nipples: 'Nipples',
  tubes: 'Tubes',
  other: 'Other',
}

// Shop Link
export interface ShopLink {
  store: string
  url: string
  price: number
  lastChecked?: Date
  available?: boolean
}

// Part (stored in Parts Cabinet)
export interface Part {
  id: string
  userId: string
  category: ComponentCategory
  brand: string
  model: string
  name?: string // Optional nickname
  color?: string
  price: number
  imageUrl?: string
  description?: string
  links: ShopLink[]
  inCabinet: boolean // Always true for parts in cabinet
  createdAt: Date
  updatedAt: Date
}

// Build (configured bike in The Garage)
export interface Build {
  id: string
  userId: string
  name: string
  selectedParts: Partial<Record<ComponentCategory, string>> // Maps category to partId
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}
