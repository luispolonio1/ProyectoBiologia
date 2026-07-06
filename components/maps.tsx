import { useRed } from '@/context/RedContext';
import { StyleSheet, View } from 'react-native';
import { MapLibreView } from './MapLibreView';

export const MapComponent = () => {
  const { redSeleccionada } = useRed();

  // Solo nodos con ubicación válida
  const nodosConUbicacion = redSeleccionada?.nodos.filter(
    (nodo) =>
      typeof nodo.locations[0]?.latitude === 'number' &&
      typeof nodo.locations[0]?.longitude === 'number'
  ) ?? [];

  const markers = nodosConUbicacion.map((nodo, idx) => ({
    id: `${nodo.id}-${idx}`,
    latitude: nodo.locations[0].latitude,
    longitude: nodo.locations[0].longitude,
    title: nodo.name,
    color: '#FF2E2E',
  }));

  return (
    <View style={styles.container}>
      <MapLibreView
        style={styles.map}
        initialRegion={{
          latitude: nodosConUbicacion[0]?.locations[0]?.latitude ?? -2.1894,
          longitude: nodosConUbicacion[0]?.locations[0]?.longitude ?? -79.5897,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        markers={markers}
        styleUrl="https://tiles.openfreemap.org/styles/liberty"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 300,
  },
});