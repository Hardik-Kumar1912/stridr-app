import { fetchDestPOIs } from "../../pois/fech-dest-pois.js";
import { getDestFeatureCollection } from "./destFeatureCollection.js";
import { Request, Response } from "express";
import { getDestRoute } from "./getDestRoute.js";

export async function destRouteController(req: Request, res: Response) {
  console.log("Received request to modify route");
  const { user_location_cords, dest_location_cords, priorities } =
    req.body;

  console.log("User location coordinates:", user_location_cords);
  console.log("Destination location coordinates:", dest_location_cords);
  if (!user_location_cords || !dest_location_cords) {
    res.status(400).json({
      error:
        "Invalid request: user_location_cords and dest_location_cords are required",
    });
    return;
  }
  const pois = await fetchDestPOIs(
    user_location_cords,
    dest_location_cords,
    priorities
  );

  const featureCollection = await getDestFeatureCollection(pois);
  const route = await getDestRoute(
    user_location_cords,
    dest_location_cords,
    pois.length,
    featureCollection
  );

  console.log("Generated route:", route);

  res.json({ route });
}
