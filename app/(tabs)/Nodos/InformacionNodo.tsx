import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from "react-native";

export default function informacionNodo(){
    const { nodoId } = useLocalSearchParams();
    return(
        <View className='m-5'>
            <Stack.Screen options={{ headerShown: true, title: `Información del ${nodoId}` }} />
        </View>
    )
}