import countryPolygons from "../data/countryPolygons.json";
import randomNumberInRange from "./randomNumberInRange";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { randomPoint } from "@turf/random";
import bbox from "@turf/bbox";
import { multiPolygon, polygon } from "@turf/helpers";
import area from "@turf/area";
import circle from "@turf/circle";
import intersect from "@turf/intersect";

const getRandomCoords = (activePolygons, paddedBbox, locationSearch) => {
  // step 1 - select random (with weightings to account for land mass) element from active land polygon array

  // step 1a - calculate total land mass
  let totalArea = 0;
  for (let i = 0; i < activePolygons.length; i++) {
    totalArea += area(activePolygons[i]);
  }

  // step 1b - randomly select a number bewteen zero and total area and take the polygon at that point in the distribution
  const randomArea = randomNumberInRange(0, totalArea);

  let currentElement = 0;
  let areaSum = 0;
  for (let i = 0; i < activePolygons.length; i++) {
    areaSum += area(activePolygons[i]);
    if (areaSum >= randomArea) {
      break;
    } else {
      currentElement += 1;
    }
  }



  const randomLandPoly = activePolygons[currentElement];

  // step 2 - calculate border box around selected polygon

  const randomLandBbox = bbox(randomLandPoly);

  const marginCheck = (testPoint) => {
    let checkResult;


    if (locationSearch) {
      checkResult = true;
    } else {
      const testPointLng = testPoint.geometry.coordinates[0];
      const testPointLat = testPoint.geometry.coordinates[1];

      // range of lng and lat for new map boundary box
      const boundSouth = paddedBbox[1];
      const boundNorth = paddedBbox[3];
      const boundWest = paddedBbox[0];
      const boundEast = paddedBbox[2];

      if (
        testPointLat > boundSouth &&
        testPointLat < boundNorth &&
        testPointLng > boundWest &&
        testPointLng < boundEast
      ) {
        checkResult = true;
      }
    }

    return checkResult;
  };

  // step 3 - brute force coordinate verification with loop generating new coordinate within boundary box and chancks to make sure it is inside land polygon. If it is not, a new coordinate is generated

  let verifiedPoint;

  for (let i = 0; i < 100; i++) {
    let newPoint = randomPoint(1, { bbox: randomLandBbox });
    newPoint = newPoint.features[0];
    if (
      booleanPointInPolygon(newPoint, randomLandPoly) &&
      marginCheck(newPoint)
    ) {
      verifiedPoint = newPoint;
      break;
    }
    if (i === 99) {
      verifiedPoint = newPoint;
      break;
    }
  }

  // step 4 - determine what country point is inside

  let countryName;
  //loop through country polygons until a match is found
  for (let i = 0; i < countryPolygons.features.length; i++) {
    let countryPoly;
    // retrieve polygon of multiPolygon from geojson file and convert to turf feature
    if (countryPolygons.features[i].geometry.type === "MultiPolygon") {
      countryPoly = multiPolygon(
        countryPolygons.features[i].geometry.coordinates
      );
    } else {
      countryPoly = polygon(countryPolygons.features[i].geometry.coordinates);
    }

    // returns true if point falls within country polygon
    if (booleanPointInPolygon(verifiedPoint, countryPoly)) {
      countryName = countryPolygons.features[i].properties.NAME;
      break;
    }
  }

  // if no match for country (beacuse land polygon file is a bit imprecise on coastlines) a circle is generated around point and then compared against country polygons
  if (!countryName) {
    var center = verifiedPoint;
    var radius = 40;
    // generates circle polygon with 40km radius
    var circleAroundPoint = circle(center, radius);
    //loop through country polygons until a match is found
    for (let i = 0; i < countryPolygons.features.length; i++) {
      let countryPoly;
      // retrieve polygon of multiPolygon from geojson file and convert to turf feature
      if (countryPolygons.features[i].geometry.type === "MultiPolygon") {
        countryPoly = multiPolygon(
          countryPolygons.features[i].geometry.coordinates
        );
      } else {
        countryPoly = polygon(countryPolygons.features[i].geometry.coordinates);
      }
      // returns true if country polygon and circle around point intersect
      if (intersect(countryPoly, circleAroundPoint)) {
        countryName = countryPolygons.features[i].properties.NAME;
        break;
      }
    }
  }

  return {
    coords: {
      lng: verifiedPoint.geometry.coordinates[0],
      lat: verifiedPoint.geometry.coordinates[1],
    },
    country: countryName,
  };
};

export default getRandomCoords;
