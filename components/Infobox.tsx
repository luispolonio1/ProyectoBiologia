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

export const InfoBox = ({
  iconName,
  name,
  infoNumber,
  colorBox,
  colorText,
  wtamanio = 'w-52'
}: InfoBoxProps) => {
  return (
    <View
      className={`bg-white rounded-2xl mt-3 p-4 ${wtamanio}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className={`${colorBox} rounded-xl h-10 w-10 justify-center items-center`}>
          <Ionicons name={iconName} size={16} color="white" />
        </View>

        <Text className="text-zinc-400">{name}</Text>
      </View>

      <Text className={`text-2xl font-bold text-center mt-3 ${colorText}`}>
        {infoNumber}
      </Text>
    </View>
  );
};