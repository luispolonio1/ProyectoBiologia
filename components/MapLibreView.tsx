import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// ──────────────────────────────────────────────────────────────────────────────
// Tipos públicos — API inspirada en react-native-maps para minimizar cambios
// ──────────────────────────────────────────────────────────────────────────────

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapMarker {
  id?: string;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string; // hex, ej "#FF2E2E"
}

export interface MapPressEvent {
  nativeEvent: {
    coordinate: { latitude: number; longitude: number };
  };
}

export interface MapLibreViewProps {
  style?: StyleProp<ViewStyle>;
  initialRegion: MapRegion;
  markers?: MapMarker[];
  onPress?: (e: MapPressEvent) => void;
  /**
   * URL del estilo MapLibre (style.json).
   * Por defecto: OpenFreeMap "liberty" — hosting público de OpenMapTiles sin API key.
   * Otras opciones OpenFreeMap (también sin key):
   *   - https://tiles.openfreemap.org/styles/positron
   *   - https://tiles.openfreemap.org/styles/bright
   *   - https://tiles.openfreemap.org/styles/dark
   */
  styleUrl?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Estilos OpenMapTiles preconfigurados (todos sin API key, vía OpenFreeMap)
// ──────────────────────────────────────────────────────────────────────────────

export const OPENFREEMAP_STYLES = {
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
  positron: 'https://tiles.openfreemap.org/styles/positron',
  bright: 'https://tiles.openfreemap.org/styles/bright',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Aproxima el zoom de MapLibre a partir del latitudeDelta de la región.
 * MapLibre usa zoom = log2(360 / deltaLat) aprox (en el ecuador).
 */
function deltaToZoom(latitudeDelta: number): number {
  if (!latitudeDelta || latitudeDelta <= 0) return 12;
  const zoom = Math.log2(360 / latitudeDelta);
  return Math.min(20, Math.max(1, zoom));
}

// ──────────────────────────────────────────────────────────────────────────────
// HTML que se inyecta en el WebView — MapLibre GL JS + UI mínima
// ──────────────────────────────────────────────────────────────────────────────

const MAPLIBRE_VERSION = '4.7.1';

const buildHtml = () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>MapLibre</title>
  <link href="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js"></script>
  <style>
    html, body { margin: 0; padding: 0; height: 100%; width: 100%; background:#0a0a0a; }
    #map { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
    .ml-marker {
      width: 25px;
      height: 25px;
      border-radius: 15px;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
      cursor: pointer;
    }
    .maplibregl-popup-content {
      padding: 6px 10px;
      font: 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      border-radius: 8px;
    }
    .maplibregl-ctrl-attrib { font-size: 10px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    (function () {
      var init = window.__INIT__ || {};
      var STYLE_URL = init.styleUrl || 'https://tiles.openfreemap.org/styles/liberty';
      var CENTER = [init.lng || 0, init.lat || 0];
      var ZOOM = typeof init.zoom === 'number' ? init.zoom : 12;
      var MARKERS = init.markers || [];

      var map = new maplibregl.Map({
        container: 'map',
        style: STYLE_URL,
        center: CENTER,
        zoom: ZOOM,
        attributionControl: { compact: true }
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      var markerObjs = [];

      function renderMarkers(list) {
        markerObjs.forEach(function (m) { m.remove(); });
        markerObjs = [];
        (list || []).forEach(function (mk) {
          var el = document.createElement('div');
          el.className = 'ml-marker';
          el.style.background = mk.color || '#FF2E2E';

          var marker = new maplibregl.Marker({ element: el })
            .setLngLat([mk.longitude, mk.latitude])
            .addTo(map);

          if (mk.title) {
            var popup = new maplibregl.Popup({ offset: 18, closeButton: false })
              .setText(mk.title);
            marker.setPopup(popup);
          }

          markerObjs.push(marker);
        });
      }

      function sendReady() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
        }
      }

      map.on('load', function () {
        renderMarkers(MARKERS);
        sendReady();
      });

      map.on('click', function (e) {
        if (!window.ReactNativeWebView) return;
        // Evitar disparar el press cuando se hace click sobre un marker
        var target = e.originalEvent && e.originalEvent.target;
        if (target && target.classList && target.classList.contains('ml-marker')) return;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'press',
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng
        }));
      });

      function handleMessage(raw) {
        if (!raw) return;
        try {
          var data = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (data.type === 'setMarkers') {
            renderMarkers(data.markers || []);
          } else if (data.type === 'setCenter' && typeof data.lat === 'number' && typeof data.lng === 'number') {
            map.flyTo({ center: [data.lng, data.lat], zoom: data.zoom != null ? data.zoom : map.getZoom() });
          }
        } catch (err) {
          console.warn('[maplibre] bad message', err);
        }
      }

      // iOS: window.message
      window.addEventListener('message', function (ev) { handleMessage(ev.data); });
      // Android: document.message
      document.addEventListener('message', function (ev) { handleMessage(ev.data); });
    })();
  </script>
</body>
</html>`;

// ──────────────────────────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────────────────────────

export const MapLibreView = ({
  style,
  initialRegion,
  markers = [],
  onPress,
  styleUrl = OPENFREEMAP_STYLES.liberty,
}: MapLibreViewProps) => {
  const webViewRef = useRef<WebView | null>(null);
  const readyRef = useRef(false);
  const pendingMarkersRef = useRef<MapMarker[] | null>(null);

  const initialPayload = useMemo(
    () => ({
      styleUrl,
      lat: initialRegion.latitude,
      lng: initialRegion.longitude,
      zoom: deltaToZoom(initialRegion.latitudeDelta),
      markers: markers.map((m, i) => ({
        id: m.id ?? String(i),
        latitude: m.latitude,
        longitude: m.longitude,
        title: m.title,
        color: m.color ?? '#FF2E2E',
      })),
    }),
    // Solo en el primer render — los cambios posteriores se aplican por postMessage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const injectInit = `
    window.__INIT__ = ${JSON.stringify(initialPayload)};
    true;
  `;

  // Enviar markers cada vez que cambian (si el mapa ya está listo)
  useEffect(() => {
    const payload = JSON.stringify({
      type: 'setMarkers',
      markers: markers.map((m, i) => ({
        id: m.id ?? String(i),
        latitude: m.latitude,
        longitude: m.longitude,
        title: m.title,
        color: m.color ?? '#FF2E2E',
      })),
    });

    if (readyRef.current && webViewRef.current) {
      webViewRef.current.injectJavaScript(
        `window.postMessage(${JSON.stringify(payload)}); true;`
      );
    } else {
      // Guarda para enviar cuando llegue el 'ready'
      pendingMarkersRef.current = markers;
    }
  }, [markers]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        readyRef.current = true;
        // Si tenemos markers pendientes (cambiaron antes de que cargara), los enviamos
        if (pendingMarkersRef.current && webViewRef.current) {
          const payload = JSON.stringify({
            type: 'setMarkers',
            markers: pendingMarkersRef.current.map((m, i) => ({
              id: m.id ?? String(i),
              latitude: m.latitude,
              longitude: m.longitude,
              title: m.title,
              color: m.color ?? '#FF2E2E',
            })),
          });
          webViewRef.current.injectJavaScript(
            `window.postMessage(${JSON.stringify(payload)}); true;`
          );
          pendingMarkersRef.current = null;
        }
      } else if (data.type === 'press') {
        onPress?.({
          nativeEvent: {
            coordinate: { latitude: data.latitude, longitude: data.longitude },
          },
        });
      }
    } catch {
      // ignora mensajes mal formados
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: buildHtml(), baseUrl: 'https://localhost' }}
        injectedJavaScriptBeforeContentLoaded={injectInit}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        mixedContentMode="always"
        style={styles.webview}
        onMessage={handleMessage}
        // Importante para que el WebView ocupe todo el contenedor
        containerStyle={styles.webviewContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default MapLibreView;