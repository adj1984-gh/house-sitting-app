import { supabase, supabaseAdmin } from './supabase'
import { Property, Alert, Dog, ServicePerson, Appointment, HouseInstruction, AccessLog } from './types'

// Property operations
export const getProperty = async (id: string = '00000000-0000-0000-0000-000000000001'): Promise<Property | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching property:', error)
    return null
  }
  
  return data
}

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('properties')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating property:', error)
    return null
  }
  
  return data
}

// Alert operations
export const getAlerts = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<Alert[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('property_id', propertyId)
    .eq('active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching alerts:', error)
    return []
  }
  
  return data || []
}

export const createAlert = async (alert: Omit<Alert, 'id' | 'created_at'>): Promise<Alert | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating alert:', error)
    return null
  }
  
  return data
}

export const updateAlert = async (id: string, updates: Partial<Alert>): Promise<Alert | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating alert:', error)
    return null
  }
  
  return data
}

export const deleteAlert = async (id: string): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning false')
    return false
  }

  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting alert:', error)
    return false
  }
  
  return true
}

// Dog operations
export const getDogs = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<Dog[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('property_id', propertyId)
    .order('name')
  
  if (error) {
    console.error('Error fetching dogs:', error)
    return []
  }
  
  return data || []
}

export const getDog = async (id: string): Promise<Dog | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching dog:', error)
    return null
  }
  
  return data
}

export const createDog = async (dog: Omit<Dog, 'id' | 'created_at' | 'updated_at'>): Promise<Dog | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('dogs')
    .insert(dog)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating dog:', error)
    return null
  }
  
  return data
}

export const updateDog = async (id: string, updates: Partial<Dog>): Promise<Dog | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('dogs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating dog:', error)
    return null
  }
  
  return data
}

export const deleteDog = async (id: string): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning false')
    return false
  }

  const { error } = await supabase
    .from('dogs')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting dog:', error)
    return false
  }
  
  return true
}

// Service People operations
export const getServicePeople = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<ServicePerson[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('service_people')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching service people:', error)
    return []
  }
  
  return data || []
}

export const createServicePerson = async (servicePerson: Omit<ServicePerson, 'id' | 'created_at'>): Promise<ServicePerson | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('service_people')
    .insert(servicePerson)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating service person:', error)
    return null
  }
  
  return data
}

export const updateServicePerson = async (id: string, updates: Partial<ServicePerson>): Promise<ServicePerson | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('service_people')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating service person:', error)
    return null
  }
  
  return data
}

export const deleteServicePerson = async (id: string): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning false')
    return false
  }

  const { error } = await supabase
    .from('service_people')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting service person:', error)
    return false
  }
  
  return true
}

// Appointment operations
export const getAppointments = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<Appointment[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('property_id', propertyId)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
  
  if (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
  
  return data || []
}

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>): Promise<Appointment | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating appointment:', error)
    return null
  }
  
  return data
}

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating appointment:', error)
    return null
  }
  
  return data
}

export const deleteAppointment = async (id: string): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning false')
    return false
  }

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting appointment:', error)
    return false
  }
  
  return true
}

// House Instructions operations
export const getHouseInstructions = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<HouseInstruction[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('house_instructions')
    .select('*')
    .eq('property_id', propertyId)
    .order('category', { ascending: true })
  
  if (error) {
    console.error('Error fetching house instructions:', error)
    return []
  }
  
  return data || []
}

export const createHouseInstruction = async (instruction: Omit<HouseInstruction, 'id' | 'created_at' | 'updated_at'>): Promise<HouseInstruction | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('house_instructions')
    .insert(instruction)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating house instruction:', error)
    return null
  }
  
  return data
}

export const updateHouseInstruction = async (id: string, updates: Partial<HouseInstruction>): Promise<HouseInstruction | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('house_instructions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating house instruction:', error)
    return null
  }
  
  return data
}

export const deleteHouseInstruction = async (id: string): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning false')
    return false
  }

  const { error } = await supabase
    .from('house_instructions')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting house instruction:', error)
    return false
  }
  
  return true
}

// Access Log operations
export const logAccess = async (accessLog: Omit<AccessLog, 'id' | 'accessed_at'>): Promise<AccessLog | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, cannot log access')
    return null
  }

  const { data, error } = await supabase
    .from('access_logs')
    .insert(accessLog)
    .select()
    .single()
  
  if (error) {
    console.error('Error logging access:', error)
    return null
  }
  
  return data
}

export const getAccessLogs = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<AccessLog[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('access_logs')
    .select('*')
    .eq('property_id', propertyId)
    .order('accessed_at', { ascending: false })
    .limit(50)
  
  if (error) {
    console.error('Error fetching access logs:', error)
    return []
  }
  
  return data || []
}
