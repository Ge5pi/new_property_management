export interface IPieChartProps {
  chartData?: { name: string; value: number; color: string; textColor: string }[];
  legendWidth?: number;
  legendHeight?: number;
}
export interface ILineChartProps {
  chartData?: { stroke: string; value: number; color: string; textColor: string }[];
  stroke?: string;
}

export interface IDashboardStatistics {
  total_units_count: number;
  occupied_units_count: number;
  vacant_units_count: number;
  occupancy_percentage: number;
  vendors_count: number;
  tenants_count: number;
  owners_count: number;
  users_count: number;
  properties_count: number;
  complete_occupied_properties_count: number;
  partial_occupied_properties_count: number;
  vacant_properties_count: number;
}

export interface IDashboardGeneralStatistics {
  completed_service_requests_count: number;
  pending_service_requests_count: number;
  unassigned_work_orders_count: number;
  open_work_orders_count: number;
  assigned_work_orders_count: number;
  completed_work_orders_count: number;
  approved_rental_applications_count: number;
  pending_rental_applications_count: number;
  rejected_rental_applications_count: number;
  on_hold_rental_applications_count: number;
  draft_rental_applications_count: number;
}

export interface IServiceRequestPieChartsData {
  pending_service_requests_count: number;
  completed_service_requests_count: number;
}

export interface IWorkOrdersPieChartsData {
  unassigned_work_orders_count: number;
  assigned_work_orders_count: number;
  open_work_orders_count: number;
  completed_work_orders_count: number;
}

export interface IRentalApplicationsPieChartsData {
  approved_rental_applications_count: number;
  rejected_rental_applications_count: number;
  pending_rental_applications_count: number;
  on_hold_rental_applications_count: number;
  draft_rental_applications_count: number;
}

export interface IPortfolioProperty {
  id?: string | number;
  name: string;
  cover_picture?: string;
  units_count?: number;
  occupied_units_count?: number;
  vacant_units_count?: number;
  vacant_for_days?: string;
}
