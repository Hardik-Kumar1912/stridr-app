import { fetchDestPOIs } from "../../pois/fech-dest-pois.js";
import { getDestFeatureCollection } from "./destFeatureCollection.js";

import { getDestRoute } from "./getDestRoute.js";

export async function destRouteController(req, res , next) {
  console.log("Received request to modify route");
  const { user_location_cords, dest_location_cords, priorities } =
    await req.json();

  console.log("User location coordinates:", user_location_cords);
  console.log("Destination location coordinates:", dest_location_cords);
  if (!user_location_cords || !dest_location_cords) {
    res.json(
      {
        error:
          "Invalid request: user_location_cords and dest_location_cords are required",
      },
      { status: 400 }
    );
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
