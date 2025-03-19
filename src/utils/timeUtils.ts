import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Convert UTC to IST (Indian Standard Time)
export const convertToIST = (utcDateString: string): Date => {
  const date = parseISO(utcDateString);
  return date;
};

// Format date to Indian Standard Time
export const formatToIST = (
  dateString: string,
  formatString: string = 'yyyy-MM-dd HH:mm:ss'
): string => {
  const date = parseISO(dateString);
  return formatInTimeZone(date, 'Asia/Kolkata', formatString);
};

// Format lap time (seconds) to mm:ss.SSS
export const formatLapTime = (lapTimeSeconds: number): string => {
  if (!lapTimeSeconds || isNaN(lapTimeSeconds)) return '-';
  
  const minutes = Math.floor(lapTimeSeconds / 60);
  const seconds = lapTimeSeconds % 60;
  
  return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`;
};

// Format sector time (seconds) to ss.SSS
export const formatSectorTime = (sectorTimeSeconds: number): string => {
  if (!sectorTimeSeconds || isNaN(sectorTimeSeconds)) return '-';
  
  return sectorTimeSeconds.toFixed(3);
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

// Get days until a date
export const getDaysUntil = (dateString: string): number => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format date for display
export const formatDate = (
  dateString: string,
  formatString: string = 'dd MMM yyyy'
): string => {
  const date = parseISO(dateString);
  return format(date, formatString);
};

// Get day of week
export const getDayOfWeek = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'EEEE');
};

// Combines date and time strings
export const combineDateAndTime = (dateString: string, timeString: string): string => {
  return `${dateString}T${timeString}`;
};

export default {
  convertToIST,
  formatToIST,
  formatLapTime,
  formatSectorTime,
  getRelativeTime,
  getDaysUntil,
  formatDate,
  getDayOfWeek,
  combineDateAndTime
}; 