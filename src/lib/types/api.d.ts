declare type ErrorResponse = {
  status: false;
  code: number;
  message: string;
  errors?: Record<string, string>;
};

declare type SuccessResponse<T> = {
  status: true;
  code: number;
  message: string;
  payload: T;
};

declare type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
