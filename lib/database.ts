import { supabase, supabaseAdmin } from './supabase'
import { Property, Alert, Dog, ServicePerson, Appointment, HouseInstruction, DailyTask, Stay, Contact, AccessLog, ScheduleItem } from './types'
import { parseTime, calculateEndTime, formatDuration } from './utils'

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

  console.log('Creating house instruction with data:', instruction);
  const { data, error } = await supabase!
    .from('house_instructions')
    .insert(instruction)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating house instruction:', error)
    console.error('Error details:', error.message, error.code, error.details)
    return null
  }
  
  console.log('Successfully created house instruction:', data);
  return data
}

export const updateHouseInstruction = async (id: string, updates: Partial<HouseInstruction>): Promise<HouseInstruction | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  console.log('Updating house instruction with id:', id, 'updates:', updates);
  const { data, error } = await supabase!
    .from('house_instructions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating house instruction:', error)
    console.error('Error details:', error.message, error.code, error.details)
    return null
  }
  
  console.log('Successfully updated house instruction:', data);
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

// Daily Tasks operations
export const getDailyTasks = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<DailyTask[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('property_id', propertyId)
    .eq('active', true)
    .order('time', { ascending: true })
  
  if (error) {
    console.error('Error fetching daily tasks:', error)
    return []
  }
  
  return data || []
}

export const createDailyTask = async (task: Omit<DailyTask, 'id' | 'created_at' | 'updated_at'>): Promise<DailyTask | null> => {
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('daily_tasks')
    .insert([task])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating daily task:', error)
    return null
  }
  
  return data
}

export const updateDailyTask = async (id: string, updates: Partial<DailyTask>): Promise<DailyTask | null> => {
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('daily_tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating daily task:', error)
    return null
  }
  
  return data
}

export const deleteDailyTask = async (id: string): Promise<boolean> => {
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return false
  }

  const { error } = await supabaseAdmin
    .from('daily_tasks')
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting daily task:', error)
    return false
  }
  
  return true
}

// Stays operations
export const getStays = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<Stay[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('stays')
    .select('*')
    .eq('property_id', propertyId)
    .eq('active', true)
    .order('start_date', { ascending: true })
  
  if (error) {
    console.error('Error fetching stays:', error)
    return []
  }
  
  return data || []
}

// Check if there's an active stay covering the current date
export const hasActiveStay = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning false')
    return false
  }

  const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

  const { data, error } = await supabase
    .from('stays')
    .select('id')
    .eq('property_id', propertyId)
    .eq('active', true)
    .lte('start_date', today)
    .gte('end_date', today)
    .limit(1)
  
  if (error) {
    console.error('Error checking active stay:', error)
    return false
  }
  
  return (data && data.length > 0) || false
}

// Get a specific stay by ID
export const getStay = async (stayId: string): Promise<Stay | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const { data, error } = await supabase
    .from('stays')
    .select('*')
    .eq('id', stayId)
    .single()

  if (error) {
    console.error('Error fetching stay:', error)
    return null
  }

  return data
}

// Get the current active stay covering today's date
export const getCurrentActiveStay = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<Stay | null> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

  const { data, error } = await supabase
    .from('stays')
    .select('*')
    .eq('property_id', propertyId)
    .eq('active', true)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('start_date', { ascending: true })
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error getting current active stay:', error)
    return null
  }
  
  return data || null
}

export const createStay = async (stay: Omit<Stay, 'id' | 'created_at' | 'updated_at'>): Promise<Stay | null> => {
  console.log('createStay called with:', stay)
  
  try {
    const response = await fetch('/api/stays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stay),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      return null
    }
    
    const data = await response.json()
    console.log('Stay created successfully:', data)
    return data
  } catch (error) {
    console.error('Error creating stay:', error)
    return null
  }
}

export const updateStay = async (id: string, updates: Partial<Stay>): Promise<Stay | null> => {
  try {
    const response = await fetch('/api/stays', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating stay:', error)
    return null
  }
}

export const deleteStay = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/stays', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, active: false }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting stay:', error)
    return false
  }
}

// Master Schedule Generation
export const generateMasterSchedule = (
  dogs: Dog[],
  appointments: Appointment[],
  servicePeople: ServicePerson[],
  dailyTasks: DailyTask[],
  stays: Stay[] = [],
  houseInstructions: HouseInstruction[] = [],
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
        // Check if medication has expired - handle both old and new formats
        let isExpired = false;
        
        if (medicine.calculated_end_date) {
          // New smart format
          const endDate = new Date(medicine.calculated_end_date);
          const todayDate = new Date(today);
          todayDate.setHours(0, 0, 0, 0);
          isExpired = todayDate > endDate;
        } else if (medicine.end_date) {
          // Old format
          const endDate = new Date(medicine.end_date);
          const todayDate = new Date(today);
          todayDate.setHours(0, 0, 0, 0);
          
          if (medicine.end_time) {
            const endDateTime = new Date(medicine.end_date + 'T' + medicine.end_time);
            isExpired = new Date() > endDateTime;
          } else {
            isExpired = todayDate > endDate;
          }
        }
        
        // Only add to schedule if not expired
        if (!isExpired) {
          if (medicine.dose_times && Array.isArray(medicine.dose_times)) {
            // New smart format - add each dose time as separate schedule item
            medicine.dose_times.forEach((dose: any, doseIndex: number) => {
              if (dose.time) {
                scheduleItems.push({
                  id: `medicine-${dog.id}-${index}-${doseIndex}`,
                  type: 'medicine',
                  title: `Medicine for ${dog.name}`,
                  time: dose.time,
                  date: today,
                  dog_id: dog.id,
                  dog_name: dog.name,
                  notes: `${medicine.medication} (${dose.dose_amount})`,
                  recurring: true,
                  source: 'dog'
                })
              }
            })
          } else {
            // Old format
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
          }
        }
      })
    }
  })
  
  // Add walk schedules from dogs
  dogs.forEach(dog => {
    if (dog.walk_schedule && Array.isArray(dog.walk_schedule)) {
      dog.walk_schedule.forEach((walk: any, index: number) => {
        if (walk.time) {
          scheduleItems.push({
            id: `walk-${dog.id}-${index}`,
            type: 'walk',
            title: `Walk ${dog.name}`,
            time: walk.time,
            date: today,
            dog_id: dog.id,
            dog_name: dog.name,
            notes: walk.duration ? `${walk.duration}${walk.notes ? ` - ${walk.notes}` : ''}` : walk.notes,
            recurring: true,
            source: 'dog'
          })
        }
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
  
  // Check if there's an active stay for the target date
  const hasActiveStayForDate = stays.some(stay => {
    const startDate = stay.start_date.split('T')[0];
    const endDate = stay.end_date.split('T')[0];
    return today >= startDate && today <= endDate;
  });

  // Add service people - only if there's an active stay and they fall on the target date
  if (hasActiveStayForDate) {
    servicePeople.forEach(service => {
      let shouldInclude = false;
      let serviceTime = 'TBD';
      let serviceDate = today;
      
      // Check new date-based scheduling first
      if (service.service_date) {
        const serviceDateStr = service.service_date.split('T')[0];
        if (serviceDateStr === today) {
          shouldInclude = true;
          serviceDate = serviceDateStr;
          if (service.service_start_time) {
            serviceTime = service.service_start_time;
            if (service.service_end_time) {
              serviceTime += ` - ${service.service_end_time}`;
            }
          }
        }
      }
      // Fall back to legacy day-based scheduling
      else if (service.service_day && service.service_day.includes(new Date(today).toLocaleDateString('en-US', { weekday: 'long' }))) {
        shouldInclude = true;
        serviceTime = service.service_time || 'TBD';
      }
      
      if (shouldInclude) {
        scheduleItems.push({
          id: `service-${service.id}`,
          type: 'service',
          title: service.name,
          time: serviceTime,
          date: serviceDate,
          location: 'Property',
          notes: service.notes,
          recurring: false, // Service people are now specific date events, not recurring
          source: 'service'
        })
      }
    })
  }
  
  // Add timed daily tasks from database (untimed tasks will be handled separately)
  dailyTasks.forEach(task => {
    if (task.time) {
      scheduleItems.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        time: task.time,
        date: today,
        notes: task.notes,
        recurring: true,
        source: 'task'
      })
    }
  })
  
  // Add scheduled house instructions
  houseInstructions.forEach(instruction => {
    if (instruction.needs_scheduling && instruction.schedule_frequency && instruction.schedule_day) {
      const todayDate = new Date(today);
      const dayOfWeek = todayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDayName = dayNames[dayOfWeek];
      
      let shouldShowToday = false;
      let shouldShowReminder = false;
      
      // Check if this instruction should appear today
      if (instruction.schedule_frequency === 'daily') {
        shouldShowToday = true;
        shouldShowReminder = instruction.remind_day_before || false;
      } else if (instruction.schedule_frequency === 'weekly' && instruction.schedule_day === currentDayName) {
        shouldShowToday = true;
        shouldShowReminder = instruction.remind_day_before || false;
      } else if (instruction.schedule_frequency === 'monthly') {
        const dayOfMonth = todayDate.getDate();
        if (instruction.schedule_day === '1st' && dayOfMonth === 1) {
          shouldShowToday = true;
          shouldShowReminder = instruction.remind_day_before || false;
        } else if (instruction.schedule_day === '15th' && dayOfMonth === 15) {
          shouldShowToday = true;
          shouldShowReminder = instruction.remind_day_before || false;
        }
      }
      
      // Check for reminder (day before)
      if (instruction.remind_day_before && !shouldShowToday) {
        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrowDayOfWeek = tomorrowDate.getDay();
        const tomorrowDayName = dayNames[tomorrowDayOfWeek];
        
        if (instruction.schedule_frequency === 'daily') {
          shouldShowReminder = true;
        } else if (instruction.schedule_frequency === 'weekly' && instruction.schedule_day === tomorrowDayName) {
          shouldShowReminder = true;
        } else if (instruction.schedule_frequency === 'monthly') {
          const tomorrowDayOfMonth = tomorrowDate.getDate();
          if ((instruction.schedule_day === '1st' && tomorrowDayOfMonth === 1) ||
              (instruction.schedule_day === '15th' && tomorrowDayOfMonth === 15)) {
            shouldShowReminder = true;
          }
        }
      }
      
      // Add to schedule if it should show today or as a reminder
      if (shouldShowToday || shouldShowReminder) {
        const subcategoryLabel = instruction.subcategory ? 
          instruction.subcategory.split(/(?=[A-Z])/).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : 
          'Service';
        
        // Calculate time display with duration if available
        let timeDisplay = shouldShowReminder ? '' : (instruction.schedule_time || 'TBD');
        if (!shouldShowReminder && instruction.schedule_time && instruction.schedule_duration) {
          const endTime = calculateEndTime(instruction.schedule_time, instruction.schedule_duration);
          if (endTime) {
            const startTimeFormatted = formatTimeForDisplay(instruction.schedule_time);
            const endTimeFormatted = formatTimeForDisplay(endTime);
            timeDisplay = `${startTimeFormatted} - ${endTimeFormatted}`;
          }
        } else if (!shouldShowReminder && instruction.schedule_time) {
          // Format single time for display
          timeDisplay = formatTimeForDisplay(instruction.schedule_time);
        }
        
        // Add duration info to notes if available
        let notes = shouldShowReminder ? 
          `Reminder: ${instruction.instructions?.text || 'Service scheduled for tomorrow'}` :
          (instruction.instructions?.text || '');
        
        if (!shouldShowReminder && instruction.schedule_duration) {
          const durationText = formatDuration(instruction.schedule_duration);
          notes = notes ? `${notes} (${durationText})` : `Expected duration: ${durationText}`;
        }
        
        // For reminders, also add time range info if available
        if (shouldShowReminder && instruction.schedule_time && instruction.schedule_duration) {
          const endTime = calculateEndTime(instruction.schedule_time, instruction.schedule_duration);
          if (endTime) {
            const startTimeFormatted = formatTimeForDisplay(instruction.schedule_time);
            const endTimeFormatted = formatTimeForDisplay(endTime);
            notes = `Reminder: ${instruction.instructions?.text || 'Service scheduled for tomorrow'} (${startTimeFormatted} - ${endTimeFormatted})`;
          }
        }
        
        scheduleItems.push({
          id: `house-${instruction.id}${shouldShowReminder ? '-reminder' : ''}`,
          type: 'house',
          title: shouldShowReminder ? `🔔 Reminder: ${subcategoryLabel}` : subcategoryLabel,
          time: timeDisplay,
          date: today,
          notes: notes,
          recurring: true,
          source: 'house'
        })
      }
    }
  })
  
  // Sort by time using normalized time format
  return scheduleItems.sort((a, b) => {
    const timeA = a.time === 'TBD' || !a.time ? '23:59' : a.time
    const timeB = b.time === 'TBD' || !b.time ? '23:59' : b.time
    
    // Use parseTime for proper chronological sorting
    const minutesA = parseTime(timeA) ?? 1439; // 23:59 in minutes
    const minutesB = parseTime(timeB) ?? 1439;
    
    return minutesA - minutesB;
  })
}

// Contact operations
export const getContacts = async (propertyId: string = '00000000-0000-0000-0000-000000000001'): Promise<Contact[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('property_id', propertyId)
    .eq('active', true)
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
  
  return data || []
}

export const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact | null> => {
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('contacts')
    .insert([contact])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating contact:', error)
    return null
  }
  
  return data
}

export const updateContact = async (id: string, updates: Partial<Contact>): Promise<Contact | null> => {
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('contacts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating contact:', error)
    return null
  }
  
  return data
}

export const deleteContact = async (id: string): Promise<boolean> => {
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return false
  }

  const { error } = await supabaseAdmin
    .from('contacts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting contact:', error)
    return false
  }
  
  return true
}
