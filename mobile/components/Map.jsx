import React, { useEffect, useState } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import polyline from "@mapbox/polyline";
import { useRoute } from "@/context/RouteContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const RouteMap = () => {
  const { route } = useRoute();
  const [decodedCoords, setDecodedCoords] = useState([]);

  const parsedRoute = typeof route === "string" ? JSON.parse(route) : route;
  const polylineStr = parsedRoute.points;

  useEffect(() => {
    if (typeof polylineStr === "string" && polylineStr.length > 0) {
      try {
        const decoded = polyline.decode(polylineStr);
        const coords = decoded.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }));
        setDecodedCoords(coords);
      } catch (err) {
        console.error("Failed to decode polyline:", err);
      }
    }
  }, [polylineStr]);

  if (!decodedCoords.length) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const start = decodedCoords[0];
  const end = decodedCoords[decodedCoords.length - 1];
  const isRoundTrip = start.latitude === end.latitude && start.longitude === end.longitude;

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        ...start,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      <Polyline coordinates={decodedCoords} strokeColor="blue" strokeWidth={4} />

      {/* Start Marker */}
      <Marker coordinate={start} pinColor="green" title={isRoundTrip ? "Start/End (Round Trip)" : "Start"} />

      {/* End Marker (only if not round trip) */}
      {!isRoundTrip && (
        <Marker coordinate={end} pinColor="red" title="Destination" />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 500,
    width: "100%",
    borderRadius: 12,
  },
  loader: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RouteMap;
