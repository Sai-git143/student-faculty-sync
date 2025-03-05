
// Helper to format relative time
export const getRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

// Helper to get category color
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'academic': return 'bg-blue-100 text-blue-800';
    case 'sports': return 'bg-green-100 text-green-800';
    case 'events': return 'bg-purple-100 text-purple-800';
    case 'clubs': return 'bg-yellow-100 text-yellow-800';
    case 'facilities': return 'bg-orange-100 text-orange-800';
    case 'community': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
