declare type ErrorResponse = {
  code: number;
  message: string;
};

declare type SuccessResponse<T> = {
  message: string;
} & T;

declare type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
