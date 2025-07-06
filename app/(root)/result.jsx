import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRoute as useAppRoute } from "@/context/RouteContext";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import RouteMap from "../../components/Map";
import { Ionicons } from "@expo/vector-icons"; // For the back arrow

export default function ResultScreen() {
  const { route } = useAppRoute();
  const navigation = useNavigation();
  const [parsedRoute, setParsedRoute] = useState(null);

  useEffect(() => {
    let routeData = route;
    if (typeof route === "string") {
      try {
        routeData = JSON.parse(route);
      } catch (e) {
        routeData = null;
      }
    }

    if (!routeData || !routeData.points) {
      Toast.show({
        type: "error",
        text1: "No route found",
        text2: "Please generate a route first.",
      });
      navigation.replace("RouteScreen");
    } else {
      setParsedRoute(routeData);
    }
  }, [route]);

  if (!parsedRoute) return null;

  const distanceInKm = (parsedRoute.distance / 1000).toFixed(2);
  const timeInMin = Math.round(parsedRoute.time / 60000);
  const estimatedCalories = Math.round((parsedRoute.distance / 1000) * 50);
  const turnCount = parsedRoute.instructions?.length || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("create-route")}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Route Summary</Text>

        <View style={styles.statsContainer}>
          <StatCard label="Distance" value={`${distanceInKm} km`} color="#3B82F6" />
          <StatCard label="Estimated Time" value={`${timeInMin} min`} color="#10B981" />
          <StatCard label="Calories Burned" value={`${estimatedCalories} kcal`} color="#F97316" />
          <StatCard label="Turns" value={turnCount} color="#8B5CF6" />
        </View>

        <Text style={styles.sectionTitle}>Route Map</Text>
        <View style={styles.mapContainer}>
          <RouteMap />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Create Another Route"
            color="#00cc99"
            onPress={() => navigation.navigate("create-route")}
          />
        </View>

        <Toast />
      </View>
    </SafeAreaView>
  );
}

const StatCard = ({ label, value, color }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f5f9",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: "#111827",
    fontWeight: "500",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1f2937",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
});
