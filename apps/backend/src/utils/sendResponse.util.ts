export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any,
  error?: string,
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
    ...(error && { error }),
  });
};
