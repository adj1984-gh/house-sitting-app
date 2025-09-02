'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AlertCircle, Phone, Dog, Pill, Home, Calendar, Droplets, Cookie, MapPin, Heart, Edit, Save, Plus, Trash2, Clock, CheckSquare, Wifi, Tv, Volume2, Thermometer, Bath, Key, Trash, Users, DollarSign, Settings, ChevronRight, Shield, Lock, QrCode, X, Info, Moon } from 'lucide-react';
import YouTubeVideo from './YouTubeVideo';
import { getProperty, getAlerts, getDogs, getAppointments, getHouseInstructions, getDailyTasks, getStays, hasActiveStay, getCurrentActiveStay, getContacts, logAccess, createDog, updateDog, deleteDog, createAlert, updateAlert, deleteAlert, createAppointment, updateAppointment, deleteAppointment, createHouseInstruction, updateHouseInstruction, deleteHouseInstruction, createDailyTask, updateDailyTask, deleteDailyTask, createStay, updateStay, deleteStay, createContact, updateContact, deleteContact, generateMasterSchedule } from '../lib/database';
import { normalizeTime, formatTimeForDisplay } from '../lib/utils';
import { Property, Alert, Dog as DogType, Appointment, HouseInstruction, DailyTask, Stay, Contact, ScheduleItem } from '../lib/types';

// All data comes from Supabase database - no mock data

// Helper function to calculate age from birthdate
const calculateAge = (birthdate: string): string => {
  if (!birthdate) return '';
  
  const birthDate = new Date(birthdate);
  const today = new Date();
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  if (ageInYears > 0) {
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return `${ageInYears - 1} year${ageInYears - 1 !== 1 ? 's' : ''}`;
    } else {
      return `${ageInYears} year${ageInYears !== 1 ? 's' : ''}`;
    }
  } else {
    const ageInMonths = Math.max(0, today.getMonth() - birthDate.getMonth() + (today.getFullYear() - birthDate.getFullYear()) * 12);
    if (ageInMonths > 0) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    } else {
      return 'Less than 1 month';
    }
  }
};

// Helper function to format phone number for tel: links
const formatPhoneForTel = (phone: string): string => {
  if (!phone) return '';
  // Remove all non-digit characters and add +1 if it's a 10-digit US number
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  return phone;
};

// Dog Edit Form Component - moved outside main component to prevent re-creation on re-renders
const DogEditForm = React.memo(({ formData }: { formData: any }) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(formData.photo_url || '');
  const [feedingSchedule, setFeedingSchedule] = useState<Array<{time: string, amount: string, notes: string}>>(
    Array.isArray(formData.feeding_schedule) 
      ? formData.feeding_schedule.map((item: any) => ({
          time: item.time || '',
          amount: item.amount || '',
          notes: item.notes || ''
        }))
      : []
  );
  const [medicineSchedule, setMedicineSchedule] = useState<Array<{
    medication: string, 
    notes: string, 
    frequency_per_day: number, 
    remaining_doses: number, 
    dose_times: Array<{time: string, dose_amount: string}>,
    start_date: string,
    calculated_end_date: string,
    video_url: string,
    video_thumbnail: string
  }>>(() => {
    if (Array.isArray(formData.medicine_schedule)) {
      return formData.medicine_schedule.map((item: any) => {
        // Handle both old and new formats
        const isNewFormat = item.frequency_per_day !== undefined;
        
        if (isNewFormat) {
          // New smart format - ensure dose_times have proper numbering
          const doseTimes = item.dose_times || [{ time: '', dose_amount: 'Dose 1' }];
          const numberedDoseTimes = doseTimes.map((dose: any, index: number) => ({
            time: dose.time || '',
            dose_amount: dose.dose_amount || `Dose ${index + 1}`
          }));
          
          return {
            medication: item.medication || '',
            notes: item.notes || '',
            frequency_per_day: item.frequency_per_day || 1,
            remaining_doses: item.remaining_doses || 30,
            dose_times: numberedDoseTimes,
            start_date: item.start_date || new Date().toISOString().split('T')[0],
            calculated_end_date: item.calculated_end_date || '',
            video_url: item.video_url || '',
            video_thumbnail: item.video_thumbnail || ''
          };
        } else {
          // Old format - convert to new format
          return {
            medication: item.medication || '',
            notes: item.notes || '',
            frequency_per_day: 1,
            remaining_doses: 30,
            dose_times: [{ time: item.time || '', dose_amount: 'Dose 1' }],
            start_date: new Date().toISOString().split('T')[0],
            calculated_end_date: '',
            video_url: item.video_url || '',
            video_thumbnail: item.video_thumbnail || ''
          };
        }
      });
    }
    return [];
  });


  const [specialInstructions, setSpecialInstructions] = useState<Array<{type: string, instruction: string}>>(
    formData.special_instructions && typeof formData.special_instructions === 'object' 
      ? Object.entries(formData.special_instructions).map(([type, instruction]) => ({ type, instruction: instruction as string }))
      : []
  );
  const [walkSchedule, setWalkSchedule] = useState<Array<{time: string, duration: string, notes: string}>>(
    Array.isArray(formData.walk_schedule) ? formData.walk_schedule : []
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeedingTime = () => {
    setFeedingSchedule([...feedingSchedule, { time: '', amount: '', notes: '' }]);
  };

  const removeFeedingTime = (index: number) => {
    setFeedingSchedule(feedingSchedule.filter((_, i) => i !== index));
  };

  const updateFeedingTime = (index: number, field: 'time' | 'amount' | 'notes', value: string) => {
    setFeedingSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Helper function to calculate end date based on remaining doses and frequency
  const calculateEndDate = useCallback((remainingDoses: number, frequencyPerDay: number, startDate: string): string => {
    if (remainingDoses <= 0 || frequencyPerDay <= 0) return '';
    
    const daysNeeded = Math.ceil(remainingDoses / frequencyPerDay);
    const start = new Date(startDate);
    const endDate = new Date(start);
    endDate.setDate(start.getDate() + daysNeeded - 1);
    
    return endDate.toISOString().split('T')[0];
  }, []);

  const addMedicine = useCallback(() => {
    const newMedicine = {
      medication: '',
      notes: '',
      frequency_per_day: 1,
      remaining_doses: 30,
      dose_times: [{ time: '', dose_amount: 'Dose 1' }],
      start_date: new Date().toISOString().split('T')[0],
      calculated_end_date: '',
      video_url: '',
      video_thumbnail: ''
    };
    newMedicine.calculated_end_date = calculateEndDate(newMedicine.remaining_doses, newMedicine.frequency_per_day, newMedicine.start_date);
    setMedicineSchedule(prev => [...prev, newMedicine]);
  }, [calculateEndDate]);

  const removeMedicine = useCallback((index: number) => {
    setMedicineSchedule(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateMedicine = useCallback((index: number, field: string, value: any) => {
    setMedicineSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto-generate dose times when frequency changes
      if (field === 'frequency_per_day') {
        const newFrequency = parseInt(value);
        const currentDoseTimes = updated[index].dose_times;
        
        if (newFrequency > currentDoseTimes.length) {
          // Add new dose times
          for (let i = currentDoseTimes.length; i < newFrequency; i++) {
            updated[index].dose_times.push({ 
              time: '', 
              dose_amount: `Dose ${i + 1}` 
            });
          }
        } else if (newFrequency < currentDoseTimes.length) {
          // Remove excess dose times
          updated[index].dose_times = currentDoseTimes.slice(0, newFrequency);
        }
      }
      
      // Auto-calculate end date when frequency or remaining doses change
      if (field === 'frequency_per_day' || field === 'remaining_doses' || field === 'start_date') {
        const medicine = updated[index];
        updated[index].calculated_end_date = calculateEndDate(
          medicine.remaining_doses, 
          medicine.frequency_per_day, 
          medicine.start_date
        );
      }
      
      return updated;
    });
  }, [calculateEndDate]);

  const updateDoseTime = useCallback((medicineIndex: number, doseIndex: number, field: 'time' | 'dose_amount', value: string) => {
    setMedicineSchedule(prev => {
      const updated = [...prev];
      updated[medicineIndex].dose_times[doseIndex] = {
        ...updated[medicineIndex].dose_times[doseIndex],
        [field]: value
      };
      return updated;
    });
  }, []);

  const addDoseTime = useCallback((medicineIndex: number) => {
    setMedicineSchedule(prev => {
      const updated = [...prev];
      updated[medicineIndex].dose_times.push({ time: '', dose_amount: '1 dose' });
      return updated;
    });
  }, []);

  const removeDoseTime = useCallback((medicineIndex: number, doseIndex: number) => {
    setMedicineSchedule(prev => {
      const updated = [...prev];
      updated[medicineIndex].dose_times = updated[medicineIndex].dose_times.filter((_, i) => i !== doseIndex);
      return updated;
    });
  }, []);

  const addSpecialInstruction = () => {
    setSpecialInstructions([...specialInstructions, { type: '', instruction: '' }]);
  };

  const removeSpecialInstruction = (index: number) => {
    setSpecialInstructions(specialInstructions.filter((_, i) => i !== index));
  };

  const updateSpecialInstruction = (index: number, field: 'type' | 'instruction', value: string) => {
    setSpecialInstructions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addWalkTime = () => {
    setWalkSchedule([...walkSchedule, { time: '', duration: '', notes: '' }]);
  };

  const removeWalkTime = (index: number) => {
    setWalkSchedule(walkSchedule.filter((_, i) => i !== index));
  };

  const updateWalkTime = (index: number, field: 'time' | 'duration' | 'notes', value: string) => {
    setWalkSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <>
      {/* Basic Information */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" defaultValue={formData.name || ''} required className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Birthdate</label>
        <input 
          type="date" 
          name="birthdate" 
          defaultValue={formData.birthdate || ''} 
          className="w-full px-3 py-2 border rounded-md" 
        />
        <p className="text-xs text-gray-500 mt-1">Age will be calculated automatically from birthdate</p>
      </div>
      
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Dog Photo</label>
        <div className="space-y-2">
          {photoPreview && (
            <div className="w-24 h-24 border rounded-md overflow-hidden">
              <img src={photoPreview} alt="Dog preview" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Choose a photo..."
          />
          <p className="text-xs text-gray-500">Upload a photo of the dog (JPG, PNG, etc.)</p>
          <input type="hidden" name="photo_url" value={photoPreview} />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Personality</label>
        <textarea name="personality" defaultValue={formData.personality || ''} className="w-full px-3 py-2 border rounded-md" rows={3} />
      </div>
      
      {/* Feeding Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Feeding Information</h4>
        <div className="space-y-3">
          {feedingSchedule.map((feeding, index) => (
            <div key={`feeding-${index}`} className="border border-gray-200 rounded-lg p-3 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={feeding.time}
                    onChange={(e) => updateFeedingTime(index, 'time', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Amount</label>
                  <input
                    type="text"
                    value={feeding.amount}
                    onChange={(e) => updateFeedingTime(index, 'amount', e.target.value)}
                    placeholder="1½ cups"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFeedingTime(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Notes</label>
                <input
                  type="text"
                  value={feeding.notes}
                  onChange={(e) => updateFeedingTime(index, 'notes', e.target.value)}
                  placeholder="With water, special bowl, etc."
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeedingTime}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Feeding Time
          </button>
        </div>
        <input type="hidden" name="feeding_schedule" value={JSON.stringify(feedingSchedule)} />
        
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Feeding Location</label>
          <input name="feeding_location" defaultValue={formData.feeding_location || ''} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Feeding Notes</label>
          <textarea name="feeding_notes" defaultValue={formData.feeding_notes || ''} className="w-full px-3 py-2 border rounded-md" rows={2} />
        </div>
      </div>

      {/* Medicine Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Medicine Information</h4>
        <div className="space-y-4">
          {medicineSchedule.map((medicine, index) => (
            <div key={`medicine-${index}`} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              {/* Medicine Header */}
              <div className="flex justify-between items-start">
                <h5 className="font-medium text-gray-800">Medicine #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Basic Medicine Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Medication</label>
                  <input
                    type="text"
                    value={medicine.medication}
                    onChange={(e) => updateMedicine(index, 'medication', e.target.value)}
                    placeholder="1 Benadryl (25mg)"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <input
                    type="text"
                    value={medicine.notes}
                    onChange={(e) => updateMedicine(index, 'notes', e.target.value)}
                    placeholder="With food, etc."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              {/* Smart Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Times Per Day</label>
                  <select
                    value={medicine.frequency_per_day}
                    onChange={(e) => updateMedicine(index, 'frequency_per_day', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value={1}>1 time per day</option>
                    <option value={2}>2 times per day</option>
                    <option value={3}>3 times per day</option>
                    <option value={4}>4 times per day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Remaining Doses</label>
                  <input
                    type="number"
                    min="1"
                    value={medicine.remaining_doses}
                    onChange={(e) => updateMedicine(index, 'remaining_doses', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={medicine.start_date}
                    onChange={(e) => updateMedicine(index, 'start_date', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              {/* Calculated End Date Display */}
              {medicine.calculated_end_date && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Calculated End Date:</span> {new Date(medicine.calculated_end_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    <span className="text-blue-600 ml-2">
                      ({Math.ceil(medicine.remaining_doses / medicine.frequency_per_day)} days)
                    </span>
                  </p>
                </div>
              )}

              {/* Dose Times */}
              <div>
                <label className="block text-sm font-medium mb-2">Dose Times</label>
                <div className="space-y-2">
                  {medicine.dose_times.map((dose, doseIndex) => (
                    <div key={`dose-${index}-${doseIndex}`} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1">{dose.dose_amount}</label>
                        <input
                          type="time"
                          value={dose.time}
                          onChange={(e) => updateDoseTime(index, doseIndex, 'time', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Instructions */}
              <div>
                <label className="block text-sm font-medium mb-2">Video Instructions (Optional)</label>
                <YouTubeVideo
                  value={medicine.video_url}
                  onChange={(url) => updateMedicine(index, 'video_url', url)}
                  placeholder="Add video instructions for this medication..."
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMedicine}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>
        <input type="hidden" name="medicine_schedule" value={JSON.stringify(medicineSchedule)} />
        <input type="hidden" name="walk_schedule" value={JSON.stringify(walkSchedule)} />
      </div>

      {/* Potty Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Potty Training</h4>
        <div>
          <label className="block text-sm font-medium mb-1">Potty Trained Status</label>
          <input name="potty_trained" defaultValue={formData.potty_trained || ''} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Potty Notes</label>
          <textarea name="potty_notes" defaultValue={formData.potty_notes || ''} className="w-full px-3 py-2 border rounded-md" rows={2} />
        </div>
      </div>

      {/* Walking Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Walk Schedule</h4>
        {walkSchedule.map((walk, index) => (
          <div key={`walk-${index}`} className="border rounded-lg p-3 mb-3 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <select 
                  value={walk.time} 
                  onChange={(e) => updateWalkTime(index, 'time', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input 
                  type="text" 
                  value={walk.duration} 
                  onChange={(e) => updateWalkTime(index, 'duration', e.target.value)}
                  placeholder="e.g., 30 minutes"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeWalkTime(index)}
                  className="w-full bg-red-100 text-red-700 py-2 px-3 rounded-md hover:bg-red-200 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea 
                value={walk.notes} 
                onChange={(e) => updateWalkTime(index, 'notes', e.target.value)}
                placeholder="Special instructions for this walk..."
                className="w-full px-3 py-2 border rounded-md" 
                rows={2} 
              />
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addWalkTime}
            className="bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Walk Time
          </button>
        </div>

      </div>

      {/* Sleeping Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Sleeping Information</h4>
        <div>
          <label className="block text-sm font-medium mb-1">Sleeping Location</label>
          <input name="sleeping_location" defaultValue={formData.sleeping_location || ''} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Sleeping Notes</label>
          <textarea name="sleeping_notes" defaultValue={formData.sleeping_notes || ''} className="w-full px-3 py-2 border rounded-md" rows={2} />
        </div>
      </div>

      {/* Special Instructions Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Special Instructions</h4>
        <div className="space-y-3">
          {specialInstructions.map((instruction, index) => (
            <div key={`instruction-${index}`} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={instruction.type}
                  onChange={(e) => updateSpecialInstruction(index, 'type', e.target.value)}
                  placeholder="When Leaving, Management, etc."
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div className="flex-2">
                <label className="block text-xs font-medium mb-1">Instruction</label>
                <input
                  type="text"
                  value={instruction.instruction}
                  onChange={(e) => updateSpecialInstruction(index, 'instruction', e.target.value)}
                  placeholder="Goes in small cage"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSpecialInstruction(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecialInstruction}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Special Instruction
          </button>
        </div>
        <input type="hidden" name="special_instructions" value={JSON.stringify(Object.fromEntries(specialInstructions.map(si => [si.type, si.instruction])))} />
      </div>
    </>
  );
});

export default function HouseSittingApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Function to handle tab switching with scroll to top
  const handleTabSwitch = (sectionId: string) => {
    setActiveSection(sectionId);
    // Scroll to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [hasActiveStayToday, setHasActiveStayToday] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dbData, setDbData] = useState<{
    property: Property | null;
    alerts: Alert[];
    dogs: DogType[];
    appointments: Appointment[];
    houseInstructions: HouseInstruction[];
    dailyTasks: DailyTask[];
    stays: Stay[];
    contacts: Contact[];
  }>({
    property: null,
    alerts: [],
    dogs: [],
    appointments: [],
    houseInstructions: [],
    dailyTasks: [],
    stays: [],
    contacts: []
  });
  const [masterSchedule, setMasterSchedule] = useState<ScheduleItem[]>([]);
  const [currentActiveStay, setCurrentActiveStay] = useState<Stay | null>(null);
  const [showPastStays, setShowPastStays] = useState(false);

  // Admin state
  const [editingItem, setEditingItem] = useState<{type: string, id?: string, data?: any} | null>(null);
  const [showAddForm, setShowAddForm] = useState<{type: string} | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedChangesRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stable handler for form changes to prevent unnecessary re-renders
  const handleFormChange = useCallback(() => {
    hasUnsavedChangesRef.current = true;
  }, []);

  // Environment variables for authentication
  const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_ACCESS_PASSWORD;
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      const savedAuth = localStorage.getItem('houseSittingAuth');
      const savedAdmin = localStorage.getItem('houseSittingAdmin');
      
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
      
      if (savedAdmin === 'true') {
        setIsAdmin(true);
      }
    };
    
    checkExistingSession();
  }, []);

  // Load data from database
  const loadDatabaseData = async () => {
    try {
      setIsLoading(true);
      const [property, alerts, dogs, appointments, houseInstructions, dailyTasks, stays, contacts, activeStay, currentStay] = await Promise.all([
        getProperty(),
        getAlerts(),
        getDogs(),
        getAppointments(),
        getHouseInstructions(),
        getDailyTasks(),
        getStays(),
        getContacts(),
        hasActiveStay(),
        getCurrentActiveStay()
      ]);

      setDbData({
        property,
        alerts: alerts || [],
        dogs: dogs || [],
        appointments: appointments || [],
        houseInstructions: houseInstructions || [],
        dailyTasks: dailyTasks || [],
        stays: stays || [],
        contacts: contacts || []
      });
      
      setCurrentActiveStay(currentStay);
      
      setHasActiveStayToday(activeStay);
    } catch (error) {
      console.error('Error loading database data:', error);
      // Initialize with empty data if database fails
      setDbData({
        property: null,
        alerts: [],
        dogs: [],
        appointments: [],
        houseInstructions: [],
        dailyTasks: [],
        stays: [],
        contacts: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate master schedule whenever data changes
  useEffect(() => {
    const schedule = generateMasterSchedule(
      dbData.dogs,
      dbData.appointments,
      [],
      dbData.dailyTasks,
      dbData.stays,
      dbData.houseInstructions
    );
    setMasterSchedule(schedule);
  }, [dbData.dogs, dbData.appointments, dbData.dailyTasks, dbData.stays, dbData.houseInstructions]);

  // Admin CRUD operations
  const handleCreate = async (type: string, data: any) => {
    try {
      let result: any;
      const propertyId = '00000000-0000-0000-0000-000000000001';
      
      switch (type) {
        case 'dog':
          result = await createDog({ ...data, property_id: propertyId });
          if (result) {
            setDbData(prev => ({ ...prev, dogs: [...prev.dogs, result] }));
          }
          break;
        case 'alert':
          result = await createAlert({ ...data, property_id: propertyId });
          if (result) {
            setDbData(prev => ({ ...prev, alerts: [...prev.alerts, result] }));
          }
          break;

        case 'appointment':
          result = await createAppointment({ ...data, property_id: propertyId });
          if (result) {
            setDbData(prev => ({ ...prev, appointments: [...prev.appointments, result] }));
          }
          break;
        case 'houseInstruction':
          console.log('Creating house instruction with data:', { ...data, property_id: propertyId });
          result = await createHouseInstruction({ ...data, property_id: propertyId });
          console.log('House instruction creation result:', result);
          if (result) {
            setDbData(prev => ({ ...prev, houseInstructions: [...prev.houseInstructions, result] }));
            console.log('House instruction added to state');
          } else {
            console.error('Failed to create house instruction');
          }
          break;
        case 'dailyTask':
          result = await createDailyTask({ ...data, property_id: propertyId });
          if (result) {
            setDbData(prev => ({ ...prev, dailyTasks: [...prev.dailyTasks, result] }));
          }
          break;
        case 'stay':
          console.log('Creating stay with data:', { ...data, property_id: propertyId });
          result = await createStay({ ...data, property_id: propertyId });
          console.log('Stay creation result:', result);
          if (result) {
            setDbData(prev => ({ ...prev, stays: [...prev.stays, result] }));
            // Refresh current active stay
            const newCurrentStay = await getCurrentActiveStay();
            setCurrentActiveStay(newCurrentStay);
            console.log('Stay added to state');
          } else {
            console.error('Failed to create stay');
          }
          break;
        case 'contact':
          result = await createContact({ ...data, property_id: propertyId });
          if (result) {
            setDbData(prev => ({ ...prev, contacts: [...prev.contacts, result] }));
          }
          break;
      }
      
      setShowAddForm(null);
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
    }
  };

  const handleUpdate = async (type: string, id: string, data: any) => {
    try {
      let result: any;
      
      switch (type) {
        case 'dog':
          result = await updateDog(id, data);
          if (result) {
            setDbData(prev => ({ 
              ...prev, 
              dogs: prev.dogs.map(dog => dog.id === id ? result : dog)
            }));
          }
          break;
        case 'alert':
          result = await updateAlert(id, data);
          if (result) {
            setDbData(prev => ({ 
              ...prev, 
              alerts: prev.alerts.map(alert => alert.id === id ? result : alert)
            }));
          }
          break;

        case 'appointment':
          result = await updateAppointment(id, data);
          if (result) {
            setDbData(prev => ({ 
              ...prev, 
              appointments: prev.appointments.map(apt => apt.id === id ? result : apt)
            }));
          }
          break;
        case 'houseInstruction':
          console.log('Updating house instruction with id:', id, 'data:', data);
          result = await updateHouseInstruction(id, data);
          console.log('House instruction update result:', result);
          if (result) {
            setDbData(prev => ({ 
              ...prev, 
              houseInstructions: prev.houseInstructions.map(hi => hi.id === id ? result : hi)
            }));
            console.log('House instruction updated in state');
          } else {
            console.error('Failed to update house instruction');
          }
          break;
        case 'dailyTask':
          result = await updateDailyTask(id, data);
          if (result) {
            setDbData(prev => ({ 
              ...prev, 
              dailyTasks: prev.dailyTasks.map(dt => dt.id === id ? result : dt)
            }));
          }
          break;
        case 'stay':
          result = await updateStay(id, data);
          if (result) {
            setDbData(prev => ({ 
              ...prev, 
              stays: prev.stays.map(stay => stay.id === id ? result : stay)
            }));
            // Refresh current active stay
            const newCurrentStay = await getCurrentActiveStay();
            setCurrentActiveStay(newCurrentStay);
          }
          break;
        case 'contact':
          result = await updateContact(id, data);
          if (result) {
            setDbData(prev => ({ 
              ...prev, 
              contacts: prev.contacts.map(contact => contact.id === id ? result : contact)
            }));
          }
          break;
      }
      
      setEditingItem(null);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    try {
      let success = false;
      
      switch (type) {
        case 'dog':
          success = await deleteDog(id);
          if (success) {
            setDbData(prev => ({ ...prev, dogs: prev.dogs.filter(dog => dog.id !== id) }));
          }
          break;
        case 'alert':
          success = await deleteAlert(id);
          if (success) {
            setDbData(prev => ({ ...prev, alerts: prev.alerts.filter(alert => alert.id !== id) }));
          }
          break;

        case 'appointment':
          success = await deleteAppointment(id);
          if (success) {
            setDbData(prev => ({ ...prev, appointments: prev.appointments.filter(apt => apt.id !== id) }));
          }
          break;
        case 'houseInstruction':
          success = await deleteHouseInstruction(id);
          if (success) {
            setDbData(prev => ({ ...prev, houseInstructions: prev.houseInstructions.filter(hi => hi.id !== id) }));
          }
          break;
        case 'dailyTask':
          success = await deleteDailyTask(id);
          if (success) {
            setDbData(prev => ({ ...prev, dailyTasks: prev.dailyTasks.filter(dt => dt.id !== id) }));
          }
          break;
        case 'stay':
          success = await deleteStay(id);
          if (success) {
            setDbData(prev => ({ ...prev, stays: prev.stays.filter(stay => stay.id !== id) }));
            // Refresh current active stay
            const newCurrentStay = await getCurrentActiveStay();
            setCurrentActiveStay(newCurrentStay);
          }
          break;
        case 'contact':
          success = await deleteContact(id);
          if (success) {
            setDbData(prev => ({ ...prev, contacts: prev.contacts.filter(contact => contact.id !== id) }));
          }
          break;
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const generateWelcomePDF = async (stayId: string) => {
    try {
      const response = await fetch('/api/generate-welcome-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stayId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const result = await response.json();
      
      if (result.success) {
        // For now, open the HTML content in a new window for printing
        // In a full implementation, you'd download the actual PDF
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(result.html);
          newWindow.document.close();
          
          // Show user feedback about the delay
          alert('Welcome document opened! Print dialog will appear in 5 seconds to allow QR code to load properly.');
          
          // Wait for QR code to load before printing
          setTimeout(() => {
            newWindow.print();
          }, 5000); // 5 second delay to allow QR code to render
        }
      } else {
        throw new Error(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating welcome PDF:', error);
      alert('Error generating welcome PDF. Please try again.');
    }
  };

  // Handle schedule item deletion
  const handleScheduleItemDelete = async (item: ScheduleItem) => {
    if (item.source === 'task') {
      // Extract the actual task ID from the schedule item ID
      const taskId = item.id.replace('task-', '');
      await handleDelete('dailyTask', taskId);
    } else if (item.source === 'appointment') {
      // Extract the actual appointment ID from the schedule item ID
      const appointmentId = item.id.replace('appointment-', '');
      await handleDelete('appointment', appointmentId);
    }
    // Note: Other sources (dog feeding, medicine, walks, services) are derived from other data
    // and would need to be managed from their respective sections
  };

  // Check for password in URL params on mount (for QR code)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get('access');
    if (urlPassword === SITE_PASSWORD) {
      setIsAuthenticated(true);
      // Clean up URL to remove password
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load database data when component mounts
  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Login Component
  const LoginScreen = () => {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password === SITE_PASSWORD) {
        setIsAuthenticated(true);
        setLoginError('');
        
        // Save session to localStorage
        localStorage.setItem('houseSittingAuth', 'true');
        
        // Log access to database
        try {
          await logAccess({
            property_id: '00000000-0000-0000-0000-000000000001',
            access_type: 'password',
            ip_address: undefined // We can't get IP on client side
          });
        } catch (error) {
          console.error('Error logging access:', error);
        }
      } else {
        setLoginError('Incorrect password. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">House Sitting Portal</h1>
            <p className="text-gray-600">9441 Alto Drive, La Mesa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Access Instructions
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <QrCode className="w-4 h-4" />
              <p>Have a QR code? Scan it to auto-login</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Contact Adam or Lauren if you need access
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Component
  const Navigation = () => {
    const sections = (hasActiveStayToday || isAdmin) ? [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'dogs', label: 'Pet Care', icon: Dog },
      { id: 'house', label: 'House Instructions', icon: Key },
      { id: 'schedule', label: 'Schedule', icon: Calendar }
    ] : [
      { id: 'overview', label: 'Overview', icon: Home }
    ];

    return (
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header - compact on mobile */}
          <div className="flex items-center justify-between py-2 md:py-3">
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">House Sitting Portal</h1>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setIsAdmin(false);
                  localStorage.removeItem('houseSittingAuth');
                  localStorage.removeItem('houseSittingAdmin');
                }}
                className="p-2 md:px-3 md:py-2 text-gray-600 hover:text-gray-800"
                title="Lock"
              >
                <Lock className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => {
                  if (isAdmin) {
                    setIsAdmin(false);
                    localStorage.removeItem('houseSittingAdmin');
                  } else {
                    setShowAdminLogin(true);
                  }
                }}
                className={`px-2 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm ${
                  isAdmin ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isAdmin ? 'Admin' : 'Sitter'}
              </button>
            </div>
          </div>
          
          {/* Navigation tabs with scroll indicators */}
          <div className="relative">
            <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleTabSwitch(section.id)}
                    className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-md transition-colors whitespace-nowrap text-sm md:text-base ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                    <span className="sm:hidden">{section.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Scroll indicators */}
            <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    );
  };

  // Function to group schedule items by time
  const groupScheduleByTime = (scheduleItems: ScheduleItem[]) => {
    const grouped = scheduleItems.reduce((groups, item) => {
      // Check if this is a reminder (title starts with 🔔 Reminder:)
      let groupKey;
      if (item.title.startsWith('🔔 Reminder:')) {
        groupKey = 'Reminders';
      } else {
        groupKey = item.time || 'No time specified';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, ScheduleItem[]>);

    // Sort times chronologically
    const sortedTimes = Object.keys(grouped).sort((a, b) => {
      // Handle "Reminders", "No time specified" and "TBD" at the end
      const endItems = ['Reminders', 'No time specified', 'TBD'];
      if (endItems.includes(a) && !endItems.includes(b)) return 1;
      if (endItems.includes(b) && !endItems.includes(a)) return -1;
      if (endItems.includes(a) && endItems.includes(b)) {
        // Among end items, sort: other times, then Reminders, then No time specified, then TBD
        const order = ['Reminders', 'No time specified', 'TBD'];
        return order.indexOf(a) - order.indexOf(b);
      }
      
      // Try to parse times for comparison
      const timeA = parseTime(a);
      const timeB = parseTime(b);
      
      if (timeA && timeB) {
        return timeA - timeB;
      }
      
      // Fallback to string comparison
      return a.localeCompare(b);
    });

    return sortedTimes.map(time => ({
      time: time === 'Reminders' ? 'Reminders' : formatTimeForDisplay(time),
      items: grouped[time]
    }));
  };

  // Helper function to parse time strings for sorting
  const parseTime = (timeStr: string): number | null => {
    // Handle various time formats
    const timeMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i);
    if (!timeMatch) return null;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2] || '0');
    const period = timeMatch[3]?.toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes; // Convert to minutes for easy comparison
  };

  // Overview Section
  const OverviewSection = () => {
    const currentData = {
      property: {
        address: dbData.property?.address || '9441 Alto Drive, La Mesa, CA 91941',
        wifi: {
          ssid: dbData.property?.wifi_ssid || 'Frenchie Den / Frenchie Den2',
          password: dbData.property?.wifi_password || 'Fir3fly1'
        }
      },
      alerts: dbData.alerts
    };

    // If no active stay and not admin, show limited view
    if (!hasActiveStayToday && !isAdmin) {
      return (
        <div className="space-y-6">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-yellow-800">No Active Stay</h2>
            </div>
            <p className="text-yellow-700 text-lg mb-4">
              There are currently no active house sitting stays scheduled for today.
            </p>
            <p className="text-yellow-600">
              Please contact the property owners to set up a stay period.
            </p>
          </div>
          
          {/* Still show emergency contacts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Emergency Contacts</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbData.contacts.map(contact => (
                <div key={contact.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 capitalize mb-2">
                    {contact.category.replace('_', ' ')}
                  </h3>
                  <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                  {contact.phone && (
                    <p className="text-gray-700">
                      <a 
                        href={`tel:${formatPhoneForTel(contact.phone)}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {contact.phone}
                      </a>
                    </p>
                  )}
                  {contact.email && (
                    <p className="text-gray-700">
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {contact.email}
                      </a>
                    </p>
                  )}
                  {contact.address && (
                    <p className="text-sm text-gray-600">{contact.address}</p>
                  )}
                  {contact.notes && (
                    <p className="text-sm text-gray-500 mt-1">{contact.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Property Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Property Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Address</p>
              <p className="font-medium">{currentData.property.address}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">WiFi</p>
              <p className="font-medium">Network: {currentData.property.wifi.ssid}</p>
              <p className="font-medium">Password: {currentData.property.wifi.password}</p>
            </div>
          </div>
        </div>

        {/* All Alerts */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-800">Important Alerts</h2>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setShowAddForm({ type: 'alert' });
                }}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Alert
              </button>
            )}
          </div>
          <div className="space-y-2">
            {currentData.alerts.map(alert => {
              const getAlertSymbol = (type: string) => {
                switch (type) {
                  case 'danger': return '🚨';
                  case 'warning': return '⚠️';
                  case 'info': return 'ℹ️';
                  default: return '•';
                }
              };
              
              return (
                <div key={alert.id} className={`flex items-start justify-between gap-2 ${
                  alert.type === 'danger' ? 'text-red-700' : 
                  alert.type === 'warning' ? 'text-orange-700' : 'text-blue-700'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg" role="img" aria-label={`${alert.type} alert`}>
                      {getAlertSymbol(alert.type)}
                    </span>
                    <span className="font-medium">{alert.text}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingItem({ type: 'alert', id: String(alert.id), data: alert })}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit alert"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete('alert', String(alert.id))}
                        className="text-red-600 hover:text-red-800"
                        title="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* All Contacts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Emergency Contacts</h2>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setShowAddForm({ type: 'contact' });
                }}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbData.contacts.map(contact => (
              <div key={contact.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {contact.category.replace('_', ' ')}
                  </h3>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingItem({ type: 'contact', id: contact.id, data: contact })}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit contact"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('contact', contact.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                {contact.phone && (
                  <p className="text-gray-700">
                    <a 
                      href={`tel:${formatPhoneForTel(contact.phone)}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {contact.phone}
                    </a>
                  </p>
                )}
                {contact.email && (
                  <p className="text-gray-700">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact.address && (
                  <p className="text-sm text-gray-600">{contact.address}</p>
                )}
                {contact.notes && (
                  <p className="text-sm text-gray-500 mt-1">{contact.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Stay */}
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold">
                {isAdmin ? (showPastStays ? 'All Stays' : 'Current & Upcoming Stays') : 'Current Stay'}
              </h2>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setHasUnsavedChanges(false);
                    setShowAddForm({ type: 'stay' });
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Stay
                </button>
                {(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const pastStays = dbData.stays.filter(stay => stay.end_date < today);
                  return pastStays.length > 0 && (
                    <button
                      onClick={() => setShowPastStays(!showPastStays)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
                        showPastStays 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {showPastStays ? 'Hide' : 'Show'} Past ({pastStays.length})
                    </button>
                  );
                })()}
              </div>
            )}
          </div>
          {/* Filter stays based on user role */}
          {(() => {
            let staysToShow: Stay[] = [];
            
            if (isAdmin) {
              // For admin: show current + upcoming stays by default, optionally show past stays
              const today = new Date().toISOString().split('T')[0];
              const currentAndUpcoming = dbData.stays.filter(stay => stay.end_date >= today);
              const pastStays = dbData.stays.filter(stay => stay.end_date < today);
              
              staysToShow = showPastStays ? dbData.stays : currentAndUpcoming;
            } else {
              // For sitter: show only current active stay
              staysToShow = currentActiveStay ? [currentActiveStay] : [];
            }
            
            if (staysToShow.length > 0) {
              return (
                <div className={`space-y-3 ${isAdmin && showPastStays && staysToShow.length > 5 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
                  {staysToShow.map(stay => (
                    <div key={stay.id} className="bg-white p-4 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{stay.sitter_name}</h3>
                          <p className="text-gray-600">
                            {new Date(stay.start_date).toLocaleDateString()} - {new Date(stay.end_date).toLocaleDateString()}
                          </p>
                          {stay.notes && (
                            <p className="text-sm text-gray-500 mt-1">{stay.notes}</p>
                          )}
                          {/* Show status indicator for admin view */}
                          {isAdmin && (
                            <div className="mt-2">
                              {currentActiveStay && currentActiveStay.id === stay.id ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Current Stay
                                </span>
                              ) : new Date(stay.end_date) < new Date() ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Past Stay
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Future Stay
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => generateWelcomePDF(stay.id)}
                              className="text-green-600 hover:text-green-800"
                              title="Generate Welcome PDF"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setHasUnsavedChanges(false);
                                setEditingItem({ type: 'stay', id: stay.id, data: stay });
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit stay"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('stay', stay.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete stay"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            } else {
              return (
                <div className="bg-white p-4 rounded-md border">
                  <p className="text-gray-600 text-center">
                    {isAdmin 
                      ? (showPastStays ? 'No stays found' : 'No current or upcoming stays')
                      : 'No active stay'
                    }
                  </p>
                </div>
              );
            }
          })()}
        </div>

        {/* Today's Schedule */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold">Today's Schedule</h2>
          </div>
          <div className="space-y-4">
            {masterSchedule.length > 0 ? (
              groupScheduleByTime(masterSchedule).map((timeGroup) => (
                <div key={timeGroup.time} className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-lg text-gray-800">{timeGroup.time}</h3>
                    <span className="text-sm text-gray-500">({timeGroup.items.length} item{timeGroup.items.length !== 1 ? 's' : ''})</span>
                  </div>
                  <div className="space-y-2">
                    {timeGroup.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          item.type === 'feeding' ? 'bg-orange-500' :
                          item.type === 'medicine' ? 'bg-red-500' :
                          item.type === 'appointment' ? 'bg-blue-500' :
                          item.type === 'service' ? 'bg-purple-500' :
                          item.type === 'walk' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{item.title}</p>
                            {isAdmin && (item.source === 'task' || item.source === 'appointment') && (
                              <button
                                onClick={() => handleScheduleItemDelete(item)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {item.dog_name && (
                            <p className="text-sm text-gray-600">For: {item.dog_name}</p>
                          )}
                          {item.notes && (
                            <p className="text-sm text-gray-500">{item.notes}</p>
                          )}
                          {item.location && (
                            <p className="text-sm text-gray-500">📍 {item.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">No scheduled items for today</p>
            )}
          </div>
        </div>


      </div>
    );
  };

  // Dogs Section
  const DogsSection = () => {
    const currentDogs = dbData.dogs;
    
    return (
      <div className="space-y-6">
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <button
              onClick={() => {
                setHasUnsavedChanges(false);
                setShowAddForm({ type: 'dog' });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add New Dog
            </button>
          </div>
        )}
        
        {currentDogs.map(dog => (
        <div key={dog.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {dog.photo_url ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={dog.photo_url} alt={`${dog.name} photo`} className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className="text-4xl">🐕</span>
              )}
              <div>
                <h3 className="text-2xl font-bold">{dog.name}</h3>
                <p className="text-gray-600">{dog.birthdate ? calculateAge(dog.birthdate) : dog.age || 'Age not specified'}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setHasUnsavedChanges(false);
                    setEditingItem({ type: 'dog', id: String(dog.id), data: dog });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit dog"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete('dog', String(dog.id))}
                  className="text-red-600 hover:text-red-800"
                  title="Delete dog"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-4">{dog.personality}</p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Feeding */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Cookie className="w-4 h-4 text-orange-600" />
                Feeding Schedule
              </h4>
              {((dog as any).feeding?.schedule || (dog as any).feeding_schedule || []).map((item: any, idx: number) => (
                <div key={`feeding-display-${idx}-${item.time}-${item.amount}-${item.notes || ''}`} className="mb-2">
                  <p className="mb-1">
                    <span className="font-medium">{formatTimeForDisplay(item.time)}:</span> {item.amount}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-gray-600 ml-2">
                      <em>{item.notes}</em>
                    </p>
                  )}
                </div>
              ))}
              {((dog as any).feeding?.location || (dog as any).feeding_location) && (
                <p className="mt-3 text-sm">
                  <span className="font-medium">Food Location:</span> {(dog as any).feeding?.location || (dog as any).feeding_location}
                </p>
              )}
              {((dog as any).feeding?.notes || (dog as any).feeding_notes) && (
                <p className="text-sm text-gray-600 mt-2 italic">{(dog as any).feeding?.notes || (dog as any).feeding_notes}</p>
              )}
            </div>

            {/* Medicine */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Pill className="w-4 h-4 text-purple-600" />
                Medicine Schedule
              </h4>
              {((dog as any).medicine?.schedule || (dog as any).medicine_schedule || [])
                .filter((item: any) => {
                  // Filter out expired medications - check both old and new formats
                  if (item.calculated_end_date) {
                    // New smart format
                    const endDate = new Date(item.calculated_end_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return today <= endDate;
                  } else if (item.end_date) {
                    // Old format
                    const endDate = new Date(item.end_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (item.end_time) {
                      const endDateTime = new Date(item.end_date + 'T' + item.end_time);
                      return new Date() <= endDateTime;
                    } else {
                      return today <= endDate;
                    }
                  }
                  return true; // Show medications without end dates
                })
                .map((item: any, idx: number) => (
                <div key={`medicine-display-${idx}-${item.medication || item.time}-${item.medication}`} className="mb-2">
                  {item.dose_times ? (
                    // New smart format
                    <div>
                      <p className="mb-1 font-medium">{item.medication}</p>
                      {item.dose_times.map((dose: any, doseIdx: number) => (
                        <p key={doseIdx} className="text-sm ml-4">
                          <span className="font-medium">{dose.time}:</span> {dose.dose_amount}
                        </p>
                      ))}
                      {item.calculated_end_date && (
                        <p className="text-sm text-gray-500 ml-4">
                          (until {new Date(item.calculated_end_date).toLocaleDateString()} - {item.remaining_doses} doses remaining)
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-gray-600 text-sm ml-4 italic">{item.notes}</p>
                      )}
                      {item.video_url && (
                        <div className="ml-4 mt-2">
                          <YouTubeVideo
                            value={item.video_url}
                            onChange={() => {}} // Read-only in view mode
                            disabled={true}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    // Old format
                    <div>
                      <p className="mb-1">
                        <span className="font-medium">{formatTimeForDisplay(item.time)}:</span> {item.medication}
                        {item.end_date && (
                          <span className="text-sm text-gray-500 ml-2">
                            (until {new Date(item.end_date).toLocaleDateString()}
                            {item.end_time && ` at ${item.end_time}`})
                          </span>
                        )}
                      </p>
                      {item.notes && (
                        <p className="text-gray-600 text-sm ml-0 italic">{item.notes}</p>
                      )}
                      {item.video_url && (
                        <div className="ml-0 mt-2">
                          <YouTubeVideo
                            value={item.video_url}
                            onChange={() => {}} // Read-only in view mode
                            disabled={true}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Potty */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-blue-600" />
                Potty Training
              </h4>
              <p className="text-sm">{(dog as any).potty?.trained || (dog as any).potty_trained}</p>
              {((dog as any).potty?.notes || (dog as any).potty_notes) && (
                <p className="text-sm text-gray-600 mt-2 italic">{(dog as any).potty?.notes || (dog as any).potty_notes}</p>
              )}
            </div>

            {/* Walks */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-green-600" />
                Exercise & Walks
              </h4>
              {dog.walk_schedule && Array.isArray(dog.walk_schedule) && dog.walk_schedule.length > 0 ? (
                <div className="space-y-2">
                  {dog.walk_schedule.map((walk: any, index: number) => (
                    <div key={`walk-display-${index}-${walk.time}-${walk.duration}`} className="text-sm">
                      <span className="font-medium">{walk.time}</span>
                      {walk.duration && <span className="text-gray-600"> - {walk.duration}</span>}
                      {walk.notes && <p className="text-gray-600 italic mt-1">{walk.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No scheduled walks</p>
              )}
            </div>

            {/* Special Instructions */}
            {dog.special_instructions && Object.keys(dog.special_instructions).length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-yellow-600" />
                  Special Instructions
                </h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(dog.special_instructions).map(([type, instruction]) => (
                    <p key={type}>
                      <span className="font-medium capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}:</span> {instruction as string}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Sleeping Information */}
            {(dog.sleeping_location || dog.sleeping_notes) && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Moon className="w-4 h-4 text-blue-600" />
                  Sleeping Information
                </h4>
                <div className="space-y-1 text-sm">
                  {dog.sleeping_location && (
                    <p><span className="font-medium">Location:</span> {dog.sleeping_location}</p>
                  )}
                  {dog.sleeping_notes && (
                    <p className="text-gray-600 italic">{dog.sleeping_notes}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dog Appointments */}
          {dbData.appointments.filter(apt => apt.for_dog_id === dog.id).length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {dog.name}'s Appointments
              </h4>
              <div className="space-y-2">
                {dbData.appointments
                  .filter(apt => apt.for_dog_id === dog.id)
                  .map(apt => (
                    <div key={apt.id} className="bg-white rounded p-3 border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{apt.type}</p>
                          <p className="text-sm text-gray-600">{apt.date} at {apt.time}</p>
                          {apt.location && (
                            <p className="text-sm text-gray-500">📍 {apt.location}</p>
                          )}
                          {apt.notes && (
                            <p className="text-sm text-gray-500 mt-1">{apt.notes}</p>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <button 
                              onClick={() => setEditingItem({ type: 'appointment', id: String(apt.id), data: apt })}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit appointment"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('appointment', String(apt.id))}
                              className="text-red-600 hover:text-red-800"
                              title="Delete appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Pet House Rules */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold mb-4">General Pet House Rules</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">Toys</p>
            <p className="text-gray-700">Bottom drawer in laundry room</p>
          </div>
          <div>
            <p className="font-medium mb-1">Water Bowls</p>
            <p className="text-gray-700">Main: dining room, Also: outside & office</p>
          </div>
          <div>
            <p className="font-medium mb-1">Accidents</p>
            <p className="text-gray-700">If on patio, rinse with water. Use baby wipes as needed.</p>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // House Instructions Section
  const HouseSection = () => {
    // Group instructions by category
    const groupedInstructions = dbData.houseInstructions.reduce((groups, instruction) => {
      const category = instruction.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(instruction);
      return groups;
    }, {} as Record<string, typeof dbData.houseInstructions>);

    const categoryIcons = {
      access: Key,
      amenities: Heart,
      entertainment: Tv,
      utilities: Settings
    };

    const categoryLabels = {
      access: 'Access & Security',
      amenities: 'Amenities & Services',
      entertainment: 'Entertainment & Media',
      utilities: 'Utilities & Systems'
    };

    return (
      <div className="space-y-6">
        {Object.entries(groupedInstructions).map(([category, instructions]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] || Settings;
          const label = categoryLabels[category as keyof typeof categoryLabels] || category;
          
          return (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Icon className="w-6 h-6 text-blue-600" />
                {label}
              </h3>
              
              <div className="space-y-4">
                {instructions.map((instruction) => (
                  <div key={instruction.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {instruction.subcategory ? 
                            instruction.subcategory.split(/(?=[A-Z])/).map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ') : 
                            'Instructions'
                          }
                        </h4>
                        
                        <div className="text-sm text-gray-700 space-y-2">
                          {typeof instruction.instructions === 'object' && instruction.instructions.text && (
                            <p>{instruction.instructions.text}</p>
                          )}
                          {typeof instruction.instructions === 'object' && instruction.instructions.maintenance && (
                            <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                              <p className="text-yellow-800 font-medium">Maintenance:</p>
                              <p className="text-yellow-700">{instruction.instructions.maintenance}</p>
                            </div>
                          )}
                        </div>

                        {/* Scheduling Information */}
                        {instruction.schedule_frequency && instruction.schedule_frequency !== 'one_time' && (
                          <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-800 font-medium">Scheduled Service</span>
                            </div>
                            <div className="text-blue-700 text-sm space-y-1">
                              <p>
                                <strong>Frequency:</strong> {instruction.schedule_frequency} 
                                {instruction.schedule_day && ` (${instruction.schedule_day})`}
                                {instruction.schedule_time && ` at ${formatTimeForDisplay(instruction.schedule_time)}`}
                              </p>
                              {instruction.remind_day_before && (
                                <p className="text-orange-700 font-medium">
                                  🔔 <strong>Reminder:</strong> Will show up the day before
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingItem({ type: 'houseInstruction', id: instruction.id, data: instruction })}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('houseInstruction', instruction.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {isAdmin && (
          <button
            onClick={() => setShowAddForm({type: 'houseInstruction'})}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add House Instruction
          </button>
        )}
      </div>
    );
  };



  // Schedule Section
  const ScheduleSection = () => {
    const today = new Date();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentAppointments = dbData.appointments;
    
    const currentDay = weekDays[today.getDay()];
    
    return (
      <div className="space-y-6">
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex gap-3">
            <button
              onClick={() => {
                setHasUnsavedChanges(false);
                setShowAddForm({ type: 'appointment' });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Appointment
            </button>
              <button
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setShowAddForm({ type: 'dailyTask' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Add Daily Task
              </button>
              <button
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setShowAddForm({ type: 'stay' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add Stay
              </button>
            </div>
          </div>
        )}
        
        {/* Today's Master Schedule */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold">Master Schedule</h2>
          </div>
          <div className="space-y-3">
            {masterSchedule.length > 0 ? (
              masterSchedule.map((item) => (
                <div key={item.id} className="flex items-start gap-3 bg-white p-4 rounded-md shadow-sm">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    item.type === 'feeding' ? 'bg-orange-500' :
                    item.type === 'medicine' ? 'bg-red-500' :
                    item.type === 'appointment' ? 'bg-blue-500' :
                    item.type === 'service' ? 'bg-purple-500' :
                    item.type === 'walk' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatTimeForDisplay(item.time)}
                        </span>
                        {isAdmin && (item.source === 'task' || item.source === 'appointment') && (
                          <button
                            onClick={() => handleScheduleItemDelete(item)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {item.dog_name && (
                      <p className="text-sm text-gray-600 mt-1">🐕 For: {item.dog_name}</p>
                    )}
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                    )}
                    {item.location && (
                      <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.type === 'feeding' ? 'bg-orange-100 text-orange-700' :
                        item.type === 'medicine' ? 'bg-red-100 text-red-700' :
                        item.type === 'appointment' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'service' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'walk' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.type}
                      </span>
                      {item.recurring && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          recurring
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No scheduled items for today</p>
            )}
          </div>
        </div>

        {/* Daily Tasks (Untimed) */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold">Daily Tasks</h2>
          </div>
          <div className="space-y-3">
            {dbData.dailyTasks.filter(task => !task.time).length > 0 ? (
              dbData.dailyTasks
                .filter(task => !task.time)
                .map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-md border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{task.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.category === 'pets' ? 'bg-orange-100 text-orange-700' :
                          task.category === 'house' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.category}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem({ type: 'dailyTask', id: task.id, data: task })}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('dailyTask', task.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-600 text-center py-4">No daily tasks yet</p>
            )}
          </div>
        </div>

        {/* Timed Daily Tasks Management */}
        {isAdmin && dbData.dailyTasks.filter(task => task.time).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold">Timed Daily Tasks</h2>
            </div>
            <div className="space-y-3">
              {dbData.dailyTasks.filter(task => task.time).map(task => (
                <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-md border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {task.time}
                      </span>
                      <span className="font-medium">{task.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.category === 'pets' ? 'bg-orange-100 text-orange-700' :
                        task.category === 'house' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem({ type: 'dailyTask', id: task.id, data: task })}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('dailyTask', task.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* All Appointments */}
        {dbData.appointments.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-yellow-700" />
              <h2 className="text-xl font-bold text-yellow-800">All Appointments</h2>
            </div>
            <div className="space-y-3">
              {dbData.appointments.map(apt => (
                <div key={apt.id} className="bg-white rounded p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                      <p className="font-bold text-gray-900">{apt.date} at {apt.time}</p>
                      <p className="font-medium text-gray-700">{apt.type}</p>
                      {apt.for_dog_id && (
                        <p className="text-sm text-gray-600">🐕 For: {dbData.dogs.find(d => d.id === apt.for_dog_id)?.name || 'Unknown Dog'}</p>
                      )}
                    <p className="text-sm text-gray-600 mt-1">{apt.notes}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                      {apt.location}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setEditingItem({ type: 'appointment', id: String(apt.id), data: apt })}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit appointment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete('appointment', String(apt.id))}
                          className="text-red-600 hover:text-red-800"
                          title="Delete appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Admin Forms
  const AdminForm = () => {

    if (!showAddForm && !editingItem) return null;

    const isEditing = !!editingItem;
    const formType = isEditing ? editingItem.type : showAddForm?.type;
    
    // Memoize formData to prevent unnecessary re-renders
    const formData = useMemo(() => {
      if (!isEditing) return {};
      
      const data = editingItem.data;
      
      // For house instructions, we need to extract the nested instructions object
      if (editingItem.type === 'houseInstruction' && data.instructions) {
        return {
          ...data,
          // Extract text from the instructions JSONB object
          instructions: data.instructions.text || '',
          // Handle time type - default to 'specific' if not set
          schedule_time_type: data.schedule_time_type || 'specific',
          // Handle schedule date for one-time events
          schedule_date: data.schedule_frequency === 'one_time' ? data.schedule_day : ''
        };
      }
      
      return data;
    }, [isEditing, editingItem?.data, editingItem?.type]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const formData = new FormData(e.target as HTMLFormElement);
        const data: any = Object.fromEntries(formData.entries());
      
      console.log('Form submission - raw form data:', data);
      console.log('Form submission - form type:', formType);
      
      // Parse JSON fields for dog forms (now handled by hidden inputs)
      if (formType === 'dog') {
        try {
          if (data.feeding_schedule) {
            data.feeding_schedule = JSON.parse(data.feeding_schedule as string);
            // Normalize times in feeding schedule
            if (Array.isArray(data.feeding_schedule)) {
              data.feeding_schedule = data.feeding_schedule.map((feeding: any) => ({
                ...feeding,
                time: normalizeTime(feeding.time || '')
              }));
            }
          }
          if (data.medicine_schedule) {
            data.medicine_schedule = JSON.parse(data.medicine_schedule as string);
            // Normalize times in medicine schedule
            if (Array.isArray(data.medicine_schedule)) {
              data.medicine_schedule = data.medicine_schedule.map((medicine: any) => ({
                ...medicine,
                dose_times: Array.isArray(medicine.dose_times) 
                  ? medicine.dose_times.map((dose: any) => ({
                      ...dose,
                      time: normalizeTime(dose.time || '')
                    }))
                  : medicine.dose_times
              }));
            }
          }
          if (data.walk_schedule) {
            data.walk_schedule = JSON.parse(data.walk_schedule as string);
          }
          if (data.special_instructions) {
            data.special_instructions = JSON.parse(data.special_instructions as string);
          }
          
          // Fix empty date fields - convert empty strings to null
          if (data.birthdate === '') {
            data.birthdate = null;
          }
        } catch (error) {
          console.error('Error parsing JSON fields:', error);
          alert('Error: Invalid data format. Please try again.');
          return;
        }
      }
      
      // Handle house instruction form data
      if (formType === 'houseInstruction') {
        // Structure the instructions object - simplified to just text
        const instructionsText = data.instructions || '';
        
        data.instructions = {
          text: instructionsText
        };
        
        // Handle scheduling fields
        data.remind_day_before = data.remind_day_before === 'on';
        
        // Handle schedule date for one-time events
        if (data.schedule_frequency === 'one_time' && data.schedule_date) {
          // For one-time events, store the date in schedule_day field for compatibility
          data.schedule_day = data.schedule_date;
        }
        
        // Clear schedule_day for daily events (no specific day needed)
        if (data.schedule_frequency === 'daily') {
          data.schedule_day = '';
        }
        
        // Clear scheduling fields if no schedule selected
        if (data.schedule_frequency === 'none') {
          data.schedule_day = '';
          data.schedule_time = '';
          data.schedule_duration = '';
          data.remind_day_before = false;
        }
        
        // Handle duration - convert to number if provided
        if (data.schedule_duration) {
          data.schedule_duration = parseInt(data.schedule_duration);
        }
        
        // Handle time selection - combine time type and time value
        const timeType = data.schedule_time_type || 'specific';
        if (timeType === 'specific') {
          data.schedule_time = normalizeTime(data.schedule_time_specific || '');
        } else {
          data.schedule_time = data.schedule_time_general || '';
        }
        
        // Store the time type for future editing
        data.schedule_time_type = timeType;
        
        // Remove the separate fields since they're now combined
        delete data.schedule_time_specific;
        delete data.schedule_time_general;
        delete data.schedule_custom;
        delete data.schedule_days_per_week;
        delete data.schedule_date; // Clean up the form field, actual date is stored in schedule_day for compatibility
        
        console.log('Form submission - processed house instruction data:', data);
      }
      
      // Normalize time fields for appointments and daily tasks
      if (formType === 'appointment' && data.time) {
        data.time = normalizeTime(data.time);
      }
      
      if (formType === 'dailyTask' && data.time) {
        // Only normalize if it looks like a specific time, leave general descriptions as-is
        const normalizedTime = normalizeTime(data.time);
        if (normalizedTime !== data.time && /^\d{2}:\d{2}$/.test(normalizedTime)) {
          data.time = normalizedTime;
        }
      }
      
      // Handle boolean fields
      if (formType === 'stay') {
        data.active = true; // Always active when created, determined by date range
        console.log('Form submission - processed stay data:', data);
      }
      
      if (isEditing) {
        console.log('Form submission - calling handleUpdate');
        await handleUpdate(formType!, editingItem.id!, data);
      } else {
        console.log('Form submission - calling handleCreate');
        await handleCreate(formType!, data);
      }
      
      // Reset unsaved changes flag after successful submission
      setHasUnsavedChanges(false);
      hasUnsavedChangesRef.current = false;
      
      // Force a data refresh to ensure UI is up to date
      await loadDatabaseData();
      
      // Close the form after successful save
      setShowAddForm(null);
      setEditingItem(null);
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    };

    const handleCancel = () => {
      if (hasUnsavedChangesRef.current) {
        const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close without saving?');
        if (!confirmed) return;
      }
      setShowAddForm(null);
      setEditingItem(null);
      setHasUnsavedChanges(false);
      hasUnsavedChangesRef.current = false;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEditing 
                  ? (formType === 'houseInstruction' ? 'Edit House Instruction' : `Edit ${formType}`)
                  : (formType === 'houseInstruction' ? 'Add New House Instruction' : `Add New ${formType}`)
                }
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} onChange={handleFormChange} className="space-y-4">
              {formType === 'dog' && (
                <DogEditForm formData={formData} />
              )}
              
              {formType === 'alert' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select name="type" defaultValue={formData.type || 'info'} required className="w-full px-3 py-2 border rounded-md">
                      <option value="danger">Danger</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="category" defaultValue={formData.category || 'general'} required className="w-full px-3 py-2 border rounded-md">
                      <option value="pets">Pets</option>
                      <option value="house">House</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <textarea name="text" defaultValue={formData.text || ''} required className="w-full px-3 py-2 border rounded-md" rows={3} />
                  </div>
                </>
              )}
              
              {formType === 'houseInstruction' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="category" defaultValue={formData.category || 'access'} required className="w-full px-3 py-2 border rounded-md">
                      <option value="access">Access & Security</option>
                      <option value="amenities">Amenities & Services</option>
                      <option value="entertainment">Entertainment & Media</option>
                      <option value="utilities">Utilities & Systems</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <input name="subcategory" defaultValue={formData.subcategory || ''} className="w-full px-3 py-2 border rounded-md" placeholder="e.g., mudRoom, hotTub, tv, thermostat" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Instructions</label>
                    <textarea name="instructions" defaultValue={formData.instructions || ''} required className="w-full px-3 py-2 border rounded-md" rows={4} placeholder="Instructions for this item..." />
                  </div>
                  
                  {/* Scheduling Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Scheduling (Optional)</h4>
                    <div className="space-y-4">
                      
                      {/* Schedule Type Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Schedule Type</label>
                        <select 
                          name="schedule_frequency" 
                          defaultValue={formData.schedule_frequency || 'none'} 
                          className="w-full px-3 py-2 border rounded-md"
                          onChange={(e) => {
                            const scheduleDetailsDiv = document.getElementById('schedule-details');
                            const datePickerDiv = document.getElementById('date-picker-section');
                            const weeklyDayDiv = document.getElementById('weekly-day-section');
                            const reminderDiv = document.getElementById('reminder-section');
                            
                            if (e.target.value === 'none') {
                              // Hide all scheduling options
                              if (scheduleDetailsDiv) scheduleDetailsDiv.style.display = 'none';
                              if (reminderDiv) reminderDiv.style.display = 'none';
                            } else {
                              // Show scheduling details
                              if (scheduleDetailsDiv) scheduleDetailsDiv.style.display = 'block';
                              if (reminderDiv) reminderDiv.style.display = 'block';
                              
                              // Show/hide date picker based on type
                              const needsDatePicker = ['one_time'].includes(e.target.value);
                              const needsWeeklyDay = ['weekly'].includes(e.target.value);
                              
                              if (datePickerDiv) datePickerDiv.style.display = needsDatePicker ? 'block' : 'none';
                              if (weeklyDayDiv) weeklyDayDiv.style.display = needsWeeklyDay ? 'block' : 'none';
                            }
                          }}
                        >
                          <option value="none">No schedule (information only)</option>
                          <option value="one_time">One time (specific date)</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>

                      {/* Schedule Details (hidden by default) */}
                      <div id="schedule-details" style={{ display: formData.schedule_frequency && formData.schedule_frequency !== 'none' ? 'block' : 'none' }}>
                        
                        {/* Date Picker for One-time events */}
                        <div id="date-picker-section" style={{ display: formData.schedule_frequency === 'one_time' ? 'block' : 'none' }}>
                          <label className="block text-sm font-medium mb-1">Date</label>
                          <input 
                            name="schedule_date" 
                            type="date" 
                            defaultValue={formData.schedule_date || ''} 
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        {/* Day of Week for Weekly events */}
                        <div id="weekly-day-section" style={{ display: formData.schedule_frequency === 'weekly' ? 'block' : 'none' }}>
                          <label className="block text-sm font-medium mb-1">Day of Week</label>
                          <select 
                            name="schedule_day" 
                            defaultValue={formData.schedule_day || 'sunday'} 
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="sunday">Sunday</option>
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                          </select>
                        </div>

                        {/* Time Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Time Type</label>
                            <select 
                              name="schedule_time_type" 
                              defaultValue={formData.schedule_time_type || 'specific'} 
                              className="w-full px-3 py-2 border rounded-md"
                              onChange={(e) => {
                                const specificInput = document.querySelector('[name="schedule_time_specific"]') as HTMLInputElement;
                                const generalSelect = document.querySelector('[name="schedule_time_general"]') as HTMLSelectElement;
                                if (e.target.value === 'specific') {
                                  if (specificInput) specificInput.style.display = 'block';
                                  if (generalSelect) generalSelect.style.display = 'none';
                                } else {
                                  if (specificInput) specificInput.style.display = 'none';
                                  if (generalSelect) generalSelect.style.display = 'block';
                                }
                              }}
                            >
                              <option value="specific">Specific Time</option>
                              <option value="general">General Time</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            {/* Specific Time Input */}
                            <input 
                              name="schedule_time_specific" 
                              type="time" 
                              defaultValue={formData.schedule_time_type !== 'general' ? formData.schedule_time || '' : ''} 
                              className="w-full px-3 py-2 border rounded-md" 
                              style={{ display: formData.schedule_time_type === 'general' ? 'none' : 'block' }}
                            />
                            {/* General Time Select */}
                            <select 
                              name="schedule_time_general" 
                              defaultValue={formData.schedule_time_type === 'general' ? formData.schedule_time || '' : ''} 
                              className="w-full px-3 py-2 border rounded-md"
                              style={{ display: formData.schedule_time_type === 'general' ? 'block' : 'none' }}
                            >
                              <option value="">Select time period</option>
                              <option value="Morning">Morning</option>
                              <option value="Afternoon">Afternoon</option>
                              <option value="Evening">Evening</option>
                              <option value="Night">Night</option>
                            </select>
                          </div>
                        </div>

                        {/* Optional Fields */}
                        <div>
                          <label className="block text-sm font-medium mb-1">Expected Duration (Optional)</label>
                          <select 
                            name="schedule_duration" 
                            defaultValue={formData.schedule_duration || ''} 
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="">No specific duration</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                            <option value="180">3 hours</option>
                            <option value="240">4 hours</option>
                            <option value="360">6 hours</option>
                            <option value="480">8 hours (all day)</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Set expectations for how long this service typically takes</p>
                        </div>
                      </div>

                      {/* Reminder Section (hidden by default) */}
                      <div id="reminder-section" style={{ display: formData.schedule_frequency && formData.schedule_frequency !== 'none' ? 'block' : 'none' }}>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            name="remind_day_before" 
                            defaultChecked={formData.remind_day_before || false}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Remind the day before (e.g., for trash pickup)</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              

              
              {formType === 'appointment' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input name="date" type="date" defaultValue={formData.date || ''} required className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input name="time" type="time" defaultValue={formData.time || ''} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <input name="type" defaultValue={formData.type || ''} required className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input name="location" defaultValue={formData.location || ''} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea name="notes" defaultValue={formData.notes || ''} className="w-full px-3 py-2 border rounded-md" rows={3} />
                  </div>
                </>
              )}
              
              {formType === 'dailyTask' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Task Title</label>
                    <input name="title" defaultValue={formData.title || ''} required className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time (Optional)</label>
                    <input name="time" defaultValue={formData.time || ''} className="w-full px-3 py-2 border rounded-md" placeholder="e.g., 7:00 AM, Afternoon, Before bed (leave empty for untimed tasks)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="category" defaultValue={formData.category || 'general'} required className="w-full px-3 py-2 border rounded-md">
                      <option value="pets">Pets</option>
                      <option value="house">House</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <textarea name="notes" defaultValue={formData.notes || ''} className="w-full px-3 py-2 border rounded-md" rows={3} />
                  </div>
                </>
              )}
              
              {formType === 'stay' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sitter Name</label>
                    <input name="sitter_name" defaultValue={formData.sitter_name || ''} required className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input name="start_date" type="date" defaultValue={formData.start_date || ''} required className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input name="end_date" type="date" defaultValue={formData.end_date || ''} required className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <textarea name="notes" defaultValue={formData.notes || ''} className="w-full px-3 py-2 border rounded-md" rows={3} />
                  </div>
                </>
              )}
              
              {formType === 'contact' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="category" defaultValue={formData.category || 'other'} required className="w-full px-3 py-2 border rounded-md">
                      <option value="owners">Owners</option>
                      <option value="regular_vet">Regular Vet</option>
                      <option value="emergency_vet">Emergency Vet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="name" defaultValue={formData.name || ''} required className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input name="phone" type="tel" defaultValue={formData.phone || ''} className="w-full px-3 py-2 border rounded-md" placeholder="e.g., 816-676-8363" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" type="email" defaultValue={formData.email || ''} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea name="address" defaultValue={formData.address || ''} className="w-full px-3 py-2 border rounded-md" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea name="notes" defaultValue={formData.notes || ''} className="w-full px-3 py-2 border rounded-md" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Order</label>
                    <input name="display_order" type="number" defaultValue={formData.display_order || 0} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                </>
              )}
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    isEditing ? 'Update' : 'Create'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Admin Login Modal
  const AdminLoginModal = () => {
    if (!showAdminLogin) return null;

    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminPassword === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPassword('');
        
        // Save admin session to localStorage
        localStorage.setItem('houseSittingAdmin', 'true');
      } else {
        alert('Incorrect admin password');
      }
    };

    const handleCancel = () => {
      setShowAdminLogin(false);
      setAdminPassword('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">Admin Access</h3>
            <p className="text-gray-600 mb-4">Enter admin password to access editing features</p>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Admin Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  Access Admin
                </button>
                <button type="button" onClick={handleCancel} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Render the active section
  const renderSection = () => {
    // If no active stay and not admin, only show overview
    if (!hasActiveStayToday && !isAdmin) {
      return <OverviewSection />;
    }
    
    switch(activeSection) {
      case 'overview': return <OverviewSection />;
      case 'dogs': return <DogsSection />;
      case 'house': return <HouseSection />;
      case 'schedule': return <ScheduleSection />;
      default: return <OverviewSection />;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading house sitting information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-4 pb-8">
        {renderSection()}
      </div>
      <AdminForm />
      <AdminLoginModal />
    </div>
  );
}
