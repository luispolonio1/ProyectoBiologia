import './../global.css';

import { Text, View } from "react-native";


export default function RootLayout() {
    return(
      <View className='flex-1 justify-center items-center bg-sky-900'>
          <Text className='text-3xl font-bold'>Hola</Text>
      </View>
    )
}


