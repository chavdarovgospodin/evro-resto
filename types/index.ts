/**
 * Общи TypeScript типове
 */

/**
 * Generic API Response
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Generic Error Response
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

