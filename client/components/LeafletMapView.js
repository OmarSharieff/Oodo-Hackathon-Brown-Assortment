import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LeafletMapView({ 
  latitude, 
  longitude, 
  locations = [],
  onMarkerPress 
}) {
  // Generate markers HTML
  const markersHTML = locations.map(loc => {
    // Choose marker color based on type
    let markerColor = 'blue'; // default
    if (loc.hotspot) markerColor = 'red';
    else if (loc.type === 'post') markerColor = 'orange';
    else if (loc.type === 'mapillary') markerColor = 'blue';
    
    return `
    L.marker([${loc.latitude}, ${loc.longitude}], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      })
    })
    .addTo(map)
    .bindPopup(\`
      <div style="text-align: center;">
        <strong>${loc.hotspot ? '🔥 Hotspot' : '📍 Location'}</strong><br>
        ${loc.type === 'post' ? '👤 User Post<br>' : '📷 Street View<br>'}
        ${loc.near_greenery ? '🌿 Near Greenery<br>' : ''}
        ${loc.description ? loc.description.substring(0, 50) + '...<br>' : ''}
        <button onclick="window.ReactNativeWebView.postMessage('${loc.id}')">
          View Details
        </button>
      </div>
    \`);
  `}).join('\n');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Initialize map
        const map = L.map('map').setView([${latitude}, ${longitude}], 14);

        // Add OpenStreetMap tiles (free!)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add user location marker
        L.marker([${latitude}, ${longitude}], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }).addTo(map).bindPopup('📍 Your Location');

        // Add location markers
        ${markersHTML}

        // Handle marker clicks
        map.on('popupopen', function(e) {
          const buttons = document.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.cssText = 'background: #f4d171; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 5px;';
          });
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {
    const locationId = event.nativeEvent.data;
    const selectedLocation = locations.find(loc => loc.id === locationId);
    if (selectedLocation && onMarkerPress) {
      onMarkerPress(selectedLocation);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});