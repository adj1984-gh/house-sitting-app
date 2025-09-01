export interface Property {
  id: string
  name: string
  address: string
  wifi_ssid?: string
  wifi_password?: string
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  property_id: string
  type: 'danger' | 'warning' | 'info'
  category: 'pets' | 'house' | 'general'
  text: string
  active: boolean
  created_at: string
}

export interface Dog {
  id: string
  property_id: string
  name: string
  age?: string
  photo_url?: string
  personality?: string
  feeding_schedule: any // JSONB
  feeding_location?: string
  feeding_notes?: string
  medicine_schedule: any // JSONB
  medicine_notes?: string
  potty_trained?: string
  potty_notes?: string
  walk_frequency?: string
  walk_notes?: string
  sleeping_location?: string
  sleeping_notes?: string
  special_instructions: any // JSONB
  created_at: string
  updated_at: string
}

export interface ServicePerson {
  id: string
  property_id: string
  name: string
  service_day?: string
  service_time?: string
  payment_amount?: string
  payment_status?: string
  notes?: string
  needs_access: boolean
  phone?: string
  created_at: string
}

export interface Appointment {
  id: string
  property_id: string
  date: string
  time?: string
  type: string
  for_dog_id?: string
  location?: string
  notes?: string
  created_at: string
}

export interface HouseInstruction {
  id: string
  property_id: string
  category: string
  subcategory?: string
  instructions: any // JSONB
  created_at: string
  updated_at: string
}

export interface AccessLog {
  id: string
  property_id: string
  accessed_at: string
  access_type: 'password' | 'qr_code'
  ip_address?: string
}

// Local data structure for the current mock data
export interface LocalData {
  property: {
    address: string
    wifi: {
      ssid: string
      password: string
    }
  }
  alerts: Array<{
    id: number
    type: 'danger' | 'warning' | 'info'
    category: 'pets' | 'house' | 'general'
    text: string
  }>
  contacts: {
    owners: Array<{ name: string; phone: string }>
    regularVet: {
      name: string
      address: string
      phone: string
    }
    emergencyVet: {
      name: string
      address: string
      phone: string
    }
    services: Array<{ name: string; phone: string; notes: string }>
  }
  dogs: Array<{
    id: number
    name: string
    age: string
    photo: string
    personality: string
    feeding: {
      schedule: Array<{ time: string; amount: string }>
      notes: string
      location: string
    }
    medicine: {
      schedule: Array<{ time: string; medication: string }>
      notes: string
    }
    potty: {
      trained: string
      notes: string
    }
    walks: {
      frequency: string
      notes: string
    }
    sleeping: {
      location: string
      notes: string
    }
    special: {
      whenLeaving: string
      management: string
    }
  }>
  houseInstructions: {
    access: {
      mudRoom: string
      patioDoor: string
    }
    entertainment: {
      tv: string
      sonos: string
    }
    utilities: {
      lights: string
      thermostat: string
      septic: string
      bathroom: string
    }
    amenities: {
      hotTub: string
      trash: string
    }
  }
  appointments: Array<{
    id: number
    date: string
    time: string
    type: string
    who: string
    location: string
    notes: string
  }>
  servicePeople: Array<{
    id: number
    name: string
    day: string
    time: string
    payment: string
    notes: string
    needsAccess: boolean
  }>
  dailyTasks: Array<{
    id: number
    category: 'pets' | 'house'
    task: string
    time: string
  }>
}
