export interface AxiosError extends Error {
  response: {
    status: number;
    data: {
      message: string;
    };
  };
}
