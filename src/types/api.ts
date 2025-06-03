export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
  };
  status: number;
}