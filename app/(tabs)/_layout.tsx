import './../../global.css';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { StatusBar } from 'react-native';



import { RedProvider } from '@/context/RedContext';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';



export default function TabLayout() {

  const [] = useFonts({
    SuperSquad:require('../../assets/fonts/SuperSquad.ttf'),
    Avenge:require('../../assets/fonts/AVENGEANCEMIGHTIESTAVENGER.otf'),
    Designer:require('../../assets/fonts/Designer.otf'),
    Altone:require('../../assets/fonts/Altone Trial-Regular.ttf')
  })

  return (
    <SafeAreaProvider
    
    >
    <RedProvider>
    <StatusBar 
        barStyle='dark-content'
        backgroundColor="#ffffff"
        translucent={false}
        />
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8AE393',
        tabBarInactiveTintColor: '#ffffff',

        tabBarStyle: {
          backgroundColor: '#065f46',
          borderTopWidth: 0,
          height: 90,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },

        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Inicio/index"
        options={{
          title: 'Inicio',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-sharp"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Nodos"
        options={{
          title: 'Nodos',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="map"
              size={size}
              color={color}
            />
          ),
          
        }}
      />

      <Tabs.Screen
        name="Estadisticas/Estadisticas"
        options={{
          title: 'Estadisticas',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="bar-chart"
              size={size}
              color={color}
            />
          ),
          
        }}
      />

      <Tabs.Screen
        name="Configuraciones/setting"
        options={{
          title: 'Configuraciones',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings"
              size={size}
              color={color}
            />
          ),
          
        }}
      />
    </Tabs>
      <Toast />
    </RedProvider>
  </SafeAreaProvider>
  );
}