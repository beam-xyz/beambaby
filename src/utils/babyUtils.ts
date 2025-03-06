
// Helper function to generate unique IDs
export const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Get today's date at midnight for easy comparison
export const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Compare two dates to see if they are the same day
export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
