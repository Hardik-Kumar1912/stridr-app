import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

// Access environment variable (make sure you prefix it with EXPO_PUBLIC_ in .env)
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const getCurrentLocation = async () => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "Location access is required.",
      });
      throw new Error("Permission not granted");
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;

    // Use the .env BACKEND_URL
    const response = await fetch(
      `${BACKEND_URL}/api/geocoding/reverse?lat=${latitude}&lon=${longitude}`
    );

    const { address } = await response.json();

    if (__DEV__) {
      console.log("------From getUserLocation.js------");
      console.log("Fetched address:", address);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("------End getUserLocation.js------");
    }

    return { latitude, longitude, address };
  } catch (err) {
    console.error("Error fetching location:", err);
    throw err;
  }
};

export default getCurrentLocation;
