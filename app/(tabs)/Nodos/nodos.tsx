import { InfoNodos } from '@/components/infoNodos';
import { MapComponent } from '@/components/maps';
import { ScreenWrapper } from '@/components/SafeAreaPerson';
import { useRed } from '@/context/RedContext';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Tab() {
  const {redSeleccionada} = useRed()
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
              <TouchableOpacity
                      className="bg-emerald-800 p-3 rounded-2xl items-center"
                      onPress={() => console.log('Presionado')}
                      >
                    <Text className="color-emerald-300 font-bold text-lg " style={{fontFamily:'Altone'}}>
                          + Agregar Nodo
                    </Text>
                </TouchableOpacity>
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