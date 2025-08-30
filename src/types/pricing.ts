import { Yacht } from "./yachts"; // adjust the path as needed

/**
 * Returns the effective price per hour for a given yacht service
 * based on the current time (or provided time) in IST.
 *
 * Non-peak hours: 8:00 AM (inclusive) to 5:00 PM (exclusive).
 * Peak hours: 5:00 PM to 8:00 AM next day
 *
 * @param yacht - The yacht object containing pricing details.
 * @param serviceType - The type of service ("sailing" | "anchoring").
 * @param date - Optional Date object. If not provided, uses the current date/time.
 * @returns The price per hour according to the time-based logic.
 */
export const getYachtPrice = (
  yacht: Yacht,
  serviceType: 'sailing' | 'anchoring',
  date: Date = new Date()
): number => {
  // Get the full time details in IST
  const istTime = new Date(date.toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata'
  }));
  
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  
  // Calculate the time in minutes since midnight
  const timeInMinutes = hours * 60 + minutes;
  
  // Define non-peak boundaries in minutes (5PM to 8AM is peakTIme)
  const morningBoundary = 8 * 60;  // 8:00 AM
  const eveningBoundary = 17 * 60; // 5:00 PM
  
  // Check if current time is in non-peak hours
  // Non-peak is from 8:00 AM (inclusive) to 5:00 PM (exclusive)
  const isNonPeak = timeInMinutes >= morningBoundary && timeInMinutes < eveningBoundary;
  
  console.log({
    istHours: hours,
    istMinutes: minutes,
    timeInMinutes,
    isNonPeak
  });

  return isNonPeak
    ? yacht.price[serviceType].nonPeakTime
    : yacht.price[serviceType].peakTime;
};