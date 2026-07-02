// types/motor.ts
export type MotorAction =
  | "FORWARD"
  | "BACKWARD"
  | "LEFT"
  | "RIGHT"
  | "STOP";

export type CommandStatus = "PENDING" | "EXECUTED" | "FAILED";

export interface MotorCommandPayload {
  device_id: string;
  action: MotorAction;
  duration_ms: number;
}

export interface MotorCommandResponse {
  id: number;
  device_id: string;
  action: MotorAction;
  duration_ms: number;
  status: CommandStatus;
  created_at: string;
}

export interface CommandResult {
  action: MotorAction;
  at: Date;
  id: number;
}