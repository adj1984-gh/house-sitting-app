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
  birthdate?: string
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

export interface DailyTask {
  id: string
  property_id: string
  title: string
  time: string
  category: 'pets' | 'house' | 'general'
  notes?: string
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
  type: 'feeding' | 'medicine' | 'appointment' | 'service' | 'walk' | 'task'
  title: string
  time: string
  date?: string
  dog_id?: string
  dog_name?: string
  location?: string
  notes?: string
  recurring?: boolean
  source: 'dog' | 'appointment' | 'service' | 'task'
}

// All data now comes from Supabase database - no local mock data interfaces needed
