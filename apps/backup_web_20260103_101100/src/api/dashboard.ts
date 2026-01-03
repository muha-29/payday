import { apiFetch } from './api';

export type DashboardSummary = {
    todayIncome: number;
    weeklyIncome: number;
    monthlyIncome: number;
    totalSavings: number;
};

/**
 * Fetch dashboard summary
 */
export function getDashboard(): Promise<DashboardSummary> {
    return apiFetch('/dashboard');
}
