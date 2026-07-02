import { Warnings_node } from '@/interface/Nodos';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';



export const Warnings = ({id, nodo,message, status, created_at}:Warnings_node) => {
  return (
        <View className='flex-1 border rounded-xl w-full mt-3 border-red-600 bg-red-50'>
          <View className='m-2 flex-row items-center '>
            <Ionicons name='warning-outline' size={24} color={'#EF4444'}/>
            <Text className='color-red-500 ml-2'>Alertas Críticas Activas</Text>
          </View>
          <View className='m-3 bg-slate-50 rounded-xl p-3' key={id}>
              <View className='flex-row justify-between'>
                    <Text className='text-xl font-semibold'>{nodo}</Text>
                    <Text className='color-zinc-400'> Hace {created_at} h</Text>
              </View>
            <View className='flex-row justify-between'>
                    <Text className='color-zinc-400 font-extralight' >{message}</Text>
                    <Text className='color-zinc-400 font-extralight' >Estado: {status ? 'Resuelto' : 'Pendiente'}</Text>
            </View>
          </View>
      </View>
    );
    }