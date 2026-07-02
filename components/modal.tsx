import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

import Toast from 'react-native-toast-message';

import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';


const API_URL = `https://backend-apib.onrender.com/Api/`;

interface Rio {
  id: string;
  name: string;
}

interface RedForm {
  name: string;
  rioId: string;
  syncSeconds: string;
}

export const ModalView = ({ rios }: { rios: Rio[] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<RedForm>({
    name: '',
    rioId: '',
    syncSeconds: '60',
  });

  const handleCrear = () => {
    if (!form.name || !form.rioId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Nombre y Rio son obligatorios'
      });
      return;
    }

    const nuevaRed = {
      name: form.name,
      rio: form.rioId,
      sync_seconds: parseInt(form.syncSeconds) || 60,
    };

    console.log('Nueva red:', nuevaRed);
    // aquí llamas tu API o dispatch
    const crearRed = async () => {
          try {
            const response = await fetch(API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(nuevaRed),
            });

            if (response.ok) {
              const data = await response.json();

              // Actualizar UI
              Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'La red se ha creado correctamente'
              });
            } else {
              const errorData = await response.json();

              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `No se pudo crear la red (${response.status})`
              });
            }
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Error de conexión',
              text2: 'No se pudo conectar con el servidor'
            });
          }
};
    crearRed();
    setModalVisible(false);

    setForm({ name: '', rioId: '', syncSeconds: '60' });
  };

  return (
    <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>

          <View className="flex-1 justify-center bg-black/50">
            <View className="bg-zinc-900 mx-5 rounded-2xl p-5">

              <Text className="font-bold text-xl text-white mb-4">Crear Red</Text>

              {/* Name */}
              <Text className="text-zinc-400 mb-1">Nombre</Text>
              <TextInput
                className="bg-zinc-800 text-white rounded-xl px-4 py-3 mb-4"
                placeholder="Nombre de la red"
                placeholderTextColor="#71717a"
                value={form.name}
                onChangeText={(val) => setForm({ ...form, name: val })}
              />

              {/* Rio */}
              <Text className="text-zinc-400 mb-1">Rio</Text>
              <View className="bg-zinc-800 rounded-xl mb-4 overflow-hidden">
                <Picker
                  selectedValue={form.rioId}
                  onValueChange={(val) => setForm({ ...form, rioId: val })}
                  style={{ color: 'white' }}
                  dropdownIconColor="white">
                  <Picker.Item label="Seleccionar..." value="" color="#71717a" />
                  {rios.map((rio) => (
                    <Picker.Item key={rio.id} label={rio.name} value={rio.id} color="black" />
                  ))}
                </Picker>
              </View>

              {/* Sync Seconds */}
              <Text className="text-zinc-400 mb-1">Sincronización (seg)</Text>
              <TextInput
                className="bg-zinc-800 text-white rounded-xl px-4 py-3 mb-6"
                placeholder="60"
                placeholderTextColor="#71717a"
                keyboardType="numeric"
                value={form.syncSeconds}
                onChangeText={(val) => setForm({ ...form, syncSeconds: val })}
              />

              {/* Botones */}
              <TouchableOpacity
                className="bg-emerald-800 p-3 rounded-2xl items-center mb-2"
                onPress={handleCrear}>
                <Text className="color-emerald-300 font-bold text-lg">Crear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-600 p-3 rounded-2xl items-center"
                onPress={() => setModalVisible(false)}>
                <Text className="color-red-200 font-bold text-lg">Cancelar</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        <TouchableOpacity
          className="bg-emerald-800 p-3 rounded-2xl items-center"
          onPress={() => setModalVisible(true)}>
          <Text className="color-emerald-300 font-bold text-lg">+ Agregar Red</Text>
        </TouchableOpacity>
    </>
  );
};