import { Request, Response } from "express";
import { fetchPOIs } from "../../pois/fetch-pois.js";
import { getFeatureCollection } from "./featureCollection.js";
import { getRoute } from "./getRoute.js";
import { FeatureCollectionArea } from "../../../types/types.js";

export async function roundRouteController(req: Request, res: Response): Promise<void> {
  const { user_location_cords, route_distance, priorities } = req.body;
  if (!user_location_cords || !route_distance) {
    res.status(400).json({
      error:
        "Invalid request: user_location_cords and route_distance are required",
    });
    return;
  }
  if (process.env.NEXT_PUBLIC_DEBUGGING === "ON") {
    console.log(
      `Received request with user_location_cords: ${user_location_cords}, route_distance: ${route_distance}, priorities: ${priorities}`
    );
    console.log(
      `Type of user_location_cords: ${typeof user_location_cords}, Type of route_distance: ${typeof route_distance}`
    );
    console.log(`Type of priorities: ${typeof priorities}`);
  }
  const pois = await fetchPOIs(
    user_location_cords,
    route_distance / 2,
    priorities
  );
  const featureCollection = await getFeatureCollection(pois);
  const route = await getRoute(
    user_location_cords,
    route_distance,
    pois.length,
    featureCollection
  );

  res.json({ route });
}
