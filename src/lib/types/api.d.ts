declare type ErrorResponse = {
  status: boolean;
  code: number;
  message: string;
  errors?: Record<string, string>;
};

declare type SuccessResponse<T> = {
  status: boolean;
  code: number;
  message: string;
} & T;

declare type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
