// lib/config.ts
// ============================================================
// Configuración central de URLs del backend.
// ⚠️  NO terminar las constantes con "/" — usar solo paths
//     completos (`/nodos/`, `/motor/command/`, etc.) al concatenar.
// ============================================================

export const API_BASE_URL = "https://backend-apib.onrender.com/Api";

// Endpoints del backend
export const ENDPOINTS = {
  redes:           `${API_BASE_URL}/`,
  rios:            `${API_BASE_URL}/rios/`,
  nodos:           `${API_BASE_URL}/nodos/`,
  nodoMetrica:     (nodoId: number | string) => `${API_BASE_URL}/nodos/${nodoId}/metrica/`,
  nodoLocation:    (nodoId: number | string) => `${API_BASE_URL}/nodos/${nodoId}/location/`,
  motorCommand:    `${API_BASE_URL}/motor/command/`,
  motorCommandPending: `${API_BASE_URL}/motor/command/pending/`,
} as const;