
export const calculateProgress = (startTime: string, endTime: string) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const startDateTime = new Date(`${today}T${startTime}`);
  const endDateTime = new Date(`${today}T${endTime}`);

  const totalDuration = endDateTime.getTime() - startDateTime.getTime();
  const elapsed = now.getTime() - startDateTime.getTime();

  return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
};

export const getCardStyle = (status: string) => {
  switch (status) {
    case 'active':
      return 'border-green-200';
    case 'planned':
      return 'border-blue-200 ';
    case 'completed':
      return 'border-gray-200 ';
    default:
      return 'border-gray-200 ';
  }
};

export const getStatusDisplayText = (status: string) => {
  switch (status) {
    case 'active': return 'Active Operation';
    case 'planned': return 'Scheduled Operation';
    case 'completed': return 'Completed Operation';
    default: return 'Operation';
  }
};
