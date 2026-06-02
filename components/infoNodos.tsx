// components/InfoNodos.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

import { Nodo } from '@/interface/Nodos';


// Helpers
function getSignalLabel(signal: number): { label: string; color: string } {
  if (signal >= 70) return { label: 'Excelente', color: '#16a34a' };
  if (signal >= 40) return { label: 'Buena',     color: '#ca8a04' };
  return                    { label: 'Débil',     color: '#dc2626' };
}

function getSignalDbm(signal: number): number {
  // Mapea 0-100 a -90..-30 dBm
  return Math.round(-90 + (signal / 100) * 60);
}

function getBateriaColor(bateria: number): string {
  if (bateria >= 60) return '#16a34a';
  if (bateria >= 30) return '#ca8a04';
  return '#dc2626';
}

export function InfoNodos({
  name,
  ultima_metrica,
  locations,
}: Nodo) {
  const { status, signal, bateria, time } = ultima_metrica;
  const { label: signalLabel, color: signalColor } = getSignalLabel(signal);
  const dbm = getSignalDbm(signal);
  const bateriaColor = getBateriaColor(bateria);
  const ubicacion = locations[0] ?? null;

  // Tiempo restante estimado (tiempo actual sobre 30h de batería como referencia)
  const tiempoRestante = time;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
      }}
      onPress={() => router.push({ pathname: '/Nodos/InformacionNodo', params: { nodoId: name } })}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* Icono wifi */}
          <View
            style={{
              backgroundColor: '#d1fae5',
              borderRadius: 10,
              padding: 8,
            }}
          >
            <Ionicons name="wifi" size={20} color="#059669" />
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>
              {name}
            </Text>
            <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              ID-00{ultima_metrica ? 1 : 0}
            </Text>
          </View>
        </View>

        {/* Badge estado */}
        <View
          style={{
            backgroundColor: status ? '#d1fae5' : '#fee2e2',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: status ? '#059669' : '#dc2626', fontSize: 12, fontWeight: '500' }}>
            {status ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 }} />

      {/* Métricas */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Señal */}
        <View>
          <Text style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Señal</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
            {dbm} dBm
          </Text>
          <Text style={{ fontSize: 11, color: signalColor, fontWeight: '500' }}>
            ({signalLabel})
          </Text>
        </View>

        {/* Batería */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Batería</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: bateriaColor }}>
            {bateria}%
          </Text>
        </View>

        {/* Tiempo restante */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Tiempo{'\n'}Restante</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#059669' }}>
            {tiempoRestante}h
          </Text>
          <Text style={{ fontSize: 10, color: '#94a3b8' }}>/30h</Text>
        </View>

        {/* Ubicación */}
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Ubicación</Text>
          {ubicacion ? (
            <>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#0f172a' }}>
                {ubicacion.latitude.toFixed(4)},
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#0f172a' }}>
                {ubicacion.longitude.toFixed(4)}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>Sin GPS</Text>
          )}
        </View>

      </View>
    </TouchableOpacity>
  );
}