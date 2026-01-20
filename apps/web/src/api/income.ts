import { apiFetch } from './api';

export type Income = {
  _id: string;
  amount: number;
  note?: string;
  source?: string;
  date: string;
};

export async function getIncomes(): Promise<Income[]> {
  return apiFetch('/income');
}

export async function getEarningsChart(mode: string): Promise<any[]> {
  return apiFetch(`/earnings/chart?mode=${mode}`);
}

export async function addIncome(payload: {
  amount: number;
  note?: string;
  source?: string;
}) {
  return apiFetch('/income', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function deleteIncome(id: string) {
  return apiFetch(`/income/${id}`, {
    method: 'DELETE'
  });
}

export async function getTodayIncome(): Promise<{ total: number }> {
  return apiFetch('/income/today');
}
