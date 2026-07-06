// lib/api.ts
import type {
    MotorAction,
    MotorCommandResponse,
} from "../type/motor";
import { ENDPOINTS } from "./config";

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
  const res = await fetch(ENDPOINTS.motorCommand, {
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