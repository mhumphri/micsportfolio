import getCountryPolygons from "./getCountryPolygons";
import getCityPolygon from "./getCityPolygon";
import generateHotelArray from "./generateHotelArray";
import bbox from "@turf/bbox";

// updates search results in response to the map moving (either when there is a drag or zoom event )
const locationSearch = (searchKey, locationData, searchType, finalPageHotels) => {
  // initialise search return variables
  let newHotelArray = [];
  let newMaxPages = 0;
  let newNumberHotels = 0;
  let locationBbox = false;
  let newActivePage = 1

  let locationPolygons = []


  if (locationData.type==="city") {
    console.log("city search")
const cityPolygons = getCityPolygon(locationData.name);
console.log("cityPolygon: " + JSON.stringify(cityPolygons))
locationBbox = bbox(cityPolygons.circleOuter);
// get total number of hotels in city
const population = cityPolygons.population
newNumberHotels = 106

if (population) {
  newNumberHotels = Math.round(population/10000)
}
console.log("population: " + population)
console.log("newNumberHotels: " + newNumberHotels)

newMaxPages = Math.ceil(newNumberHotels / 18);
if (newMaxPages > 15) {
  newMaxPages = 15;
}

let numberHotelsInner = 12
let numberHotelsOuter = 6



if (newNumberHotels<18) {
  numberHotelsInner = Math.round(newNumberHotels*2/3)
  numberHotelsOuter = newNumberHotels - numberHotelsInner
}
console.log("loacationSearchAA")
console.log("newMaxPages: " + newMaxPages)

// if search is returning results for last page this calculates and sets the number of search results that will appear (possibly less than the default 18)
if (finalPageHotels) {

  numberHotelsInner = Math.round(finalPageHotels*2/3)
  numberHotelsOuter = finalPageHotels - numberHotelsInner
}

console.log("locationBbox: " + JSON.stringify(locationBbox))
const newHotelArrayOuter = generateHotelArray("cityName", [], numberHotelsOuter, cityPolygons.polygonsOuter, locationBbox, true)
const newHotelArrayInner = generateHotelArray("cityName", [], numberHotelsInner, cityPolygons.polygonsInner, locationBbox, true)
newHotelArray = newHotelArrayOuter.concat(newHotelArrayInner);


  }
  else if (locationData.type==="country") {
    console.log("country search")
    // get polygons for country
    const locationPolygons = getCountryPolygons(locationData.name);
    console.log("locationPolygons COUNTRY: " + JSON.stringify(locationPolygons))
    // get bbox for country
    locationBbox = bbox(locationPolygons);



    console.log("locationBbox: " + JSON.stringify(locationBbox))
    //


    console.log("newHotelArray: " + JSON.stringify(newHotelArray))

    //

newHotelArray = generateHotelArray("cityName", [], 18, [locationPolygons], locationBbox, true)
//  shuffleArray(newHotelArray);

  }



  if (searchType==="updatePage") {
    newMaxPages = false;
    newNumberHotels = false;
    locationBbox = false;
    newActivePage = false;
  }




  let newSearchData = {
    searchKey: searchKey,
    hotelArray: newHotelArray,
    mapBbox: locationBbox,
    numberHotels: newNumberHotels,
    maxPages: newMaxPages,
    activePage: newActivePage,
  };

  return newSearchData;
};

export default locationSearch;
