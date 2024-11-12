
interface ChatRecord {
    username: string;
    message: string;
    timestamp: string;
    status: 'completed' | 'pending';
  }
  
  // Helper function for validation
  const validateChatData = (data: any[]): { errors: string[], validChats: ChatRecord[] } => {
    const errors: string[] = [];
    const validChats: ChatRecord[] = [];
  
    data.forEach((item) => {
      const { username, message, timestamp, status } = item;
  
      if (!username || !message || !timestamp || !status) {
        errors.push(`Missing required fields in row: ${JSON.stringify(item)}`);
      } else if (!['completed', 'pending'].includes(status)) {
        errors.push(`Invalid status value: ${status} in row: ${JSON.stringify(item)}`);
      } else {
        validChats.push({ username, message, timestamp, status });
      }
    });
  
    return { errors, validChats };
  };