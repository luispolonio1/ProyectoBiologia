// app/informacionNodo.tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { Metrica, Red } from "../../../interface/Nodos";
import { sendMotorCommand } from "../../../lib/api";
import { ENDPOINTS } from "../../../lib/config";
import type { CommandResult, MotorAction } from "../../../type/motor";

interface ActionConfig {
  key: MotorAction;
  label: string;
  color: string;
}

const ACTIONS: readonly ActionConfig[] = [
  { key: "FORWARD",  label: "Subir",  color: "bg-emerald-500" },
  { key: "BACKWARD", label: "Bajar",     color: "bg-amber-500"   },
  { key: "LEFT",     label: "Encender", color: "bg-sky-500"     },
  { key: "STOP",     label: "Detener", color: "bg-rose-500"     },
] as const;

// ⚠️ Misma constante que el resto del proyecto — centralizada en lib/config.ts
const API_URL = ENDPOINTS.redes;

// Duración por defecto en ms (50 segundos coincide con la app del operador)
const DEFAULT_DURATION_MS = 50000;

export default function InformacionNodo() {
  const { nodoId, deviceId } = useLocalSearchParams<{ nodoId: string; deviceId?: string }>();
  const [sending, setSending] = useState<MotorAction | null>(null);
  const [lastCmd, setLastCmd] = useState<CommandResult | null>(null);
  const [metric, setMetric] = useState<Metrica | null>(null);
  const [loadingMetric, setLoadingMetric] = useState(true);

  // Carga la última métrica del nodo desde la lista de redes
  const fetchMetric = useCallback(async () => {
    try {
      setLoadingMetric(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const redes = (await res.json()) as Red[];
      for (const red of redes) {
        const found = red.nodos?.find((n) => n.name === nodoId);
        if (found?.ultima_metrica) {
          setMetric(found.ultima_metrica);
          return;
        }
      }
      setMetric(null);
    } catch {
      setMetric(null);
    } finally {
      setLoadingMetric(false);
    }
  }, [nodoId]);

  useEffect(() => {
    fetchMetric();
  }, [fetchMetric]);

  const handleCommand = useCallback(
    async (action: MotorAction): Promise<void> => {
      try {
        setSending(action);
        const result = await sendMotorCommand({
          // ⚠️ Antes se mandaba el "name" del nodo; ahora el device_id del ESP32
          deviceId: deviceId && deviceId.length > 0 ? deviceId : nodoId,
          action,
          durationMs: DEFAULT_DURATION_MS,
        });
        setLastCmd({ action, at: new Date(), id: result.id });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        Alert.alert("No se pudo enviar", message);
      } finally {
        setSending(null);
      }
    },
    [nodoId, deviceId],
  );

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: `INFORMACIÓN DE ${nodoId}`,
        }}
      />

      <View className="m-5">
        <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
          <Text className="text-xs uppercase text-slate-400">Nodo</Text>
          <Text className="text-2xl font-bold text-slate-800">{nodoId}</Text>
          <View className="flex-row items-center mt-2 gap-3">
            <View className="bg-slate-100 rounded-lg px-2 py-1">
              <Text className="text-xs text-slate-600">
                Device ID:{" "}
                <Text className="font-mono font-semibold text-slate-800">
                  {deviceId && deviceId.length > 0 ? deviceId : "—"}
                </Text>
              </Text>
            </View>
            <Text className="text-sm text-slate-500">
              Estado:{" "}
              <Text className="text-emerald-600 font-semibold">conectado</Text>
            </Text>
          </View>
        </View>

        {/* Tarjeta de sensores ambientales */}
        <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs uppercase text-slate-400">
              Sensores ambientales
            </Text>
            {loadingMetric ? (
              <ActivityIndicator size="small" color="#64748b" />
            ) : (
              <Pressable onPress={fetchMetric} hitSlop={8}>
                <Text className="text-xs text-sky-600 font-medium">
                  Actualizar
                </Text>
              </Pressable>
            )}
          </View>

          {!loadingMetric && !metric ? (
            <Text className="text-sm text-slate-400">
              Aún no hay métricas registradas para este nodo.
            </Text>
          ) : metric ? (
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs text-slate-400 mb-1">Temperatura</Text>
                <Text className="text-3xl font-bold text-slate-800">
                  {metric.temperatura == null
                    ? "—"
                    : `${metric.temperatura.toFixed(1)}°`}
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">Celsius</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text className="text-xs text-slate-400 mb-1">Humedad</Text>
                <Text className="text-3xl font-bold text-sky-600">
                  {metric.humedad == null
                    ? "—"
                    : `${metric.humedad.toFixed(0)}%`}
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Relativa
                </Text>
              </View>
            </View>
          ) : null}

          {metric && (
            <View className="flex-row justify-between mt-4 pt-3 border-t border-slate-100">
              <View>
                <Text className="text-[10px] text-slate-400 uppercase">
                  Señal
                </Text>
                <Text className="text-sm font-semibold text-slate-700">
                  {metric.signal}%
                </Text>
              </View>
              <View>
                <Text className="text-[10px] text-slate-400 uppercase">
                  Batería
                </Text>
                <Text className="text-sm font-semibold text-slate-700">
                  {metric.bateria}%
                </Text>
              </View>
              <View>
                <Text className="text-[10px] text-slate-400 uppercase">
                  Última sync
                </Text>
                <Text className="text-sm font-semibold text-slate-700">
                  {new Date(metric.created_at).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {lastCmd && (
          <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
            <Text className="text-xs uppercase text-slate-400">
              Última orden
            </Text>
            <Text className="text-base text-slate-700 mt-1">
              {lastCmd.action} → enviada a las{" "}
              {lastCmd.at.toLocaleTimeString()}
            </Text>
          </View>
        )}

        <Text className="text-sm font-semibold text-slate-600 mb-3">
          Controles
        </Text>
        <View className="gap-3">
          {ACTIONS.map((a) => {
            const isLoading = sending === a.key;
            return (
              <Pressable
                key={a.key}
                disabled={sending !== null}
                onPress={() => handleCommand(a.key)}
                className={`${a.color} active:opacity-70 rounded-xl py-4 items-center ${
                  sending !== null && !isLoading ? "opacity-40" : ""
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    {a.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}