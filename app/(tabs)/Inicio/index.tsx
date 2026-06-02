import { Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';


import { InfoBox } from '@/components/Infobox';
import { InfoNodos } from '@/components/infoNodos';


import { useFetch } from '@/hooks/useFetch';

import { ModalView } from '@/components/modal';
import { ScreenWrapper } from '@/components/SafeAreaPerson';
import { useRed } from '@/context/RedContext';
import { Red, Rio } from '@/interface/Nodos';

import Constants from "expo-constants";


const host = Constants.expoConfig?.hostUri?.split(":")[0];
const API_URL = `http://${host}:8000/Api/`;


export default function Inicio() {
  const { redSeleccionada, setRedSeleccionada } = useRed();

  const { data, loading, error,refetch } = useFetch<Red[]>(
        API_URL
    );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const [itemsRedes, setItemsRedes] = useState<{ label: string; value: number }[]>([]);
  const [rios, setRios] = useState<Rio[]>([]);
  const [loadingrios, setLoadingrios] = useState(true);

  useEffect(() => {
    if (data) {
      const redes = data.map(red => ({ label: red.name, value: red.id }));
      setItemsRedes(redes);
    }
  }, [data]);

  // ✅ Cada vez que cambia el value, actualiza el contexto global
  useEffect(() => {
    if (data && value !== null) {
      const red = data?.find(red => red.id === value) || null;
      setRedSeleccionada(red);
    }
  }, [value, data]);


const nodos = redSeleccionada?.nodos || [];

useEffect(() => {
  fetch(`${API_URL}rios/`)
    .then(res => res.json())
    .then(data => setRios(data))
    .catch(err => console.error('Error:', err))
    .finally(() => setLoadingrios(false));
}, []);

  return (
    <ScreenWrapper>
          <View className='m-5'>
          {/* header*/}
          <View className='flex-1 flex-row justify-between items-center'>
              <Text className='text-2xl font-extrabold'>Monitore de Red</Text>
              <View className='items-center'>
                 <ModalView rios={rios}/>
              </View>
          </View>

          <Text className='mt-3 color-zinc-400' style={{fontFamily:'Altone'}}>
              { 'Monitoreo en tiempo real de \nredes malla'}
          </Text>


          {/* Boton para seleccionar malla para visualizar sus nodos */}
          <View className='mt-4'>
            <Text style={{fontFamily:'Altone'}}>Red Malla Activa</Text>

                    <View className='mt-2'>
                          <DropDownPicker
                                open={open}
                                value={value}
                                items={itemsRedes}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItemsRedes}
                                placeholder="Selecciona una red"
                                listMode="SCROLLVIEW"
                                onOpen={refetch}
                              />
                    </View>


          </View>



          {/* Cajas de informacion */}
          <View className=' flex-row justify-between'>
            <InfoBox iconName={'notifications'} name='Nodos Activos' infoNumber={`${redSeleccionada?.nodos.length}`} colorBox='bg-blue-500'colorText='color-blue-500'/>
            <InfoBox iconName={'warning-outline'} name='Alertas Críticas' infoNumber={'1'} colorBox='bg-orange-500'colorText='color-orange-500'/>
          </View>
          <View>
              <InfoBox iconName={'time'} name='Última Sincronización' infoNumber={`Hace ${redSeleccionada?.sync_seconds} seg`} colorBox='bg-emerald-800' colorText='color-emerald-800' wtamanio='w-full'/>
          </View>


          {/* Caja informativa de Red seleccionada Nombre , estado y Rio */}
          <View className='flex-1 border rounded-xl w-full mt-3 border-gray-400'>

            
            <View className='flex-row items-center justify-between w-full m-2'>
                <Text className='text-lg' style={{fontFamily:'Altone'}}>{redSeleccionada?.name}</Text>
                <View className='flex-row justify-center items-center mr-5 bg-emerald-800 p-2 rounded-lg w-28'>
                  <Ionicons name='wifi' color={'#6ee7b7'} size={16}/>
                  <Text className='color-emerald-300'>Activa</Text>
                </View>
            </View>

          <Text className='color-zinc-400 m-2'>{`${redSeleccionada?.name ? redSeleccionada.name:'Red'}`}</Text>

          
          <View className='flex-row items-center justify-between w-full m-2'>
              <View>
                  <Text className='color-zinc-400'>Río</Text>
                  <Text className='font-extralight'>{redSeleccionada?.rio}</Text>
              </View>
              <View className='mr-5'>
                  <Text className='color-zinc-400'>Frecuencia de Sync</Text>
                  <Text className='font-extralight'>{redSeleccionada?.sync_seconds} seg</Text>
              </View>
          </View>
        </View>





        {/* Caja de alertas esto es solo un ejemplo ya que se va a manejar de diferente forma ademas de 
        tener una caja vacia cuando este sin alertas
        */}


      <View className='flex-1 border rounded-xl w-full mt-3 border-orange-600 bg-orange-50'>
          <View className='m-2 flex-row items-center '>
            <Ionicons name='warning-outline' size={24} color={'#FF7E00'}/>
            <Text className='color-orange-500 ml-2'>Alertas Críticas Activas</Text>
          </View>
          <View className='m-3 bg-slate-50 rounded-xl p-3'>
              <View className='flex-row justify-between'>
                    <Text className='text-xl font-semibold'>Nodo Oeste</Text>
                    <Text className='color-zinc-400' style={{fontFamily:'Altone'}}>Hace 1h</Text>
              </View>
              <Text className='color-zinc-400 font-extralight' >pH fuera de rango normal</Text>
          </View>
      </View>


      {/* Estado de los Nodos de Red Actual */} 
              <View className='mt-4'>
                <Text className='text-xl font-extrabold'>Estado de Todos los Nodos</Text>
                
                      {!nodos || nodos.length === 0 ? (
                        <View className='items-center justify-center mt-5 border border-emerald-900 p-5 bg-emerald-800 rounded-xl w-full h-48'>
                          <Ionicons name='map-outline' size={32} color={'#6ee7b7'}/>
                          <Text className='color-emerald-300'>No hay Nodos disponibles</Text>
                          <Text className='color-emerald-300'>Agrega Nodos para Visualizarlos</Text>
                        </View>
                      ) : (
                        nodos.map(nodo => (
                          <InfoNodos
                            key={nodo.id}
                            id={nodo.id}
                            name={nodo.name}
                            ultima_metrica={nodo.ultima_metrica}
                            locations={nodo.locations}
                            installed_at={nodo.installed_at}
                            red={nodo.red}
                          />
                        ))
                      )}
                </View>
        </View> 
        </ScreenWrapper>
  );
}