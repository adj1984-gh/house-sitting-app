import { ScheduleItem } from './types';

// Helper function to calculate age from birthdate
export const calculateAge = (birthdate: string): string => {
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
export const formatPhoneForTel = (phone: string): string => {
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

// Helper function to group schedule items by time
export const groupScheduleByTime = (scheduleItems: ScheduleItem[]) => {
  const grouped = scheduleItems.reduce((groups, item) => {
    const time = item.time || 'No time specified';
    if (!groups[time]) {
      groups[time] = [];
    }
    groups[time].push(item);
    return groups;
  }, {} as Record<string, ScheduleItem[]>);

  // Sort times chronologically
  const sortedTimes = Object.keys(grouped).sort((a, b) => {
    if (a === 'No time specified' || a === 'TBD') return 1;
    if (b === 'No time specified' || b === 'TBD') return -1;
    
    const timeA = parseTime(a);
    const timeB = parseTime(b);
    
    if (timeA === null && timeB === null) return 0;
    if (timeA === null) return 1;
    if (timeB === null) return -1;
    
    return timeA - timeB;
  });

  return { grouped, sortedTimes };
};

// Helper function to parse time strings for sorting
export const parseTime = (timeStr: string): number | null => {
  // Handle various time formats
  const timeMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i);
  if (!timeMatch) return null;
  
  let hours = parseInt(timeMatch[1]);
  const minutes = parseInt(timeMatch[2] || '0');
  const period = timeMatch[3]?.toUpperCase();
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes; // Convert to minutes for easy comparison
};
