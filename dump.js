
// calls server for initial data on page load
useEffect(() => {
  if (!navigateAway) {
  console.log("useEffect - load data1 ");
  setTimeout(() => {
    const searchData = {
      name: "Paris, France",
      type: "city",
    };

    let savedMapData = {};

    if (mapContainer.current) {
      savedMapData.box = mapContainer.current.getBoundingClientRect();
    }

    const initSearchResults = locationSearch(
      "initSearchKey",
      searchData,
      savedMapData
    );
    console.log("initSearchResults: " + JSON.stringify(initSearchResults));

    // updates map boundary box (for location search when map will move in response to search results)
    dispatch(updateMapBbox(initSearchResults.mapBbox));
    // sets number of hotels for initial search
    dispatch(updateNumberHotels(initSearchResults.numberHotels));
    // sets number of maxPages for initial search
    dispatch(updateMaxPages(initSearchResults.maxPages));

    setDataLoading(false);
    setFirstLoad(false);

    const mapBbox = initSearchResults.mapBbox;

    fitMapBounds(mapBbox)

    // this check is included as useEffects load twice in development mode (and therefore data is loaded twice) - shouldn't be an issue in production but including as failsafe
    if (!initDataLoadedRef.current) {
      console.log("useEffect - load data2");
      // updates hotel data array
      dispatch(updateHotelArray(initSearchResults.hotelArray));
      hotelArrayRef.current = initSearchResults.hotelArray;
      updateMarkers(initSearchResults.hotelArray);
      initDataLoadedRef.current = true;
    }
  }, 1000);
} else {
  console.log("NAVIGATED AWAY")
  // renderMap()
const mBbox = [2.01126938814827,48.63326222533798,2.6947155349301575,49.082922407200236]
dispatch(updateNavigateAway(false));
  //fitMapBounds(mBbox)
}
}, [dispatch]);




////////////


// creates google map LatLng object for NE of country bbox
const bound1 = new window.google.maps.LatLng(mapBbox[1], mapBbox[0]);
// creates google map LatLng object for SW of country bbox
const bound2 = new window.google.maps.LatLng(mapBbox[3], mapBbox[2]);
// initialises new LatLngBounds() google map object
let countryBounds = new window.google.maps.LatLngBounds();
// adds NE coords to countryBounds
countryBounds.extend(bound1);
// adds SW coords to countryBounds
countryBounds.extend(bound2);
// fits map to countryBounds with padding added
map.fitBounds(countryBounds, {
  top: 20,
  bottom: 20,
  left: 40,
  right: 40,
});




const makeServerCall = (type, searchData) => {
  console.log("makeServerCall1")
  if (!firstLoad) {
    let serverRoute;

    const initialiseSearch = (newSearchKey) => {
      // sets data loading which turns on loader icon and greys out results in searchList
      setDataLoading(true);
      // stores key for search
      setLatestSearchKey(newSearchKey);
      // scrolls back to top of resultsList when searchData is returned
      window.scrollTo(0, 0);
    };

    // hadles data object returned from server, updating state for which data has been returned
    const fulfilServerCall = (newSearchResults) => {
      // search key for server response must match most recent searchkey stored locally - this is to avoid state being updated with data from search calls which have been superceded
      if (newSearchResults.searchKey === searchKeyRef.current) {
        // update markerStateObject when hotelArray is updated
        const newHotelArray = [...newSearchResults.hotelArray];
        let newArrayKeys = {};
        // loop through new  HotelArray, creating an aobject with keys
        for (let i = 0; i < newHotelArray.length; i++) {
          newArrayKeys[newHotelArray[i].key] = true;
        }
        let newMarkerStateObject = {};
        let newActiveMarker = false;
        // loop through previous markerStateObject - if match newArray keys, retain that key in marker State object
        for (let [key] of Object.entries(markerStateObject)) {
          if (newArrayKeys[key]) {
            newMarkerStateObject[key] = true;
            if (activeMarker === key) {
              newActiveMarker = key;
            }
          }
        }

        dispatch(updateActiveMarker(newActiveMarker));
        dispatch(refreshMarkerStateObject(newMarkerStateObject));
        dispatch(updateHotelArray(newSearchResults.hotelArray));

        // updates map boundary box (for location search when map will move in response to search results)
        if (newSearchResults.mapBbox) {
          // setMapBbox(newSearchResults.mapBbox);
          dispatch(updateMapBbox(newSearchResults.mapBbox));
        }
        // sets number of hotels for current search "typeof" used as a zero response is also falsey
        if (typeof newSearchResults.numberHotels === "number") {
          //setNumberHotels(newSearchResults.numberHotels);
          dispatch(updateNumberHotels(newSearchResults.numberHotels));
        }
        // sets number of maxPages for current search "typeof" used as a zero response is also falsey
        if (typeof newSearchResults.maxPages === "number") {
          // setMaxPages(newSearchResults.maxPages);
          dispatch(updateMaxPages(newSearchResults.maxPages));
        }
        // resets search page (i.e. sets page to 1)
        if (newSearchResults.activePage) {
          // setActivePage(newSearchResults.activePage);
          dispatch(updateActivePage(newSearchResults.activePage));
        }
        setDataLoading(false);
        if (firstLoad) {
          setFirstLoad(false);
        }
      }
    };
    // handles server calls initiated by map movements ("idle google map event handler")
    if (type === "map") {
      if (!onloadSearchRef.current) {
        if (navigateAway) {
          setRefreshMarkers(true);
          setFirstLoad(false);
        } else {
          // adds previous zoom level to search object
          if (savedMapData) {
            searchData.prevZoom = savedMapData.zoom;
          }

          // updates savedMapData with latest search data
          let prevHotelArray = hotelArray;
          // if not first load searchLocation set to "map search" . If firstLoad searchLocation remains unchanged and prevHotelArray is set to false (to avoid init dummy variables being sent to server)
          if (firstLoad) {
            prevHotelArray = [];
          } else {
            //setSearchLocation({ name: "map area" });
            dispatch(updateSearchLocationRedux({ name: "map area" }));
            window.history.pushState(
              "object or string",
              "Title",
              "/hotel-app/"
            );
          }
          // generates unique key and calls initialise search function
          const newSearchKey = generateKey();
          initialiseSearch(newSearchKey);
          // sets up route (function mimics REST API POST call) for map search server call
          serverRoute = mapSearch(newSearchKey, searchData, prevHotelArray);
        }
      } else {
        // onloadSearchRef.current = false
      }
    }
    // handles server calls initiated by user selecting option from location dropdown menu
    else if (type === "location") {
      if (!onloadSearchRef.current) {
        window.history.pushState(
          "object or string",
          "Title",
          "/hotel-app/?" + searchData.type + "=" + searchData.name
        );
      }
      // boolean which prevents map search being triggered by map movement caused by change of location
      locationSearchCurrentRef.current = true;
      // generates unique key and calls initialise search function
      const newSearchKey = generateKey();
      initialiseSearch(newSearchKey);
      // sets up route (function mimics REST API POST call) for location search server call
      serverRoute = locationSearch(newSearchKey, searchData, savedMapData);
    }
    // handles server calls initiated by user selecting a new page from the pagination nav
    else if (type === "updatePage") {
      // generates unique key and calls initialise search function
      const newSearchKey = generateKey();
      initialiseSearch(newSearchKey);
      const newPageNumber = searchData;
      let finalPageHotels = false;
      // if page specified by search is the max page posiible, the number of results for the final page is calculated and sent as an argument (inreality this would prob happen server side)
      if (maxPages === newPageNumber) {
        // if greater than 15*18 (max number of hotels which can be seen due to 15 page max, the number of hotles on the final page is set the max, which is 18)
        if (numberHotels > 269) {
          finalPageHotels = 18;
        }
        // if total number of hotles is below 270, the number of hotels which will appear in the final page is calculated
        else {
          finalPageHotels = numberHotels - (maxPages - 1) * 18;
        }
      }
      // sets up route (function mimics REST API POST call) for update page search
      serverRoute = updatePageSearch(
        newSearchKey,
        searchLocation,
        savedMapData,
        finalPageHotels
      );
    }
    // handles server calls initiated by user clicking on nav search icon
    else if (type === "searchRefresh") {
      // generates unique key and calls initialise search function
      const newSearchKey = generateKey();
      initialiseSearch(newSearchKey);
      // sets up route (function mimics REST API POST call) for search refresh search
      serverRoute = searchRefreshSearch(
        newSearchKey,
        searchLocation,
        savedMapData,
        hotelArray
      );
    }
    //
    const makeServerCall = new Promise((resolve) => {
      setTimeout(() => {
        resolve(serverRoute);
      }, 1000);
    });

    makeServerCall.then((value) => fulfilServerCall(value));
  }
};

//////////////////////////////

// creates new pill marker - markerData argument contains the hotel data (element from hotelArray)
const addPillMarker = (markerData) => {
  const createNewMarker = () => {
    function pillMarkerContent(markerData) {
      // initialise variables for pill marker inline styling (white background, dark text)
      let pillBackground = "#FFFFFF";
      let pillColor = "#222222";
      let pillzIndex = 0;
      let pillBoxShadow =
        "rgba(255, 255, 255, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 2px 4px";

/*
        // if marker key matches with markerStateObject (redux store of highlighted markers), styling set to "prev clicked"
        if (markerStateObject[markerData.key]) {
          pillBackground = "#EBEBEB";
          pillBoxShadow = "0 0 0 1px #B0B0B0 inset"
        }

        // if marker key matches with markerStateObject (redux store of highlighted markers), styling set to "prev clicked"
        if (activeMarker === markerData.key) {
          pillBackground = "black";
          pillColor = "white";
          pillzIndex = 1
        }
        */

      // initialises pill marker html render
      const content = document.createElement("div");

      // sets pill marker html render
      content.innerHTML = `
      <div style="transform: translate(calc(-50% + 0px), calc(50% + 0px)); transition: transform 0.2s ease 0s; left: 50%; position: absolute; bottom: 0px; z-index: ${pillzIndex}; pointer-events: auto; font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif;">
        <button
          class="czgw0k9 dir dir-ltr"
          style="color: inherit; border: medium none; margin: 0px; padding: 0px; background: transparent; width: auto; overflow: visible; font: inherit;"
          data-veloute="map/markers/BasePillMarker"
        >
          <div
            class=" dir dir-ltr"
            style="--content-mini-box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18), 0px 0px 0px 1px rgba(0, 0, 0, 0.08); align-items: center; cursor: pointer; display: flex; height: 28px; position: relative; transform: scale(1); transform-origin: 50% 50% 0px; transition: transform 150ms ease 0s;"
          >
            <div class="${markerData.key}" style="background-color: ${pillBackground}; border-radius: 28px; box-shadow: ${pillBoxShadow}; color: ${pillColor}; height: 28px; padding: 0px 8px; position: relative; transform: scale(1); transform-origin: 50% 50% 0px; transition: transform 300ms cubic-bezier(0, 0, 0.1, 1) 0s;">
              <div style="align-items: center; display: flex; height: 100%; justify-content: center; opacity: 1; transition: opacity 300ms cubic-bezier(0, 0, 0.1, 1) 0s; white-space: nowrap;">
                <span
                  class="t5u4927 dir dir-ltr"
                  aria-label="Map marker of the listing: £695, "
                >
                  £${markerData.price}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
      `;

      return content;
    }
    // creates new google maps advanced marker object
    const newMarker = new window.google.maps.marker.AdvancedMarkerView({
      map,
      content: pillMarkerContent(markerData),
      position: markerData.coords,
    });

    // if this pillMarker is stored as the current activeMarker, a large marker is added - this is required to maintain map state when navigating back and forth between the seach page and hotel pages
    if (activeMarker === markerData.key) {
      // addLargeMarker(markerData);
      // largeMarkerRef.current = { marker: newMarker, markerData: markerData };
    }

    // creates large marker (which shows photo and more detail for hotel) when pill marker is clicked
    newMarker.addListener("gmp-click", (event) => {
      // clickPill(markerData, newMarker);
      // addLargeMarker(markerData);
      // update markerStateObject in redux

      // dispatch(updateMarkerStateObject(markerData.key));
      // dispatch(updateActiveMarker(markerData.key));
    });

    const element = newMarker.element;

    // pointer enter listener which highlights pill marker when mouse hovers over
    ["focus", "pointerenter"].forEach((event) => {
      element.addEventListener(event, () => {
        // highlight(newMarker, markerData);
      });
    });

    // pointer leave listener which highlights pill marker when mouse hovers over
    ["blur", "pointerleave"].forEach((event) => {
      element.addEventListener(event, () => {
        // unhighlight(newMarker, markerData);
      });
    });

    // pushes object containing markerData and google maps marker object to markers array
    markers.push({ marker: newMarker, markerData: markerData });
  };

  createNewMarker();

  // create new marker is called with random delay & timeout creates impression of loading from server
  /*
  let randomDelay = randomNumberInRange(200, 1000);
  if (navigateAway) {
    randomDelay = 0;
  }
  setTimeout(() => {
    createNewMarker();
  }, randomDelay);
  */
};

///////////

// creates new google map object and event listeners etc
const renderMap = (mapBbox, hotelArray) => {
  // parameters for initial map center and zoom
  let mapCenter = {
    lat: 48.6,
    lng: 0,
  };

  if (mapBbox) {
    const aveLat = (mapBbox[1] + mapBbox[3]) / 2;
    const aveLng = (mapBbox[0] + mapBbox[2]) / 2;

    mapCenter = {
      lat: aveLat,
      lng: aveLng,
    };
  }

  let mapZoom = 15;
  // creates new google map object
  map = new window.google.maps.Map(document.getElementById("map"), {
    mapId: "4504f8b37365c3d0",
    disableDefaultUI: true,
    gestureHandling: "greedy",
    mapTypeId: "terrain",
  });

  /*

  // creates google map LatLng object for NE of country bbox
  const bound1 = new window.google.maps.LatLng(mapBbox[1], mapBbox[0]);
  // creates google map LatLng object for SW of country bbox
  const bound2 = new window.google.maps.LatLng(mapBbox[3], mapBbox[2]);
  // initialises new LatLngBounds() google map object
  let countryBounds = new window.google.maps.LatLngBounds();
  // adds NE coords to countryBounds
  countryBounds.extend(bound1);
  // adds SW coords to countryBounds
  countryBounds.extend(bound2);
  // fits map to countryBounds with padding added
  map.fitBounds(countryBounds, {
    top: 20,
    bottom: 20,
    left: 40,
    right: 40,
  });

  // add hotel markers

  // pill markers added for elements of hotel array, with undeleted markers from previous hotel array filtered out
  for (let i = 0; i < hotelArray.length; i++) {
      addPillMarker(hotelArray[i]);
  }
  */


};
