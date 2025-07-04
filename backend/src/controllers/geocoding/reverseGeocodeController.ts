import { Request, Response } from "express";

export async function reverseGeocodeController(
  request: Request,
  response: Response
) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lon");
  console.log(latitude, longitude);
  const LOCATION_IQ_API_KEY =
    process.env.LOCATION_IQ_API_KEY || "pk.aafa7ce830181f66da2791c9b83cc082";
  const res = await fetch(
    `https://us1.locationiq.com/v1/reverse?key=${LOCATION_IQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json&`
  );
  const data = await res.json();
  const address = data.display_name || `${latitude}, ${longitude}`;
  console.log("Address:", address);
  response.json({ address });
}
