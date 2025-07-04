import { FeatureCollectionArea } from '../../../types/types';
export async function getDestFeatureCollection(pois: [number, number][]): Promise<{ type: string; features: FeatureCollectionArea[] }> {
  if (!pois || !Array.isArray(pois) || pois.length === 0) {
    console.error("No points of interest provided:", pois);
    return {
      type: "FeatureCollection",
      features: [],
    };
  }
  // console.log("Points of interest:", pois);
  const features: FeatureCollectionArea[] = [];
  pois.forEach((poi, index) => {
    if (!Array.isArray(poi) || poi.length !== 2) {
      throw new Error("Invalid POI coordinates");
    }
    // Primary POI: +-0.0004
    features.push({
      type: "Feature",
      id: `primary_poi_${index}`,
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [poi[0] - 0.0004, poi[1] - 0.0004],
            [poi[0] + 0.0004, poi[1] - 0.0004],
            [poi[0] + 0.0004, poi[1] + 0.0004],
            [poi[0] - 0.0004, poi[1] + 0.0004],
            [poi[0] - 0.0004, poi[1] - 0.0004],
          ],
        ],
      },
    });
  });

  const featureCollection = {
    type: "FeatureCollection",
    features: features,
  };
  // console.log("Generated feature collection:", featureCollection);
  return featureCollection;
}
