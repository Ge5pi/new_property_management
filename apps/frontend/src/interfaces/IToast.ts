export interface IToastProps {
  id?: string;
  destroy?: (id: string) => void;
  title: string;
  description?: IErrorResponse | string;
  duration?: number | 4000;
  type: 'success' | 'info' | 'warning' | 'danger';
  autoHide?: boolean | true;
}

export interface IErrorResponse {
  code?: number;
  response?: string;
  message: string;
}

export interface IRouteError {
  status: number;
  statusText: string;
  data: unknown;
  internal: boolean;
  error?: Error;
}
