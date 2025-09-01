import { supabase, supabaseAdmin } from './supabase'
import { Property, Alert, Dog, ServicePerson, Appointment, HouseInstruction, AccessLog, ScheduleItem } from './types'

// Property operations
export const getProperty = async (id: string = '00000000-0000-0000-0000-000000000001'): Promise<Property | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase!!
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

  const { data, error } = await supabase!!
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

  const { data, error } = await supabase!!
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

  const { data, error } = await supabase!!
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

  const { data, error } = await supabase!
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

  const { error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { error } = await supabase!
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

  const { data, error } = await supabase!
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

  const { data, error } = await supabase!
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

// Master Schedule Generation
export const generateMasterSchedule = (
  dogs: Dog[],
  appointments: Appointment[],
  servicePeople: ServicePerson[],
  targetDate?: string
): ScheduleItem[] => {
  const scheduleItems: ScheduleItem[] = []
  const today = targetDate || new Date().toISOString().split('T')[0]
  
  // Add feeding schedules from dogs
  dogs.forEach(dog => {
    if (dog.feeding_schedule && Array.isArray(dog.feeding_schedule)) {
      dog.feeding_schedule.forEach((feeding: any, index: number) => {
        scheduleItems.push({
          id: `feeding-${dog.id}-${index}`,
          type: 'feeding',
          title: `Feed ${dog.name}`,
          time: feeding.time,
          date: today,
          dog_id: dog.id,
          dog_name: dog.name,
          notes: feeding.amount,
          recurring: true,
          source: 'dog'
        })
      })
    }
  })
  
  // Add medicine schedules from dogs
  dogs.forEach(dog => {
    if (dog.medicine_schedule && Array.isArray(dog.medicine_schedule)) {
      dog.medicine_schedule.forEach((medicine: any, index: number) => {
        scheduleItems.push({
          id: `medicine-${dog.id}-${index}`,
          type: 'medicine',
          title: `Medicine for ${dog.name}`,
          time: medicine.time,
          date: today,
          dog_id: dog.id,
          dog_name: dog.name,
          notes: medicine.medication,
          recurring: true,
          source: 'dog'
        })
      })
    }
  })
  
  // Add walk schedules from dogs
  dogs.forEach(dog => {
    if (dog.walk_frequency && dog.walk_frequency !== 'Optional walks only') {
      scheduleItems.push({
        id: `walk-${dog.id}`,
        type: 'walk',
        title: `Walk ${dog.name}`,
        time: 'Afternoon',
        date: today,
        dog_id: dog.id,
        dog_name: dog.name,
        notes: dog.walk_notes,
        recurring: true,
        source: 'dog'
      })
    }
  })
  
  // Add appointments
  appointments.forEach(appointment => {
    const appointmentDate = appointment.date.split('T')[0]
    if (appointmentDate === today) {
      const dog = dogs.find(d => d.id === appointment.for_dog_id)
      scheduleItems.push({
        id: `appointment-${appointment.id}`,
        type: 'appointment',
        title: appointment.type,
        time: appointment.time || 'TBD',
        date: appointmentDate,
        dog_id: appointment.for_dog_id,
        dog_name: dog?.name,
        location: appointment.location,
        notes: appointment.notes,
        recurring: false,
        source: 'appointment'
      })
    }
  })
  
  // Add service people
  servicePeople.forEach(service => {
    if (service.service_day && service.service_day.includes(new Date(today).toLocaleDateString('en-US', { weekday: 'long' }))) {
      scheduleItems.push({
        id: `service-${service.id}`,
        type: 'service',
        title: service.name,
        time: service.service_time || 'TBD',
        date: today,
        location: 'Property',
        notes: service.notes,
        recurring: true,
        source: 'service'
      })
    }
  })
  
  // Add daily tasks
  const dailyTasks = [
    { time: '7:00 AM', task: 'Morning feeding & medicine' },
    { time: '6:00 PM', task: 'Evening feeding & medicine' },
    { time: 'Once daily', task: 'Barolo head wipe' },
    { time: 'Daily', task: 'Walk Barolo' },
    { time: 'As needed', task: 'Refill water bowls' },
    { time: 'Throughout day', task: 'Multiple potty breaks' },
    { time: 'Before bed', task: 'Check patio door is locked' }
  ]
  
  dailyTasks.forEach((task, index) => {
    scheduleItems.push({
      id: `task-${index}`,
      type: 'task',
      title: task.task,
      time: task.time,
      date: today,
      recurring: true,
      source: 'task'
    })
  })
  
  // Sort by time
  return scheduleItems.sort((a, b) => {
    const timeA = a.time === 'TBD' ? '23:59' : a.time
    const timeB = b.time === 'TBD' ? '23:59' : b.time
    return timeA.localeCompare(timeB)
  })
}
