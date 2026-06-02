import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface InfoBoxProps {
    iconName: keyof typeof Ionicons.glyphMap;
    name: string;
    infoNumber: string;
    colorBox:string;
    colorText:string;
    wtamanio?:string;
}

export const InfoBox = ({ iconName, name, infoNumber,colorBox,colorText,wtamanio='w-52' }: InfoBoxProps) => {
    return (
        <View className={`border border-gray-400 rounded-xl mt-3 h-24  ${wtamanio}`}>
            <View className='p-4'>
                <View className='flex-row justify-between items-center'>
                    <View className={`${colorBox} rounded-xl h-10 w-10 justify-center items-center`}>
                        <Ionicons name={iconName} size={16} color="white" />
                    </View>
                    <Text className='color-zinc-400'>{name}</Text>
                </View>
                <Text className={`text-lg font-semibold ${colorText} text-center`} >{infoNumber}</Text>
            </View>
        </View>
    )
}
