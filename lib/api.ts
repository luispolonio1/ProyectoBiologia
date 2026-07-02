// lib/api.ts
import type {
    MotorAction,
    MotorCommandResponse,
} from "../type/motor";

const BASE = "https://backend-apib.onrender.com/Api/";

if (!BASE) {
  console.warn("EXPO_PUBLIC_API_URL no está definida");
}

export interface SendMotorCommandArgs {
  deviceId: string;
  action: MotorAction;
  durationMs?: number;
  token?: string;
}

export async function sendMotorCommand({
  deviceId='002',
  action,
  durationMs = 1000,
  token,
}: SendMotorCommandArgs): Promise<MotorCommandResponse> {
  const res = await fetch(`${BASE}/motor/command/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify({
      device_id: deviceId,
      action,
      duration_ms: durationMs,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return (await res.json()) as MotorCommandResponse;
}