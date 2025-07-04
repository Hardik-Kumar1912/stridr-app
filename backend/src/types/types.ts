export interface FeatureCollectionArea {
  id: string;
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export type Priority =
  | "parks"
  | "forest"
  | "water"
  | "touristic"
  | "resting"
  | "cafe"
  | "medical";

export type OverpassElement = {
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    [key: string]: any;
  };