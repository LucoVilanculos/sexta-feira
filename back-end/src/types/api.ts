export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface ApiError {
  message: string
  code: string
  stack?: string
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiErrorResponse {
  success: false
  error: ApiError
} 