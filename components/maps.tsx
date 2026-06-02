import { useRed } from '@/context/RedContext';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const MapComponent = () => {
  const { redSeleccionada } = useRed();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: redSeleccionada?.nodos[0]?.locations[0]?.latitude || 8.9824,
          longitude: redSeleccionada?.nodos[0]?.locations[0]?.longitude || -79.9224,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {redSeleccionada?.nodos.map((nodo) => (
          <Marker
            key={nodo.id}
            coordinate={{
              latitude: nodo.locations[0]?.latitude,
              longitude: nodo.locations[0]?.longitude,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF2E2E',
    borderWidth: 2,
    borderColor: 'white',
  },
});