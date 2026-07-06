import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { MapLibreView, MapPressEvent } from './MapLibreView';

const API_URL = `https://backend-apib.onrender.com/Api/nodos/`;

interface NodoForm {
  name: string;
  red: number;
  ultima_metrica: {
    status: boolean;
    signal: number;
    bateria: number;
    time: number;
  };
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

export const ModalViewNodo = ({ Redes }: { Redes: { label: string; value: number }[] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<NodoForm>({
    name: '',
    red: 0,
    ultima_metrica: {
      status: false,
      signal: 0,
      bateria: 0,
      time: 0,
    },
    location: null,
  });

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setForm((prev) => ({ ...prev, location: { latitude, longitude } }));
  };

  const handleCrear = async () => {
    if (!form.name || !form.red) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Nombre y Red son obligatorios' });
      return;
    }
    if (!form.location) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Selecciona una ubicación en el mapa' });
      return;
    }

    // Payload con los nombres exactos que espera Django
    const nuevoNodo = {
      name: form.name,
      red: form.red,
      ultima_metrica_input: {
        status: form.ultima_metrica.status,
        signal: form.ultima_metrica.signal,
        bateria: form.ultima_metrica.bateria,
        time: form.ultima_metrica.time,
      },
      locations_input: [
        {
          latitude: form.location.latitude,
          longitude: form.location.longitude,
        },
      ],
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoNodo),
      });

      if (response.ok) {
        Toast.show({ type: 'success', text1: 'Éxito', text2: 'Nodo creado correctamente' });
        setModalVisible(false);
        setForm({
          name: '',
          red: 0,
          ultima_metrica: { status: false, signal: 0, bateria: 0, time: 0 },
          location: null,
        });
      } else {
        const errorData = await response.json().catch(() => null);
        console.log('Error API:', errorData);
        Toast.show({ type: 'error', text1: 'Error', text2: `No se pudo crear el nodo (${response.status})` });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Error de conexión', text2: 'No se pudo conectar con el servidor' });
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>

        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-zinc-900 mx-5 rounded-2xl p-5" style={{ maxHeight: '90%' }}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <Text className="font-bold text-xl text-white mb-4">Crear Nodo</Text>

              {/* ── Nombre ── */}
              <Text className="text-zinc-400 mb-1">Nombre</Text>
              <TextInput
                className="bg-zinc-800 text-white rounded-xl px-4 py-3 mb-4"
                placeholder="Nombre del nodo"
                placeholderTextColor="#71717a"
                value={form.name}
                onChangeText={(val) => setForm({ ...form, name: val })}
              />

              {/* ── Red ── */}
              <Text className="text-zinc-400 mb-1">Red</Text>
              <View className="bg-zinc-800 rounded-xl mb-4 overflow-hidden">
                <Picker
                  selectedValue={form.red}
                  onValueChange={(val) => setForm({ ...form, red: val })}
                  style={{ color: 'white' }}
                  dropdownIconColor="white">
                  <Picker.Item label="Seleccionar..." value={0} color="#71717a" />
                  {Redes.map((red) => (
                    <Picker.Item key={red.value} label={red.label} value={red.value} color="black" />
                  ))}
                </Picker>
              </View>

              {/* ── Última Métrica ── */}
              <Text className="font-semibold text-white mb-3">Última Métrica</Text>

              <Text className="text-zinc-400 mb-1">Señal (dBm)</Text>
              <TextInput
                className="bg-zinc-800 text-white rounded-xl px-4 py-3 mb-4"
                placeholder="0"
                placeholderTextColor="#71717a"
                keyboardType="numeric"
                value={form.ultima_metrica.signal === 0 ? '' : String(form.ultima_metrica.signal)}
                onChangeText={(val) =>
                  setForm({ ...form, ultima_metrica: { ...form.ultima_metrica, signal: Number(val) || 0 } })
                }
              />

              <Text className="text-zinc-400 mb-1">Batería (%)</Text>
              <TextInput
                className="bg-zinc-800 text-white rounded-xl px-4 py-3 mb-4"
                placeholder="0"
                placeholderTextColor="#71717a"
                keyboardType="numeric"
                value={form.ultima_metrica.bateria === 0 ? '' : String(form.ultima_metrica.bateria)}
                onChangeText={(val) =>
                  setForm({ ...form, ultima_metrica: { ...form.ultima_metrica, bateria: Number(val) || 0 } })
                }
              />

              <Text className="text-zinc-400 mb-1">Tiempo (s)</Text>
              <TextInput
                className="bg-zinc-800 text-white rounded-xl px-4 py-3 mb-4"
                placeholder="0.0"
                placeholderTextColor="#71717a"
                keyboardType="decimal-pad"
                value={form.ultima_metrica.time === 0 ? '' : String(form.ultima_metrica.time)}
                onChangeText={(val) =>
                  setForm({ ...form, ultima_metrica: { ...form.ultima_metrica, time: parseFloat(val) || 0 } })
                }
              />

              <Text className="text-zinc-400 mb-1">Estado</Text>
              <View className="bg-zinc-800 rounded-xl mb-4 overflow-hidden">
                <Picker
                  selectedValue={form.ultima_metrica.status}
                  onValueChange={(val) =>
                    setForm({ ...form, ultima_metrica: { ...form.ultima_metrica, status: val } })
                  }
                  style={{ color: 'white' }}
                  dropdownIconColor="white">
                  <Picker.Item label="Inactivo" value={false} color="black" />
                  <Picker.Item label="Activo"   value={true}  color="black" />
                </Picker>
              </View>

              {/* ── Ubicación ── */}
              <Text className="font-semibold text-white mb-1">Ubicación</Text>
              <Text className="text-zinc-500 text-xs mb-3">
                Toca el mapa para fijar la posición del nodo
              </Text>

              {form.location ? (
                <View className="bg-zinc-800 rounded-xl px-4 py-2 mb-3 flex-row justify-between">
                  <Text className="text-zinc-300 text-xs">
                    Lat: {form.location.latitude.toFixed(6)}
                  </Text>
                  <Text className="text-zinc-300 text-xs">
                    Lng: {form.location.longitude.toFixed(6)}
                  </Text>
                </View>
              ) : (
                <View className="bg-zinc-800 rounded-xl px-4 py-2 mb-3">
                  <Text className="text-zinc-500 text-xs">Sin ubicación seleccionada</Text>
                </View>
              )}

              <View className="rounded-2xl overflow-hidden mb-4" style={{ height: 220 }}>
                <MapLibreView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: -2.1894,    // Milagro, Guayas
                    longitude: -79.5897,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                  markers={
                    form.location
                      ? [{ latitude: form.location.latitude, longitude: form.location.longitude, title: 'Nuevo nodo', color: '#22c55e' }]
                      : []
                  }
                  onPress={handleMapPress}
                  styleUrl="https://tiles.openfreemap.org/styles/liberty"
                />
              </View>

              {/* ── Botones ── */}
              <TouchableOpacity
                className="bg-emerald-800 p-3 rounded-2xl items-center mb-2"
                onPress={handleCrear}>
                <Text className="color-emerald-300 font-bold text-lg">Crear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-600 p-3 rounded-2xl items-center mb-2"
                onPress={() => setModalVisible(false)}>
                <Text className="color-red-200 font-bold text-lg">Cancelar</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        className="bg-emerald-800 p-3 rounded-2xl items-center"
        onPress={() => setModalVisible(true)}>
        <Text className="color-emerald-300 font-bold text-lg">+ Agregar Nodo</Text>
      </TouchableOpacity>
    </>
  );
};