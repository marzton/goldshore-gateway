// This file contains the API integration layer for the Gold Shore Control Worker.
// It provides a set of functions for the admin dashboard to interact with the control plane.

const CONTROL_WORKER_URL = (import.meta.env?.VITE_CONTROL_WORKER_URL) || 'https://goldshore-control-worker.goldshore.workers.dev';

interface ControlStatus {
  status: string;
  version: string;
}

export async function getControlWorkerStatus(): Promise<ControlStatus> {
  const response = await fetch(`${CONTROL_WORKER_URL}/status`);
  if (!response.ok) {
    throw new Error('Failed to fetch control worker status');
  }
  return response.json();
}

export async function activateWorkerVersion(worker: string, version: string): Promise<void> {
  const response = await fetch(`${CONTROL_WORKER_URL}/activate-version`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ worker, version }),
  });
  if (!response.ok) {
    throw new Error('Failed to activate worker version');
  }
}

export async function updateKvValue(namespace: string, key: string, value: string): Promise<void> {
  const response = await fetch(`${CONTROL_WORKER_URL}/kv-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ namespace, key, value }),
  });
  if (!response.ok) {
    throw new Error('Failed to update KV value');
  }
}

// Add more functions here to interact with other control plane features.
