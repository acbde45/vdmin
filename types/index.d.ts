export interface BasicResponseBody<T = any> {
  code: number;
  message: string;
  result: T;
  type: 'success' | 'error';
}

export interface PagingResponseBody<T = any> extends BasicResponseBody {
  result: {
    page: number;
    size: number;
    total: number;
    data: T[];
  };
}
