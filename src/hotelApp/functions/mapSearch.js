import getActivePolygons from "./getActivePolygons";
import generateHotelArray from "./generateHotelArray";
import getHotelsInBbox from "./getHotelsInBbox";
import getBboxCityPolygons from "./getBboxCityPolygons";
import shuffleArray from "./shuffleArray";
import getCityRadius from "./getCityRadius";
import booleanIntersects from "@turf/boolean-intersects";
import bboxPolygon from "@turf/bbox-polygon";
import area from "@turf/area";
import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import circle from "@turf/circle";
import intersect from "@turf/intersect";
import cityData from "../data/cityData.json";

// mimics server code which updates search results in response to the map moving (either when there is a drag or zoom event)

const mapSearch = (
  searchKey,
  newMapParameters,
  prevHotelArray,
  searchType,
  finalPageHotels
) => {
  console.log("searchKey: " + JSON.stringify(searchKey))
  console.log("searchType: " + JSON.stringify(searchType))
  console.log("finalPageHotels: " + JSON.stringify(finalPageHotels))
  console.log("prevHotelArray: " + JSON.stringify(prevHotelArray))
  console.log("newMapParameters: " + JSON.stringify(newMapParameters))
  const mapBboxSearch = (north, east, south, west) => {
    const bbox = [west, south, east, north];
    console.log(
      "west: " + west + "south: " + south + "east: " + east + "north: " + north
    );

    // generate a turf polygon represenataion of map boundary box
    const bboxPoly = bboxPolygon(bbox);
    // calculate pixel area of map on screen
    const bboxAreaPx = mapBox.width * mapBox.height;
    // calculate km2 area of map on screen
    const bboxAreaKm = Math.round(area(bboxPoly) / 1000000);

    // add padding to boundary box (to prevent markers from overflowing the edge of the map)
    // calc longitude padding
    let ewDiff = east - west;
    if (ewDiff < 0) {
      ewDiff = 360 - ewDiff;
    }
    const mapContainerWidthPx = newMapParameters.box.width;
    const lngPaddingPx = 50;
    const lngPaddingDegrees = (ewDiff * lngPaddingPx) / mapContainerWidthPx;
    // calc north padding
    let northCenterDiff = north - newMapParameters.center.lat();
    const halfContainerHeightPx = newMapParameters.box.height / 2;
    const latPaddingPx = 25;
    const northPaddingDegrees =
      (northCenterDiff * latPaddingPx) / halfContainerHeightPx;

    // calc south padding
    let centerSouthDiff = newMapParameters.center.lat() - south;
    const southPaddingDegrees =
      (centerSouthDiff * latPaddingPx) / halfContainerHeightPx;

    // boundary box with padding subtracted [W,S,E,N] - used for positioning new hotels on the map
    const paddedBbox = [
      west + lngPaddingDegrees,
      south + southPaddingDegrees,
      east - lngPaddingDegrees,
      north - northPaddingDegrees,
    ];

    // expanded map boundary box (expanded by 0.4degrees, /40km) which is used to capture cities which may expand onto the bbox but bave a centre point outside the bbox
    const expandedBbox = [west - 0.4, south - 0.4, east + 0.4, north + 0.4];
    // generate a turf polygon represenataion of expanded map boundary box
    const expandedBboxPoly = bboxPolygon(expandedBbox);

    // (1) identifies and generates array of cities which fall inside or intersect with the map boundary box
    // (2) calculates total population of cities which fall inside or intersect with the map boundary box (used to calc number of hotels)
    let activeCities = [];
    let totalPopulation = 0;
    for (let i = 0; i < cityData.features.length; i++) {
      const cityPoint = point(cityData.features[i].geometry.coordinates);

      // if city coords are inside map boundary box: (1) city is added to array; (2) population is added to total population (as a proportion if only part of the city is inside)
      if (booleanPointInPolygon(cityPoint, bboxPoly)) {
        activeCities.push(cityData.features[i]);
        const cityRadius = getCityRadius(
          cityData.features[i].properties.pop_max
        );
        const cityCircle = circle(cityPoint, cityRadius);
        if (booleanIntersects(cityCircle, bboxPoly)) {
          const intersectingArea = intersect(bboxPoly, cityCircle);
          const cityCircleKm = area(cityCircle);
          const intersectingAreaKm = area(intersectingArea);
          const proportionInside = intersectingAreaKm / cityCircleKm;
          const populationInside =
            proportionInside * cityData.features[i].properties.pop_max;
          totalPopulation = totalPopulation + populationInside;
        } else {
          totalPopulation =
            totalPopulation + cityData.features[i].properties.pop_max;
        }
      }
      // if city coords fall between the map boundary box and the expanded boundary box, the city area is tested to see if any falls within boundary box. If true, the city is added to array the population for the segment of the city which is inside the boundary box is added to population
      if (
        booleanPointInPolygon(cityPoint, expandedBboxPoly) &&
        !booleanPointInPolygon(cityPoint, bboxPoly)
      ) {
        const cityRadius = getCityRadius(
          cityData.features[i].properties.pop_max
        );
        const cityCircle = circle(cityPoint, cityRadius);
        if (booleanIntersects(cityCircle, bboxPoly)) {
          activeCities.push(cityData.features[i]);
          const intersectingArea = intersect(bboxPoly, cityCircle);
          const cityCircleKm = area(cityCircle);
          const intersectingAreaKm = area(intersectingArea);
          const proportionInside = intersectingAreaKm / cityCircleKm;
          const populationInside =
            proportionInside * cityData.features[i].properties.pop_max;
          totalPopulation = totalPopulation + populationInside;
        }
      }
    }
    // calculates number of hotels returned by search - one for each 10,000 city population
    newNumberHotels = Math.ceil(totalPopulation / 10000);

    // calculates number of pages returned by search - 18 hotels per page, capped at 15 pages
    newMaxPages = Math.ceil(newNumberHotels / 18);
    if (newMaxPages > 15) {
      newMaxPages = 15;
    }

    // returns array of data for the most populous cities (18 max) from the activeCities array
    const cityPolygons = getBboxCityPolygons(paddedBbox, activeCities);

    // generates array of hotels from previous search results which fall within the map boundaries of the new search (these will remain as search results and will not be deleted from the results list / map)
    console.log("paddedBbox: " + paddedBbox)
    let existingHotelArray = getHotelsInBbox(prevHotelArray, paddedBbox);
    console.log("existingHotelArray: " + existingHotelArray.length)

    // clears existing hotel array if map search has been generated by zoom out
    if (newMapParameters && newMapParameters.prevZoom > newMapParameters.zoom) {
      existingHotelArray = [];
    }

    const existingHotelsCount = existingHotelArray.length;

    if (existingHotelsCount > newNumberHotels) {
      newNumberHotels = existingHotelsCount;
    }

    newHotelArray = [...existingHotelArray];
    console.log("newHotelArray: " + JSON.stringify(newHotelArray)) // create object which contains data on the number of existing hotels in each city (used to calculate the number of additional hotels which can be added in each city)
    let cityHotelNumbers = {};
    for (let i = 0; i < existingHotelArray.length; i++) {
      if (existingHotelArray[i].cityName) {
        if (cityHotelNumbers[existingHotelArray[i].cityName]) {
          cityHotelNumbers[existingHotelArray[i].cityName]++;
        } else {
          cityHotelNumbers[existingHotelArray[i].cityName] = 1;
        }
      }
    }

    // calculates number of hotels to be returned by search (default 18 for a page)
    let maxHotels = 18;
    // if total number of hotels is less than 18, number of hotels is adjusted down accordingly
    if (newNumberHotels < 18) {
      maxHotels = newNumberHotels;
    }
    // if search is for final page, number is adjusted down to a pre-determined amount
    if (finalPageHotels) {
      maxHotels = finalPageHotels;
    }
    // array of hotels is generated for each city and added to newHotels array (which is returned by search)
    if (maxHotels > 0) {
      for (let i = 0; i < cityPolygons.length; i++) {
        // number of pixels on map occupied by city
        const cityPx = (cityPolygons[i].areaOuter / bboxAreaKm) * bboxAreaPx;
        // number of hotels which can be displyed on cityPx (one per 1500px)
        let totalHotelsInCity = Math.ceil(cityPx / 1000);
        // number of hotels currently displayed for city (which were returned by previous search and have not been deleted)
        const currentHotelsInCity = cityHotelNumbers[cityPolygons[i].name]
          ? cityHotelNumbers[cityPolygons[i].name]
          : 0;
        // net number of new hotels which have to be added for city
        let newHotelsInCity = totalHotelsInCity - currentHotelsInCity;
        // maximum new hotels which can be added to array (18 max per page)
        let maxNewHotels = maxHotels - newHotelArray.length;
        // if new hotels will cause newHotelArray to exceed maximum, number of new hotels for city is adjusted down
        if (newHotelsInCity > maxNewHotels) {
          newHotelsInCity = maxNewHotels;
        }
        // genrates array of new hotels for city
        const cityHotelArray = generateHotelArray(
          cityPolygons[i].name,
          newHotelArray,
          newHotelsInCity,
          cityPolygons[i].polygonsOuter,
          paddedBbox
        );
        // array of new hotels added to array of hotels to be returned by search
        newHotelArray.push(...cityHotelArray);
        // if newHotelArray equals or exceeds max hotel number looping is stopped
        if (newHotelArray.length >= maxHotels) {
          break;
        }
      }
    }
    // if there is a shortfall of hotles (i.e. the number of hotels in newHotelarray is less than required), some hotels are randomly generated within the map boundary to fill the gap
    let hotelShortfall = maxHotels - newHotelArray.length;

    if (hotelShortfall > 0) {
      const randomHotelArray = generateHotelArray(
        false,
        [],
        hotelShortfall,
        activePolygons,
        paddedBbox
      );
      newHotelArray.push(...randomHotelArray);
    }

    // if search typs is "update page" newMaxPages, newNumberHotels, newActivePage are set to false as these values do not need to be updated
    if (searchType === "updatePage") {
      newMaxPages = false;
      newNumberHotels = false;
      newActivePage = false;
    }

    // shafflles array of hotels returned by search
    // shuffleArray(newHotelArray);
console.log("newHotelArray: " + JSON.stringify(newHotelArray))
console.log("newHotelArray.length: " + JSON.stringify(newHotelArray.length))
    let newSearchData = {
      searchKey: searchKey,
      hotelArray: newHotelArray,
      mapBbox: false,
      numberHotels: newNumberHotels,
      maxPages: newMaxPages,
      activePage: newActivePage,
      existingHotelArray: existingHotelArray,
    };

    return newSearchData;
  };

  // map position on screen
  const mapBox = newMapParameters.box;
  // generates array of polygons which fall within the map bounds
  const activePolygons = getActivePolygons(newMapParameters.bounds);

  // initialise search return variables
  let newHotelArray = [];
  let newMaxPages = 0;
  let newNumberHotels = 0;
  let newActivePage = 1;

  // define map boundary box from google map bounds supplied as argument
  let bboxNorth = newMapParameters.bounds.toJSON().north;
  let bboxEast = newMapParameters.bounds.toJSON().east;
  let bboxSouth = newMapParameters.bounds.toJSON().south;
  let bboxWest = newMapParameters.bounds.toJSON().west;

  let newSearchResults;

  const ewDiff = bboxEast - bboxWest;
  if (ewDiff < 0) {
    const searchResults1 = mapBboxSearch(bboxNorth, 179, bboxSouth, bboxWest);
    const searchResults2 = mapBboxSearch(bboxNorth, bboxEast, bboxSouth, -179);
    let combinedHotels =
      searchResults1.numberHotels + searchResults2.numberHotels;
    let proportionHotels1 = searchResults1.numberHotels / combinedHotels;
    let proportionHotels2 = searchResults2.numberHotels / combinedHotels;

    let hotelslInArray = combinedHotels;
    if (combinedHotels > 18) {
      hotelslInArray = 18;
    }
    let numberHotels1 = Math.round(proportionHotels1 * hotelslInArray);
    if (searchResults1.hotelArray.length < numberHotels1) {
      numberHotels1 = searchResults1.hotelArray.length;
    }

    let numberHotels2 = hotelslInArray - numberHotels1;

    let combinedHotelArray = searchResults1.hotelArray.slice(0, numberHotels1);
    const hotelArrayFrag2 = searchResults2.hotelArray.slice(0, numberHotels2);
    combinedHotelArray.push(...hotelArrayFrag2);

    let combinedMaxPages = Math.ceil(combinedHotels / 18);
    if (combinedMaxPages > 15) combinedMaxPages = 15;

console.log("combinedHotelArray: " + JSON.stringify(combinedHotelArray))
    newSearchResults = {
      searchKey: searchKey,
      hotelArray: combinedHotelArray,
      mapBbox: false,
      numberHotels: combinedHotels,
      maxPages: combinedMaxPages,
      activePage: 1,
    };
  } else {
    newSearchResults = mapBboxSearch(bboxNorth, bboxEast, bboxSouth, bboxWest);
  }

  return newSearchResults;
};

export default mapSearch;
