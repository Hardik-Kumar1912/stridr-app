import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
const RouteContext = createContext();

// RouteProvider component
export function RouteProvider({ children }) {
  const [route, setRoute] = useState("");

  // Load the route from AsyncStorage on app start
  useEffect(() => {
    const loadRoute = async () => {
      try {
        const storedRoute = await AsyncStorage.getItem("route");
        if (storedRoute) {
          try {
            const parsed = JSON.parse(storedRoute);
            setRoute(parsed);
          } catch (err) {
            // If it's not JSON, set it as a string
            setRoute(storedRoute);
          }
        }
      } catch (e) {
        console.error("❌ Failed to load route from AsyncStorage:", e);
      }
    };

    loadRoute();
  }, []);

  // Save the route to AsyncStorage when it changes
  useEffect(() => {
    const saveRoute = async () => {
      try {
        if (__DEV__) {
          console.log("--from RouteContext.js file--");
          console.log("RouteContext: Saving route to AsyncStorage :", route);
          console.log("--End of RouteContext.js file--");
        }

        const valueToStore =
          typeof route === "string" ? route : JSON.stringify(route);
        await AsyncStorage.setItem("route", valueToStore);
      } catch (e) {
        console.error("❌ Failed to save route to AsyncStorage:", e);
      }
    };

    if (route !== "") {
      saveRoute();
    }
  }, [route]);

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  );
}

// Custom hook to use the RouteContext
export function useRoute() {
  return useContext(RouteContext);
}
