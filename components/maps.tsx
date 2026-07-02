import { useRed } from '@/context/RedContext';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const MapComponent = () => {
  const { redSeleccionada } = useRed();

  // Solo nodos con ubicación válida
  const nodosConUbicacion = redSeleccionada?.nodos.filter(
    (nodo) =>
      typeof nodo.locations[0]?.latitude === 'number' &&
      typeof nodo.locations[0]?.longitude === 'number'
  ) ?? [];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude:  nodosConUbicacion[0]?.locations[0]?.latitude  ?? -2.1894,
          longitude: nodosConUbicacion[0]?.locations[0]?.longitude ?? -79.5897,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {nodosConUbicacion.map((nodo) => (
          <Marker
            key={`${nodo.id}-${nodo.locations[0].latitude}-${nodo.locations[0].longitude}`}
            coordinate={{
              latitude:  nodo.locations[0].latitude,
              longitude: nodo.locations[0].longitude,
            }}
            title={nodo.name}
          >
            <View style={styles.punto} />
          </Marker>
        ))}
      </MapView>
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
  punto: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#FF2E2E',
    borderWidth: 2,
    borderColor: 'white',
  },
});