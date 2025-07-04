import { Request, Response, NextFunction } from "express";

export async function forwardGeocodeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const place = req.query.place as string;

  if (!place) {
    res.status(400).json({ error: "Missing 'place' parameter" });
    return;
  }

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_IQ_API_KEY}&q=${encodeURIComponent(place)}&format=json`
    );
    const data = await response.json();

    if (!data || !data[0]) {
      res.status(404).json({ error: "No coordinates found" });
      return;
    }

    const latitude = parseFloat(data[0].lat);
    const longitude = parseFloat(data[0].lon);
    res.json({ coords: [longitude, latitude] });
  } catch (err) {
    console.error("Geocoding error:", err);
    res.status(500).json({ error: "Failed to geocode place" });
  }
}