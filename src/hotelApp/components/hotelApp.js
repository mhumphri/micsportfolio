import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateNavigateAway,
  updateHotelArray,
  updateMapBbox,
  updateNumberHotels,
  updateMaxPages,
  updateActivePage,
  updateSearchLocationRedux,
  updateExpandMapView,
  refreshMarkerStateObject,
  updateActiveMarker,
  updateSavedMapData,
  updateMarkerStateObject,
} from "../../redux/hotelApp/hotelAppSlice";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";
import ResultsList from "./resultsList";
import HotelAppNav from "./hotelAppNav";
import LinkModal from "./linkModal";
import Footer from "./footer/footer";
import PopoutBoxSm from "./popoutBoxSm";
import generateKey from "../functions/generateKey";
import mapSearch from "../functions/mapSearch";
import locationSearch from "../functions/locationSearch";
import updatePageSearch from "../functions/updatePageSearch";
import searchRefreshSearch from "../functions/searchRefreshSearch";
import initialSearch from "../functions/initialSearch";
import { calcLngDiff } from "../functions/calcLngDiff";
import getHref from "../functions/getHref";
import "../css/hotelApp.css";
import "../css/resultsMap.css";

// homepage component for hotelApp - contains jsx for homepage and search/server comms logic

// scripts for loading google maps - needs to be outside the react component to prevent continuous re-rendering
var script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyAc2bVcp035eZ3dR3LrGjUfrR3pHkgmq68&callback=initMap&libraries=marker,places&v=beta";
script.async = true;
document.head.appendChild(script);

// holds google map object
let map;
// holds data and marker objects for current pill markers
let markers = [];

function HotelApp(props) {
  // redux hook for dispatching data to Redux
  const dispatch = useDispatch();
  // redux hook for navigating using React Router
  const navigate = useNavigate();
  // large view (boolean indicating if app currently in large view) and screen height (stored in redux)
  const largeView = useSelector((state) => state.deviceData.largeView);
  // viewport height (stored in redux)
  const screenHeight = useSelector((state) => state.deviceData.screenHeight);
  // viewport width (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);
  // array containg data for current search results (stored in redux)
  const hotelArray = useSelector((state) => state.hotelApp.hotelArray);
  // used to store current hotelArray - needed as function is called fromgoogle maps event handler (to avoid react state closure issue)
  const hotelArrayRef = useRef();
  // boolean showing true is user has navigated away to individual hotel page (used to prevent data reload when they navigate back)
  const navigateAway = useSelector((state) => state.hotelApp.navigateAway);
  // map data saved every time there is a map search - used for update page search
  const savedMapData = useSelector((state) => state.hotelApp.savedMapData);
  // holds latest map boundary box returned from server
  const mapBbox = useSelector((state) => state.hotelApp.mapBbox);
  // total number of hotels returned by search
  const numberHotels = useSelector((state) => state.hotelApp.numberHotels);
  // max number of search pages returned by search (capped at 15)
  const maxPages = useSelector((state) => state.hotelApp.maxPages);
  // stores currently active page (which is shown / controlled by paginationNav)
  const activePage = useSelector((state) => state.hotelApp.activePage);
  // stores currently active page (which is shown / controlled by paginationNav)
  const searchLocation = useSelector((state) => state.hotelApp.searchLocation);
  // boolean indicating if expanded map view is active
  const expandMapView = useSelector((state) => state.hotelApp.expandMapView);
  //
  const activeMarker = useSelector((state) => state.hotelApp.activeMarker);
  //
  const markerStateObject = useSelector((state) => state.hotelApp.markerStateObject);
  // params of the currently visible map (bounds, center, zoom and box (position on screen))
  const [mapParameters, setMapParameters] = useState();
  // Boolean indicating if first load of app is taking place - used to prevent searchLocation variable being set to "map area" when map bounds are first declared
  const [firstLoad, setFirstLoad] = useState(true);
  // Boolean indicating if markers on map need to be refreshed (due to user navigating back to search page)
  const [refreshMarkers, setRefreshMarkers] = useState();
  // react state mirror of largeMarkerRef - needed to control PopoutBoxSm which is a react component in small view (whereas the equivalent in large view is a google maps marker)
  const [largeMarker, setLargeMarker] = useState();
  // boolean set to true when new search data is loading
  const [dataLoading, setDataLoading] = useState(navigateAway ? false : true);
  // stores currently active page (which is shown / controlled by paginationNav)
  const [activeLink, setActiveLink] = useState();
  // stores hotel key if mouse currently hovering over in results list - used for highlighting pill marker on map
  const [hoverHotel, setHoverHotel] = useState();
  // boolean which indicates if text input / dropdown(large view) / search modal(small view) are open
  const [activeSearch, setActiveSearch] = useState();
  // holds key for latest search - used to filter out returns for older searches, if several are active simultaneously
  const [latestSearchKey, setLatestSearchKey] = useState();
  // used to store current version latestSearchKey - needed as function is called fromgoogle maps event handler (to avoid react state closure issue)
  const searchKeyRef = useRef();
  searchKeyRef.current = latestSearchKey;
  const locationSearchCurrentRef = useRef();
  //ref for map container - used to access position / dimensions of map containers

  const mapContainer = useRef(null);

  // boolean ref variable which is set to true when inital data is loaded from server - used in the case where google maps initalises after inital server response
  const initDataLoadedRef = useRef();
  // boolean ref variable which is set to true when initial map load takes place - used to prevent the first map load from triggering a map search
  const initMapLoadedRef = useRef();
  // boolean ref variables which are set to true if map is dragged or zoomed - used to determine in hotelArray update should be triggered when map bounds update
  const mapDraggedRef = useRef();
  const mapZoomedRef = useRef();
  // boolean ref which logs map zoom level - used to determine if uzser has zoomed out (which triggers a fresh set of hotels / map markers)
  const zoomLevelRef = useRef();
  // keeps log of currently active pill marker - used for styling
  const currentPillMarkerRef = useRef();
  // holds data and google map object for largeMarker
  const largeMarkerRef = useRef();
  // holds key for hotel which is currently being hovered over in  results list - used to highlight map marker for hotel
  const hoverHotelRef = useRef();

  // updates searchLocation in response to user input and sets searchLocationUpdate boolean to true
  const updateSearchLocation = (newLocation) => {
    dispatch(updateSearchLocationRedux(newLocation));
    makeServerCall("location", newLocation);
  };

  // boolean controlling visibility of map button (if page scrolled right down beyond limit of listcontainer, the button is not rendered)
  const [mapButtonActive, setMapButtonActive] = useState(true);
  // initialises css styles for search list outer container (needed for change of map view)
  const [searchListStyle, setSearchListStyle] = useState(
    expandMapView
      ? "fmdphkf fgnm67p f1lf7snk dir dir-ltr"
      : "fmdphkf dir dir-ltr"
  );
  // initialises css styles for map outer container (needed for change of map view)
  const [mapStyle, setMapStyle] = useState(
    expandMapView ? "m1ict9kd m1k84ca2 dir dir-ltr" : "m1ict9kd dir dir-ltr"
  );
  // ref for outer container of results list (used for controlling visibility of "show list" / "show map" button)
  const listContainerRef = useRef(null);
  const onloadSearchRef = useRef(null);

  // keeps log of most recent hotel which has been hovered over in the results list - used to disable styling when props.hoverHotel state changes
  const [mapLoaded, setMapLoaded] = useState();

  // sets pill marker styles to "currently active" (i.e dark background and white text)
  const setPillStyleCurrent = useCallback((markerKey) => {
    // creates css selector for a pill marker idenitifed by key
    const activeResultSelector = getMarkerSelector(markerKey);
    const markerObject = getMarkerObject(markerKey);
    // sets styles
    if (activeResultSelector) {
      activeResultSelector.style.backgroundColor = "black";
      activeResultSelector.style.color = "white";
      markerObject.element.style.zIndex = 1;
    }
  }, []);

  // sets pill marker styles to "previously active" (i.e shaded grey)
  const setPillStylePrev = useCallback((markerKey) => {
    // creates css selector for a pill marker idenitifed by key
    const prevResultSelector = getMarkerSelector(markerKey);
    // sets styles
    if (prevResultSelector) {
      prevResultSelector.style.backgroundColor = "#EBEBEB";
      prevResultSelector.style.color = "#222222";
      prevResultSelector.style.boxShadow = "0 0 0 1px #B0B0B0 inset";
    }
    // fetches marker object for previously active marker
    const prevMarkerObject = getMarkerObject(markerKey);
    // sets z-index css property for previously active marker
    if (prevMarkerObject) {
      prevMarkerObject.element.style.zIndex = 0;
    }
  }, []);

  // sets pill marker styles to initial style (i.e shaded grey)
  const setPillStyleInit = (markerKey) => {
    // creates css selector for a pill marker idenitifed by key
    const markerSelector = getMarkerSelector(markerKey);
    // sets styles
    if (markerSelector) {
      markerSelector.style.backgroundColor = "#FFFFFF";
      markerSelector.style.color = "#222222";
      markerSelector.style.boxShadow =
        "rgba(255, 255, 255, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 2px 4px";
    }
    // fetches marker object for previously active marker
    const markerObject = getMarkerObject(markerKey);
    // sets z-index css property for previously active marker
    if (markerObject) {
      markerObject.element.style.zIndex = 0;
    }
  };

  // handles user click on pill marker - changes newly selected maker style and also stores crrently selected marker in state (which triggers re-tyling of prev selected marker)
  const clickPill = useCallback(
    (markerData, marker) => {
      setPillStyleCurrent(markerData.key, marker);
      if (currentPillMarkerRef.current) {
        setPillStylePrev(currentPillMarkerRef.current);
      }
      currentPillMarkerRef.current = markerData.key;
    },
    [setPillStyleCurrent, setPillStylePrev]
  );

  // Creates large popout marker (which gives more details on the currently selected pill marker + link)
  const addLargeMarker = useCallback(
    (markerData, mapBounds) => {
      // deletes large marker (google map object and staored marker data) if one is currently active
      if (largeMarkerRef.current) {
        largeMarkerRef.current.marker.map = null;
        largeMarkerRef.current = false;
        setLargeMarker(false);
      }

      // creates new google maps advanced marker object
      const newMarker = new window.google.maps.marker.AdvancedMarkerView({
        map,
        content: largeMarkerContent(markerData, mapBounds),
        position: markerData.coords,
      });

      // sets new marker z-index property to 10 (so it appears in from of everything else)
      newMarker.element.style.zIndex = 10;

      // click listener which calls props.setActiveLink when large marker is clicked
      newMarker.addListener("gmp-click", (event) => {
        navigateToHotel();
        setActiveLink("/hotels/" + largeMarkerRef.current.markerData.key);
        dispatch(updateNavigateAway(true));
        navigate(getHref(largeMarkerRef.current.markerData.hotelDataKey));
      });

      // updates activeLargeMarker variable and state variable with google maps marker object and marker data (element from hotelArray)
      largeMarkerRef.current = { marker: newMarker, markerData: markerData };
      setLargeMarker({ marker: newMarker, markerData: markerData });
    },
    [dispatch, navigate]
  );

  // creates new pill marker - markerData argument contains the hotel data (element from hotelArray)
  const addPillMarker = useCallback(
    (markerData, style) => {
      function pillMarkerContent(markerData) {
        // initialise variables for pill marker inline styling (white background, dark text)
        let pillBackground = "#FFFFFF";
        let pillColor = "#222222";
        let pillzIndex = 0;
        let pillBoxShadow =
          "rgba(255, 255, 255, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 2px 4px";

        // if marker key matches with markerStateObject (redux store of highlighted markers), styling set to "prev clicked"
        if (style === "prev") {
          pillBackground = "#EBEBEB";
          pillBoxShadow = "0 0 0 1px #B0B0B0 inset";
        }

        // if marker key matches with markerStateObject (redux store of highlighted markers), styling set to "prev clicked"
        if (style === "active") {
          pillBackground = "black";
          pillColor = "white";
          pillzIndex = 1;
        }

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

      // creates large marker (which shows photo and more detail for hotel) when pill marker is clicked
      newMarker.addListener("gmp-click", (event) => {
        clickPill(markerData, newMarker);
        addLargeMarker(markerData, map.getBounds());
        // update markerStateObject in redux

        dispatch(updateMarkerStateObject(markerData.key));
        dispatch(updateActiveMarker(markerData.key));
      });

      const element = newMarker.element;

      // pointer enter listener which highlights pill marker when mouse hovers over
      ["focus", "pointerenter"].forEach((event) => {
        element.addEventListener(event, () => {
          newMarker.content.classList.add("highlight");
          newMarker.element.style.zIndex = 2;
        });
      });

      // pointer leave listener which highlights pill marker when mouse hovers over
      ["blur", "pointerleave"].forEach((event) => {
        element.addEventListener(event, () => {
          newMarker.content.classList.remove("highlight");
          newMarker.element.style.zIndex = "";
        });
      });

      // pushes object containing markerData and google maps marker object to markers array
      markers.push({ marker: newMarker, markerData: markerData });
    },
    [addLargeMarker, clickPill, dispatch]
  );

  const updateMarkers = useCallback(
    (hotelArray) => {
      let keysObject = {};
      let largeMarkerRetained;

      // (1) loop through current hotel data array and create object containing all hotel keys
      // (2) check if stored currentMarker and prevMarker keys appear in current hotelArray - if not reset currentMarker and prevMarker values
      // (3) check if keys stored in markerState appear in current hotelArray - if so retain those object properties in updated markerState object
      for (let i = 0; i < hotelArray.length; i++) {
        // add key current hotelArray element to keys object
        keysObject[hotelArray[i].key] = true;

        // check if the key for currently active large marker matches current hotelArray element key - if so set largeMarkerRetained to true
        if (largeMarkerRef.current) {
          if (largeMarkerRef.current.markerData.key === hotelArray[i].key) {
            largeMarkerRetained = true;
          }
        }
      }

      // if largeMarker is not contained in current hotel data array, set largeMarker state to false
      if (!largeMarkerRetained && largeMarkerRef.current) {
        largeMarkerRef.current.marker.map = null;
        largeMarkerRef.current = false;
        setLargeMarker(false);
      }

      // delete markers which do not appear in the current hotelArray (or delete all if refresh argument is true)
      let j = markers.length;
      while (j--) {
        if (!keysObject[markers[j].markerData.key]) {
          markers[j].marker.map = null;
          markers.splice(j, 1);
        }
      }

      // add new pill marker objects for all elements of hotelArray which are not in keysObject
      // residualKeysObject stores keys of map markers which have not been deleted
      let residualKeysObject = {};

      for (let i = 0; i < markers.length; i++) {
        residualKeysObject[markers[i].markerData.key] = true;
      }

      // pill markers added for elements of hotel array, with undeleted markers from previous hotel array filtered out
      for (let i = 0; i < hotelArray.length; i++) {
        if (!residualKeysObject[hotelArray[i].key]) {
          addPillMarker(hotelArray[i]);
        }
      }
    },
    [addPillMarker]
  );

  // function which removes large marker
  const removeLargeMarker = useCallback(() => {
    largeMarkerRef.current.marker.map = null;
    largeMarkerRef.current = false;
    setLargeMarker(false);
    setPillStylePrev(currentPillMarkerRef.current);
    currentPillMarkerRef.current = false;
    dispatch(updateActiveMarker(false));
  }, [dispatch, setPillStylePrev]);

  // handles server calls and routes - mimics REST API POST call - uses promises and timeOut functions to imitate server comms
  const makeServerCall = useCallback(
    (type, searchData) => {

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
          hotelArrayRef.current = newSearchResults.hotelArray;
          updateMarkers(newSearchResults.hotelArray);

          // updates map boundary box (for location search when map will move in response to search results)
          if (newSearchResults.mapBbox) {
            // setMapBbox(newSearchResults.mapBbox);
            dispatch(updateMapBbox(newSearchResults.mapBbox));
            const mapBbox = newSearchResults.mapBbox;

            // creates google map LatLng object for NE of country bbox
            const bound1 = new window.google.maps.LatLng(
              mapBbox[1],
              mapBbox[0]
            );
            // creates google map LatLng object for SW of country bbox
            const bound2 = new window.google.maps.LatLng(
              mapBbox[3],
              mapBbox[2]
            );
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
          if (locationSearchCurrentRef.current) {
          //locationSearchCurrentRef.current = false
        }
        }
      };
      // handles server calls initiated by map movements ("idle google map event handler")
      if (type === "map") {
          dispatch(updateSearchLocationRedux({ name: "map area" }));
        window.history.pushState("object or string", "Title", "/hotel-app/");

        let currentHotelData = hotelArrayRef.current;

        if (searchData.zoom < zoomLevelRef.current) {
          currentHotelData = [];
        }

        zoomLevelRef.current = searchData.zoom;

        // generates unique key and calls initialise search function
        const newSearchKey = generateKey();
        initialiseSearch(newSearchKey);
        // sets up route (function mimics REST API POST call) for map search server call
        serverRoute = mapSearch(newSearchKey, searchData, currentHotelData);
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

        let savedMapData = {};

        savedMapData.bounds = map.getBounds();
        savedMapData.center = map.getCenter();
        savedMapData.box = mapContainer.current.getBoundingClientRect();

        // sets up route (function mimics REST API POST call) for update page search
        serverRoute = updatePageSearch(
          newSearchKey,
          searchLocation,
          savedMapData,
          finalPageHotels
        );
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

      //
      const makeServerCall = new Promise((resolve) => {
        setTimeout(() => {
          resolve(serverRoute);
        }, 1000);
      });

      makeServerCall.then((value) => fulfilServerCall(value));
    },
    [
      activeMarker,
      dispatch,
      firstLoad,
      markerStateObject,
      maxPages,
      numberHotels,
      savedMapData,
      searchLocation,
      updateMarkers,
    ]
  );

  // creates new google map object and event listeners etc
  const renderMap = useCallback(() => {
    // creates new google map object
    map = new window.google.maps.Map(document.getElementById("map"), {
      mapId: "4504f8b37365c3d0",
      disableDefaultUI: true,
      gestureHandling: "greedy",
      mapTypeId: "terrain",
    });

    // updates stored map parameters (bounds, center, zoom etc) when map bounds change
    window.google.maps.event.addListener(map, "idle", function () {
      const newMapParameters = {
        bounds: map.getBounds(),
        center: map.getCenter(),
        zoom: map.getZoom(),
        box: mapContainer.current.getBoundingClientRect(),
      };

      dispatch(updateSavedMapData(newMapParameters));

      if (mapDraggedRef.current || mapZoomedRef.current) {
        if (!locationSearchCurrentRef.current) {

        if (initMapLoadedRef.current) {
          makeServerCall("map", newMapParameters);
        } else {
          initMapLoadedRef.current = true;
        }

        mapDraggedRef.current = false;
        mapZoomedRef.current = false;
      }

      }
      if (locationSearchCurrentRef.current) {
        locationSearchCurrentRef.current = false
      }
    });

    // event listener for end of map drag - used to trigger update of search results
    map.addListener("dragend", (event) => {
      // sets boolean indicating map drag has occured to true
      mapDraggedRef.current = true;
    });

    // event listener for mousedown uses a getter/setter to change drawerdown state
    map.addListener("zoom_changed", (event) => {
      // sets boolean indicating map zoom has occured to true
      mapZoomedRef.current = true;
    });

    // event listener for map click events - used to turn off largeMarker (if open)
    map.addListener("click", (event) => {
      removeLargeMarker();
    });
  }, [dispatch, makeServerCall, navigateAway, removeLargeMarker]);

  // Attach your callback function to the `window` object
  window.initMap = function () {
    renderMap();
    setMapLoaded(true);
  };

  // calls server for initial data on page load
  useEffect(() => {
    if (firstLoad && !navigateAway) {

      // creates object with search parameters from url
      let searchParams = (new URL(document.location)).searchParams;

      const searchCity = searchParams.get("city")
      const searchCountry = searchParams.get("country")

      if (searchCity) {
       //onloadSearchRef.current = true;
        const locationObject = {"name":searchCity, "type":"city"}
        makeServerCall("location", locationObject);
        dispatch(updateSearchLocationRedux(locationObject))
        initDataLoadedRef.current = true;

      }
      else if (searchCountry) {

               //onloadSearchRef.current = true;
        const locationObject = {"name":searchCountry, "type":"country"}
        makeServerCall("location", locationObject);
        dispatch(updateSearchLocationRedux(locationObject))
        initDataLoadedRef.current = true;
      
      }
      else {

      setTimeout(() => {
        const searchData = {
          name: "United Kingdom",
          type: "country",
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
        // updates map boundary box (for location search when map will move in response to search results)
        dispatch(updateMapBbox(initSearchResults.mapBbox));
        // sets number of hotels for initial search
        dispatch(updateNumberHotels(initSearchResults.numberHotels));
        // sets number of maxPages for initial search
        dispatch(updateMaxPages(initSearchResults.maxPages));

        setDataLoading(false);
        setFirstLoad(false);

        const mapBbox = initSearchResults.mapBbox;

        fitMapBounds(mapBbox);

        // this check is included as useEffects load twice in development mode (and therefore data is loaded twice) - shouldn't be an issue in production but including as failsafe
        if (!initDataLoadedRef.current) {
          // updates hotel data array
          dispatch(updateHotelArray(initSearchResults.hotelArray));
          hotelArrayRef.current = initSearchResults.hotelArray;
          updateMarkers(initSearchResults.hotelArray);
          initDataLoadedRef.current = true;
        }
      }, 1000);
    }
    }
  }, [dispatch, firstLoad, navigateAway, updateMarkers]);

  // calls server for initial data on page load
  useEffect(() => {
    if (firstLoad && navigateAway) {
      hotelArrayRef.current = hotelArray;
      renderMap();
      map.setZoom(savedMapData.zoom);
      map.setCenter(savedMapData.center);

      // pill markers added for elements of hotel array, with undeleted markers from previous hotel array filtered out
      for (let i = 0; i < hotelArray.length; i++) {
        let pillStyle;
        if (markerStateObject[hotelArray[i].key]) {
          pillStyle = "prev";
        }
        if (activeMarker === hotelArray[i].key) {
          pillStyle = "active";

          addLargeMarker(hotelArray[i], savedMapData.bounds);
          currentPillMarkerRef.current = hotelArray[i].key;
        }
        addPillMarker(hotelArray[i], pillStyle);
      }
      dispatch(updateNavigateAway(false));
      initDataLoadedRef.current = true
      setFirstLoad(false);
    }
  }, [
    navigateAway,
    activeMarker,
    addLargeMarker,
    addPillMarker,
    dispatch,
    hotelArray,
    markerStateObject,
    renderMap,
    firstLoad,
    savedMapData.bounds,
    savedMapData.center,
    savedMapData.zoom,
  ]);

  const fitMapBounds = (mapBbox) => {
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
  };

  // creates css selector for a given property key
  const getMarkerSelector = (markerKey) => {
    const selectorName = "." + markerKey;
    const newSelector = document.querySelector(selectorName);
    return newSelector;
  };

  // returns marker object for a given property key
  const getMarkerObject = (markerKey) => {
    let matchingMarkerObject;
    // compares marker key of interest against all keys stored in markers array
    for (let i = 0; i < markers.length; i++) {
      // if there is a match, matchingMarkerObject is is set to marker object from markers array
      if (markerKey === markers[i].markerData.key) {
        matchingMarkerObject = markers[i].marker;
        break;
      }
    }
    return matchingMarkerObject;
  };

  // hanldes click on large marker - navigates to hotel page for chosen hotel
  const navigateToHotel = () => {
    dispatch(updateNavigateAway(true));
    // enables scrolling whne user navigates to hotelPage (if screenwidth <950, scrolling is disabled whilst in map view)
    document.body.style.overflow = "auto";
    document.body.style.position = "static";
    navigate(getHref(largeMarkerRef.current.markerData.hotelDataKey));
  };

  // calculates position and generates html content for large marker
  function largeMarkerContent(markerData, mapBounds) {
    // gets current map bounds and ne and sw limit coords
    // const mapBounds = map.getBounds();
    const neCoords = mapBounds.getNorthEast(); // Coords of the northeast corner
    const swCoords = mapBounds.getSouthWest(); // Coords of the southwest corner

    // initialises largeMarker width, min margin (buffer from edge of map where large marker cannot be rendered)
    let containerWidth = 327;
    // sets min margin (buffer from edge of map where large marker cannot be rendered)
    const minMargin = 35;
    // get dimensions/position of map container html element
    const mapBox = mapContainer.current.getBoundingClientRect();
    // calculates coordinate distance between lhs of map and marker
    const lhsLngDiff = calcLngDiff(swCoords.lng(), markerData.coords.lng);
    // calculates coordinate width of map
    const lngWidth = calcLngDiff(swCoords.lng(), neCoords.lng());
    // calculates pixel distance between map lhs and marker
    const lhsPxDiff = mapBox.width * (lhsLngDiff / lngWidth);
    // calculates pixel distance between map rhs and marker
    const rhsPxDiff = mapBox.width - lhsPxDiff;
    // initialises horizontal adjustement. This adjusts position of large marker horizontally if default position of marker flows into buffer margin around map or outside the map
    let horizontalAdj = 0;
    // if default position of marker flows into buffer margin around map or outside the map horizontal position is adjusted so that the large marker stays within the map (outside margin buffers) but is no longer aligned with the center of the pill marker
    // if px distance between map lhs and pill marker is less than half the widht of the container (plus buffer margin) large marker position is adjusted
    if (lhsPxDiff < containerWidth / 2 + minMargin) {
      horizontalAdj = containerWidth / 2 - (lhsPxDiff - minMargin);
    }
    // if px distance between map rhs and pill marker is less than half the widht of the container (plus buffer margin) large marker position is adjusted
    if (rhsPxDiff < containerWidth / 2 + minMargin) {
      horizontalAdj = -(containerWidth / 2 - (rhsPxDiff - minMargin));
    }

    // initialises vertical adjustments which determine whether large marker appears above or below the pill marker
    let verticalAdj;
    let verticalPercentage;
    // gets coordinates of current map center point
    const mapCenter = map.getCenter();

    // if map center latitude is above pill marker, set large marker position above the pill marker
    if (mapCenter.lat() > markerData.coords.lat) {
      verticalAdj = -31.078;
      verticalPercentage = 0;
    }
    // if map center latitude is below pill marker, set large marker position below the pill marker
    else {
      verticalAdj = 31.078;
      verticalPercentage = 100;
    }

    // creates inline style setting position of large marker
    const largeMarkerPos =
      "translate(calc(-50% + " +
      horizontalAdj +
      "px), calc(" +
      verticalPercentage +
      "% + " +
      verticalAdj +
      "px))";

    // initialises html content for largeMarker render
    const content = document.createElement("div");

    // html render for large popout marker (only renders if screen in large view)

    content.innerHTML = `
      <div class="results-map-ft9" style="transform: ${largeMarkerPos}; left: 50%; position: absolute; bottom: 0px; z-index: 2; pointer-events: auto; font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif; animation-duration: 100ms;">
  <div class="results-map-hy6" style="width: ${containerWidth}px;">
    <img class="results-map-uc3" alt="alt" src="${markerData.photos[0]}" />

    <div class="results-map-la6">
      <div>
        <div class="results-map-qq1">
          <div class="results-map-lq2">${markerData.name}</div>
        </div>

        <div class="results-map-jh4">${markerData.locationName}</div>
      </div>
      <div>
        <div class="results-map-pp1">
          <div>
            <span class="results-map-al5">£${markerData.price}</span> per night
          </div>

          <div class="results-map-hh3">
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              style="display: block; height: 12px; width: 12px; fill: black"
            >
              <path
                d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"
                fill-rule="evenodd"
              ></path>
            </svg>
            <div class="results-map-ma1">${markerData.rating} (${markerData.numReviews})</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

    return content;
  }

  // listens for scroll event (to control visibility of map/list items button in render, as it disappears when scrolled down to pagination nav)
  useEffect(() => {
    const handleScroll = (event) => {
      // get position of bottom of results list container
      const listContainerBottom = listContainerRef.current.getBoundingClientRect()
        .bottom;
      // if bototm of results list container is less than 70px from bottom of viewport map button render is disabled
      if (listContainerBottom < screenHeight - 70) {
        setMapButtonActive(false);
      } else {
        setMapButtonActive(true);
      }
    };

    // initialises and removed scroll event listener
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("scroll", handleScroll, true);
    };
  });

  // controls toggling of map view by changing css styles - between partial screen and full screen if screenwidth >= 950px, and between full screen and not visible if screen width < 950px
  const toggleMapView = () => {
    // if currently in expanded view set expandMapview to false and css updated
    if (expandMapView) {
      // setExpandMapView(false);
      dispatch(updateExpandMapView(false));
      // enables scrolling when full map is not enabled (needed for windows chrome/edge browsers where scrollbar changes size of map)
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      // if screen width is >=950px intermediate step (controlled by timeout) is aded for smooth animation
      if (window.innerWidth >= 950) {
        setSearchListStyle("fmdphkf f1lf7snk dir dir-ltr");
        setMapStyle("m1ict9kd m7lqfs3 dir dir-ltr");
        setTimeout(() => {
          setSearchListStyle("fmdphkf dir dir-ltr");
          setMapStyle("m1ict9kd m12odydq dir dir-ltr");
        }, "850");
      } else {
        setSearchListStyle("fmdphkf dir dir-ltr");
        setMapStyle("m1ict9kd m12odydq dir dir-ltr");
      }
    }
    // if not currently in expanded view set expandMapview to true and css updated
    else {
      //setExpandMapView(true);
      dispatch(updateExpandMapView(true));
      // disables scrolling when full map is enabled (needed for windows chrome/edge browsers where scrollbar changes size of map)
      document.body.style.overflow = "hidden";
      document.body.style.position = "relative";
      setSearchListStyle("fmdphkf fgnm67p f1lf7snk dir dir-ltr");
      setMapStyle("m1ict9kd m1k84ca2 dir dir-ltr");
    }
  };

  // handles user inputs from paginationNav
  const goToPage = (newPageNumber) => {
    // setActivePage(newPageNumber);
    dispatch(updateActivePage(newPageNumber));
    makeServerCall("updatePage", newPageNumber);
  };

  // handles user click on nav search icon - makes srver call to refresh search
  const handleNavSearchClick = () => {
    makeServerCall("searchRefresh");
  };

  const updateHoverHotel = (hotelKey) => {
    if (hoverHotelRef.current) {
      //  setPillStylePrev(hoverHotelRef.current)
      if (markerStateObject[hoverHotelRef.current]) {
        setPillStylePrev(hoverHotelRef.current);
      } else {
        setPillStyleInit(hoverHotelRef.current);
      }
    }

    setPillStyleCurrent(hotelKey);
    hoverHotelRef.current = hotelKey;
  };

  return (
    <div className="search-map-nr6">
      <HotelAppNav
        searchLocation={searchLocation}
        updateSearchLocation={updateSearchLocation}
        expandMapView={expandMapView}
        handleNavSearchClick={handleNavSearchClick}
        activeSearch={activeSearch}
        setActiveSearch={setActiveSearch}
      />

      <main className="search-map-cy5">
        <div className="search-map-1hy">
          {/* lowers position of button when screen height is low */}
          <div
            className={
              screenHeight > 500
                ? "search-map-fo8"
                : "search-map-fo8 small-screen-height"
            }
          >
            {expandMapView ? (
              <button
                type="button"
                className="search-map-174"
                onClick={toggleMapView}
              >
                <span className="search-map-7u6">
                  <span className="search-map-r16">Show list</span>
                  <div className="search-map-hqs">
                    <svg
                      className="search-map-sd2"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                    >
                      <path d="M2.5 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 12v2H6v-2h9zM2.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 7v2H6V7h9zM2.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 2v2H6V2h9z"></path>
                    </svg>
                  </div>
                </span>
              </button>
            ) : null}
            {!expandMapView && mapButtonActive && !dataLoading ? (
              <button
                type="button"
                className="search-map-174"
                onClick={toggleMapView}
              >
                <span className="search-map-7u6">
                  <span className="search-map-r16">Show map</span>
                  <div className="search-map-hqs">
                    <svg
                      className="search-map-sd2"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                    >
                      <path d="M2.5 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 12v2H6v-2h9zM2.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 7v2H6V7h9zM2.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 2v2H6V2h9z"></path>
                    </svg>
                  </div>
                </span>
              </button>
            ) : null}
          </div>
        </div>

        <div className={searchListStyle}>
          <ResultsList
            listContainerRef={listContainerRef}
            numberHotels={numberHotels}
            hotelArray={hotelArray}
            dataLoading={dataLoading}
            activePage={activePage}
            maxPages={maxPages}
            goToPage={goToPage}
            setActiveLink={setActiveLink}
            hoverHotel={hoverHotel}
            setHoverHotel={updateHoverHotel}
            firstLoad={firstLoad}
            navigateAway={navigateAway}
          />
        </div>
        <div className={mapStyle}>
          <div className="m15dgkuj dir dir-ltr">
            <div className="c1yo0219 dir dir-ltr">
              <div>
                <div>
                  <div className="c12zlp1w dir dir-ltr">
                    <div
                      aria-hidden="false"
                      style={{
                        contain: "layout paint",
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {largeView ? (
                        <div
                          className="cezhrh0 c1aiokyr dir dir-ltr"
                          style={{
                            whiteSpace: "nowrap",
                            position: "absolute",
                            marginLeft: "24px",
                            marginTop: "24px",
                            top: "0px",
                            left: "0px",
                            zIndex: "1",
                            transition:
                              "transform 850ms cubic-bezier(0.25, 1, 0.5, 1) 0s",
                          }}
                          aria-hidden="false"
                        >
                          <div className="copf0za dir dir-ltr">
                            <div
                              className="c15e4bhw ctbkggg dir dir-ltr"
                              style={{ height: "40px", flexDirection: "row" }}
                            >
                              <button
                                aria-label="Expand map and collapse list view"
                                type="button"
                                className="b117oblx dir dir-ltr"
                                onClick={toggleMapView}
                              >
                                <div className="l1pjhd3s dir dir-ltr">
                                  <svg
                                    className="search-map-mz1"
                                    viewBox="0 0 32 32"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="presentation"
                                    focusable="false"
                                  >
                                    <g fill="none">
                                      {expandMapView ? (
                                        <path d="m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932"></path>
                                      ) : (
                                        <path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path>
                                      )}
                                    </g>
                                  </svg>
                                </div>
                                {expandMapView ? (
                                  <div className="l177lde9 dir dir-ltr">
                                    <span className="l1pncren dir dir-ltr">
                                      Show list
                                    </span>
                                  </div>
                                ) : null}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {dataLoading ? (
                        <Loader
                          largeView={largeView}
                          largeMarker={largeMarker}
                        />
                      ) : null}
                      <div
                        ref={mapContainer}
                        id="map"
                        style={{
                          height: "100%",
                          backgroundColor: "rgb(230, 227, 223)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {largeMarker && !largeView ? (
              <PopoutBoxSm
                markerData={largeMarker.markerData}
                removeLargeMarker={removeLargeMarker}
                setActiveLink={setActiveLink}
                navigateToHotel={navigateToHotel}
              />
            ) : null}
          </div>
        </div>
      </main>
      {largeView ? <Footer largeView={true} /> : null}
      {activeLink ? (
        <LinkModal activeLink={activeLink} setActiveLink={setActiveLink} />
      ) : null}
    </div>
  );
}

export default HotelApp;
