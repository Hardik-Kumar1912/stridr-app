import { poiSyntax } from "../../utils/poiSyntax.js";
import { OverpassElement, Priority } from "../../types/types.js";

export async function fetchDestPOIs(
  [lon, lat]: [number, number],
  [lonDest, latDest]: [number, number],
  priorities: Priority[]
): Promise<[number, number][]> {
  if (!priorities || !Array.isArray(priorities) || priorities.length === 0) {
    return [];
  }
  if (process.env.NEXT_PUBLIC_DEBUGGING === "ON") {
    console.log(
      `Fetching POIs for route from ${lat}, ${lon} to ${latDest}, ${lonDest} with priorities: ${priorities.join(
        ", "
      )}`
    );
  }
  const overpassUrl = `https://overpass-api.de/api/interpreter`;
  const radius = 1000;

  const poiApiSource = poiSyntax({ radius, longitude: lon, latitude: lat });
  const poiApiDest = poiSyntax({
    radius,
    longitude: lonDest,
    latitude: latDest,
  });

  const query1 = `
  [out:json][timeout:25];
  (
    ${priorities.map((priority) => poiApiSource[priority]).join("\n")}
  );
  out center;
`;
  const query2 = `
  [out:json][timeout:25];
  (
    ${priorities.map((priority) => poiApiDest[priority]).join("\n")}
  );
  out center;
`;

  // I want to automate this and find pois every 2 km along the route
  // For now, I will just use the midpoint of the route as the center for the search
  // This is a simple approximation, but it should work for most cases

  // Only if the distance > 2 km, otherwise just use the destination POIs

  const distance = Math.sqrt(
    Math.pow(latDest - lat, 2) + Math.pow(lonDest - lon, 2)
  );

  let res3;
  if (distance > 2) {
    const [routeCentreLat, routeCentreLon] = [
      latDest + (latDest - lat) / 2,
      lonDest + (lonDest - lon) / 2,
    ];

    const poiApiMid = poiSyntax({
      radius,
      longitude: routeCentreLon,
      latitude: routeCentreLat,
    });

    const query3 = `
    [out:json][timeout:25];
    (
      ${priorities.map((priority) => poiApiMid[priority]).join("\n")}
      );
      out center;
      `;
    res3 = await fetch(overpassUrl, {
      method: "POST",
      body: query3,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  }
  const res1 = await fetch(overpassUrl, {
    method: "POST",
    body: query1,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const res2 = await fetch(overpassUrl, {
    method: "POST",
    body: query2,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const data1: { elements: OverpassElement[] } = await res1.json();
  const data2: { elements: OverpassElement[] } = await res2.json();
  let data3: { elements: OverpassElement[] } = { elements: [] };
  if (distance > 2 && res3) {
    data3 = await res3.json();
  }
  // console.log(`Fetched ${data.elements.length} POIs`);
  // console.log("----- POI Data -----");
  // console.log(data);
  // console.log("-------POI DATA END-------");
  //   return data.elements
  //     .map((el) => {
  //       if (el.lat != null && el.lon != null) {
  //         return [el.lat, el.lon]; // node
  //       } else if (el.center?.lat != null && el.center?.lon != null) {
  //         return [el.center.lat, el.center.lon]; // way/relation
  //       }
  //       return null;
  //     })
  //     .filter((coord) => coord !== null);
  return [
    ...data1.elements
      .map((el) => {
        if (el.lat != null && el.lon != null) {
          return [el.lat, el.lon]; // node
        } else if (el.center?.lat != null && el.center?.lon != null) {
          return [el.center.lat, el.center.lon]; // way/relation
        }
        return null;
      })
      .filter((coord): coord is [number, number] => Array.isArray(coord) && coord.length === 2),
    ...data2.elements
      .map((el) => {
        if (el.lat != null && el.lon != null) {
          return [el.lat, el.lon]; // node
        } else if (el.center?.lat != null && el.center?.lon != null) {
          return [el.center.lat, el.center.lon]; // way/relation
        }
        return null;
      })
      .filter((coord): coord is [number, number] => Array.isArray(coord) && coord.length === 2),
    ...data3.elements
      .map((el) => {
        if (el.lat != null && el.lon != null) {
          return [el.lat, el.lon]; // node
        } else if (el.center?.lat != null && el.center?.lon != null) {
          return [el.center.lat, el.center.lon]; // way/relation
        }
        return null;
      })
      .filter((coord): coord is [number, number] => Array.isArray(coord) && coord.length === 2),
  ];
}
