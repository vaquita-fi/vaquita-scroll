// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = (title: string, error: any) => {
  console.log(`[ERROR] ${new Date().toISOString()}, ${title}:`, error);
};
