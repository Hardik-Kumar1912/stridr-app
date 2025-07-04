import { Request, Response } from "express";

export async function reverseGeocodeController(
  request: Request,
  response: Response
) {
  const { lat, lon } = request.query;
  if (!lat || !lon) {
    return response
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }
  console.log(lat, lon);
  const LOCATION_IQ_API_KEY =
    process.env.LOCATION_IQ_API_KEY || "pk.aafa7ce830181f66da2791c9b83cc082";
  const res = await fetch(
    `https://us1.locationiq.com/v1/reverse?key=${LOCATION_IQ_API_KEY}&lat=${lat}&lon=${lon}&format=json&`
  );
  const data = await res.json();
  const address = data.display_name || `${lat}, ${lon}`;
  console.log("Address:", address);
  response.json({ address });
}
