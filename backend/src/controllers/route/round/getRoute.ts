import { FeatureCollectionArea } from "../../../types/types";
interface CustomModelPriority {
  if: string;
  multiply_by: string;
}

interface CustomModel {
  priority: CustomModelPriority[];
  areas: FeatureCollectionArea[];
  distance_influence: number;
}
export async function getRoute(
  user_location_cords: [number, number], // [lon, lat]
  route_distance: number,
  poiCount: number,
  featureCollection: {
    type: string;
    features: FeatureCollectionArea[];
  }
) {
  const GRAPHHOPPER_HOST_URL =
    process.env.GRAPHHOPPER_HOST_URL || "http://localhost:8989";
  const url = `${GRAPHHOPPER_HOST_URL}/route`;

  const customModel: CustomModel = {
    priority: Array.from(
      { length: poiCount },
      (_, i): CustomModelPriority => ({
        if: `in_primary_poi_${i}`,
        multiply_by: "50",
      })
    ),
    areas: featureCollection.features,
    distance_influence: 100,
  };

  const payload = {
    points: [user_location_cords],
    profile: "foot",
    algorithm: "round_trip",
    "round_trip.distance": route_distance,
    "ch.disable": true,
    custom_model: customModel,
  };

  // console.log(
  //   "Fetching round-trip route with payload:",
  //   JSON.stringify(payload),
  // );

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    // console.log("Round-trip data:", data.paths);
    return data.paths;
  } catch (e) {
    console.error("Error fetching round-trip:", e);
    throw e;
  }
}
