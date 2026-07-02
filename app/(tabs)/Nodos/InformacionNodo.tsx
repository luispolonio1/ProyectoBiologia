// app/informacionNodo.tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { sendMotorCommand } from "../../../lib/api";
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
] as const;

export default function InformacionNodo() {
  const { nodoId } = useLocalSearchParams<{ nodoId: string }>();
  const [sending, setSending] = useState<MotorAction | null>(null);
  const [lastCmd, setLastCmd] = useState<CommandResult | null>(null);

  const handleCommand = useCallback(
    async (action: MotorAction): Promise<void> => {
      try {
        setSending(action);
        const result = await sendMotorCommand({
          deviceId: nodoId,
          action,
          durationMs: 1000,
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
    [nodoId],
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
          <Text className="text-sm text-slate-500 mt-1">
            Estado:{" "}
            <Text className="text-emerald-600 font-semibold">conectado</Text>
          </Text>
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