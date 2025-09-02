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

export interface VetVisit {
  visit_type: string
  date: string
  time?: string
  vet_name?: string
  vet_address?: string
  vet_phone?: string
  notes?: string
  reminder_days_before?: number
}

export interface Dog {
  id: string
  property_id: string
  name: string
  age?: string
  birthdate?: string
  photo_url?: string
  personality?: string
  feeding_schedule: any // JSONB
  feeding_location?: string
  feeding_notes?: string
  medicine_schedule: any // JSONB
  potty_trained?: string
  potty_notes?: string
  walk_schedule: any // JSONB
  sleeping_location?: string
  sleeping_notes?: string
  special_instructions: any // JSONB
  vet_visits: VetVisit[] // JSONB array
  medicine_image_url?: string // Image for medicine instructions
  created_at: string
  updated_at: string
}

export interface ServicePerson {
  id: string
  property_id: string
  name: string
  service_day?: string // Legacy field, kept for backward compatibility
  service_time?: string // Legacy field, kept for backward compatibility
  service_date?: string // New field for specific date scheduling
  service_start_time?: string // New field for start time
  service_end_time?: string // New field for end time
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
  schedule_frequency?: 'none' | 'one_time' | 'daily' | 'weekly'
  schedule_day?: string
  schedule_date?: string // For one-time events
  schedule_time?: string
  schedule_time_type?: 'specific' | 'general'
  schedule_duration?: number // Duration in hours
  remind_day_before?: boolean
  person_name?: string // Person responsible for the service
  person_phone?: string // Phone number of the person
  schedule_notes?: string // Additional notes for scheduled services
  video_url?: string
  // Delivery-specific fields
  delivery_window?: 'morning' | 'afternoon' | 'evening' | 'anytime'
  delivery_company?: string
  tracking_number?: string
  // Image support
  image_url?: string
  created_at: string
  updated_at: string
}

export interface DailyTask {
  id: string
  property_id: string
  title: string
  time?: string
  category: 'pets' | 'house' | 'general'
  notes?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Stay {
  id: string
  property_id: string
  sitter_name: string
  start_date: string
  end_date: string
  start_time?: string
  end_time?: string
  notes?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  property_id: string
  category: 'owners' | 'regular_vet' | 'emergency_vet' | 'other'
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  display_order: number
  active: boolean
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

// Master Schedule Item - consolidates all schedulable items
export interface ScheduleItem {
  id: string
  type: 'feeding' | 'medicine' | 'appointment' | 'service' | 'walk' | 'task' | 'house'
  title: string
  time: string
  date?: string
  dog_id?: string
  dog_name?: string
  location?: string
  notes?: string
  video_url?: string
  recurring?: boolean
  source: 'dog' | 'appointment' | 'service' | 'task' | 'house'
}

// All data now comes from Supabase database - no local mock data interfaces needed
