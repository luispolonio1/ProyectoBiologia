import { InfoNodos } from '@/components/infoNodos';
import { MapComponent } from '@/components/maps';
import { ModalViewNodo } from '@/components/modalNodos';
import { ScreenWrapper } from '@/components/SafeAreaPerson';
import { useRed } from '@/context/RedContext';
import { useFetch } from '@/hooks/useFetch';
import { Red } from '@/interface/Nodos';
import Constants from "expo-constants";
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';




export default function Tab() {
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  const API_URL = `https://backend-apib.onrender.com/Api/`;
  const {redSeleccionada} = useRed()
  const { data, loading, error,refetch } = useFetch<Red[]>(
          API_URL
      );
  const [itemsRedes, setItemsRedes] = useState<{ label: string; value: number }[]>([]);
  useEffect(() => {
      if (data) {
        const redes = data.map(red => ({ label: red.name, value: red.id }));
        setItemsRedes(redes);
      }
    }, [data]);


  return (
    <ScreenWrapper>
    <View className='justify-center bg-slate-50 m-5'>
      <View className='flex-row justify-between'>
            <View>
                    <Text className='font-bold text-xl'>Mapa de Nodos</Text>
                    <Text className='font-semibold text-sm color-zinc-400'>{redSeleccionada?.name}</Text>
            </View>
            <View>
              {/* boton para agregar Nodos a la Red */} 
              <ModalViewNodo Redes={itemsRedes}/>
            </View>



      </View>
      <View className='mt-5 flex-1'>
        <MapComponent />
      </View>
      <Text className='font-bold text-xl mt-5'>Nodos</Text>


    {/* Nodos */}
    {redSeleccionada?.nodos ? redSeleccionada?.nodos.map(nodo=>(
      <InfoNodos
                        key={nodo.id}
                        id={nodo.id}
                        name={nodo.name}
                        ultima_metrica={nodo.ultima_metrica}
                        locations={nodo.locations}
                        installed_at={nodo.installed_at}
                        red={nodo.red}
      />
    )):
    <View>
      <Text>No hay Nodos</Text>
    </View>
  }

    </View>
    </ScreenWrapper>
  );
}