export const logMessage = (message: any) => {
  console.log(`[MSG] ${new Date().toISOString()}, ${message}`);
};

export const logError = (title: string, error: any) => {
  console.log(`[ERROR] ${new Date().toISOString()}, ${title}:`, error);
};
