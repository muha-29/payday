import { apiFetch } from './api';

export type SavingsGoal = {
    _id: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    createdAt: string;
};

export async function getSavings() {
    return apiFetch<SavingsGoal[]>('/savings');
}

export async function createGoal(data: {
    title: string;
    targetAmount: number;
}) {
    return apiFetch('/savings', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function addSavingsAmount(
    id: string,
    amount: number
) {
    return apiFetch(`/savings/${id}/add`, {
        method: 'POST',
        body: JSON.stringify({ amount })
    });
}

export async function deleteSavings(id: string) {
    return apiFetch(`/savings/${id}`, {
        method: 'DELETE'
    });
}
