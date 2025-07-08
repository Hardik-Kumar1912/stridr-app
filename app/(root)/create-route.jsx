import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import getCurrentLocation from "../../utils/getUserLocation";
import { useRoute } from "../../context/RouteContext";
import sampleRoute from "../../utils/sample_route1.json";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const prioritiesList = [
  "parks",
  "forest",
  "water",
  "touristic",
  "resting",
  "cafe",
  "medical",
];

export default function CreateRoutePage() {
  const router = useRouter();
  const { user } = useUser();
  const { setRoute } = useRoute();

  const [tripType, setTripType] = useState("round");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [inputType, setInputType] = useState("distance");
  const [distance, setDistance] = useState("1");
  const [time, setTime] = useState("30");
  const [calories, setCalories] = useState("1000");
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [lat, setLat] = useState(28.622884208666946);
  const [lng, setLng] = useState(77.22535192598555);
  const [loading, setLoading] = useState(false);

  const getDistanceFromInput = () => {
    if (inputType === "distance") return Number(distance);
    if (inputType === "time") return Number(time) * 0.1;
    if (inputType === "calories") return Number(calories) / 50;
    return 0;
  };

  const togglePriority = (priority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!startLocation) {
      Alert.alert("Error", "Please enter a starting location.");
      setLoading(false);
      return;
    }

    try {
      const priorities = selectedPriorities;

      const BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL;

      if (tripType === "round") {
        const res = await fetch(`${BASE_URL}/api/generation/round-route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_location_cords: [lng, lat],
            route_distance: getDistanceFromInput() * 1000,
            priorities,
          }),
        });

        const data = await res.json();
        if (!data?.route?.[0]) throw new Error("No route generated");
        setRoute(data.route[0]);
        router.push("/result");
      } else {
        if (!destination) {
          Alert.alert("Error", "Please enter a destination.");
          setLoading(false);
          return;
        }

        const geoRes = await fetch(
          `${BASE_URL}/api/geocoding/forward?place=${encodeURIComponent(destination)}`
        );
        const geoData = await geoRes.json();
        const dest_location_cords = geoData.coords;

        const res = await fetch(`${BASE_URL}/api/generation/dest-route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_location_cords: [lng, lat],
            dest_location_cords,
            priorities,
          }),
        });

        const data = await res.json();
        if (!data?.route?.[0]) throw new Error("No route generated");
        setRoute(data.route[0]);
        router.push("/result");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: 0 }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View>
          <TouchableOpacity onPress={() => router.replace("/")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#00cc99" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Create Your Jogging Route</Text>

          <Text style={styles.label}>Starting Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter starting point"
            value={startLocation}
            onChangeText={setStartLocation}
          />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={async () => {
              const { latitude, longitude, address } = await getCurrentLocation();
              setLat(latitude);
              setLng(longitude);
              setStartLocation(address);
            }}
          >
            <Text style={styles.secondaryButtonText}>📍 Use Current Location</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Trip Type</Text>
          <View style={styles.toggleRow}>
            {["round", "destination"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setTripType(type)}
                style={[styles.toggleButton, tripType === type && styles.toggleSelected]}
              >
                <Text style={tripType === type ? styles.toggleTextSelected : styles.toggleText}>
                  {type === "round" ? "Round Trip" : "To Destination"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tripType === "destination" && (
            <>
              <Text style={styles.label}>Destination</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter destination"
                value={destination}
                onChangeText={setDestination}
              />
            </>
          )}

          {tripType === "round" && (
            <>
              <Text style={styles.label}>Goal Type</Text>
              <View style={styles.toggleRow}>
                {["distance", "time", "calories"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setInputType(type)}
                    style={[styles.toggleButton, inputType === type && styles.toggleSelected]}
                  >
                    <Text
                      style={
                        inputType === type ? styles.toggleTextSelected : styles.toggleText
                      }
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder={`Enter ${inputType}`}
                keyboardType="numeric"
                value={inputType === "distance" ? distance : inputType === "time" ? time : calories}
                onChangeText={(val) => {
                  if (inputType === "distance") setDistance(val);
                  else if (inputType === "time") setTime(val);
                  else setCalories(val);
                }}
              />
            </>
          )}

          <Text style={styles.label}>Preferences</Text>
          <View style={styles.priorityGrid}>
            {prioritiesList.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityItem,
                  selectedPriorities.includes(p) && styles.priorityItemSelected,
                ]}
                onPress={() => togglePriority(p)}
              >
                <Text style={{ color: selectedPriorities.includes(p) ? "#fff" : "#333" }}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00cc99" style={{ marginTop: 20 }} />
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Generate Route</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => {
                setRoute(sampleRoute);
                router.push("/result");
              }}
            >
              <Text style={[styles.buttonText, { color: "#00cc99" }]}>Try Sample Route</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: "#111827",
    fontWeight: "500",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#f9fafb",
    fontSize: 14,
  },
  secondaryButton: {
    marginTop: 4,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  secondaryButtonText: {
    fontSize: 13,
    color: "#00cc99",
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    marginRight: 6,
    marginBottom: 8,
  },
  toggleSelected: {
    backgroundColor: "#00cc99",
    borderColor: "#00cc99",
  },
  toggleText: {
    fontSize: 13,
    color: "#374151",
  },
  toggleTextSelected: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  priorityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  priorityItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    marginRight: 6,
    marginBottom: 6,
  },
  priorityItemSelected: {
    backgroundColor: "#00cc99",
    borderColor: "#00cc99",
  },
  button: {
    backgroundColor: "#00cc99",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#00cc99",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
