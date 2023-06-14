import React, { useState, useEffect, useRef } from "react";
import PopoutBoxSm from "./popoutBoxSm";
import randomNumberInRange from "../functions/randomNumberInRange";
import { calcLngDiff } from "../functions/calcLngDiff";
import Loader from "./loader";
import "../css/resultsMap.css";

// component containing google map and logic for rendering and updating markers and responding to search queries which require the map to move

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

// sets up listener for user dragging or zooming map - state can't be accessed inside google map objects / event listeners directly due to closure, so this is a workaround
const mapMoveListener = {
  currentInternal: 0,
  currentListener: function (val) {},
  set current(val) {
    this.currentInternal = val;
    this.currentListener(val);
  },
  get current() {
    return this.currentInternal;
  },
  registerListener: function (listener) {
    this.currentListener = listener;
  },
};

function ResultsMap(props) {
  const markersLoadedRef = useRef();
  // keeps log of most recent hotel which has been hovered over in the results list - used to disable styling when props.hoverHotel state changes
  const [hoverHotelLocal, setHoverHotelLocal] = useState();
  // keeps log of currently active pill marker - used for styling
  const currentPillMarkerRef = useRef();
  // holds data and google map object for largeMarker
  const largeMarkerRef = useRef();
  // react state mirror of largeMarkerRef - needed to control PopoutBoxSm which is a react component in small view (whereas the equivalent in large view is a google maps marker)
  const [largeMarker, setLargeMarker] = useState();
  // boolean variables which are set to true if map is dragged or zoomed - used to determine in hotelArray update should be triggered when map bounds update
  const mapDraggedRef = useRef();
  const mapZoomedRef = useRef();

  // highlights map marker when it is active (hover) in searchListLg.js and vice versa
  useEffect(() => {
    // resets styling (to white background and black text) of previously hovered over hotel
    if (hoverHotelLocal) {
      const prevResultSelector = getMarkerSelector(hoverHotelLocal);
      if (prevResultSelector) {
        prevResultSelector.style.backgroundColor = "white";
        prevResultSelector.style.color = "black";
      }
      const prevMarkerObject = getMarkerObject(hoverHotelLocal);
      if (prevMarkerObject) {
        prevMarkerObject.element.style.zIndex = 0;
      }
    }
    // sets style of pill marker (to black background and white text) corresponding to currently hovered over hotel in results list
    if (props.hoverHotel) {
      const activeResultSelector = getMarkerSelector(props.hoverHotel);
      if (activeResultSelector) {
        activeResultSelector.style.backgroundColor = "black";
        activeResultSelector.style.color = "white";
      }
      const markerObject = getMarkerObject(props.hoverHotel);
      if (markerObject) {
        markerObject.element.style.zIndex = 1;
        setHoverHotelLocal(props.hoverHotel);
      }
    }
  }, [props.hoverHotel, hoverHotelLocal]);

  // updates pill markers using latest roomData array - triggers update of markers when props.hotelArray updates
  useEffect(() => {
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
        newMarker.addListener("click", (event) => {
          clickPill(markerData, newMarker);
          addLargeMarker(markerData);
        });

        const element = newMarker.element;

        // pointer enter listener which highlights pill marker when mouse hovers over
        ["focus", "pointerenter"].forEach((event) => {
          element.addEventListener(event, () => {
            highlight(newMarker, markerData);
          });
        });

        // pointer leave listener which highlights pill marker when mouse hovers over
        ["blur", "pointerleave"].forEach((event) => {
          element.addEventListener(event, () => {
            unhighlight(newMarker, markerData);
          });
        });

        // pushes object containing markerData and google maps marker object to markers array
        markers.push({ marker: newMarker, markerData: markerData });
      };

        // create new marker is called with random delay & timeout creates impression of loading from server
        let randomDelay = randomNumberInRange(200, 1000);

        setTimeout(() => {
          createNewMarker();
        }, randomDelay);
    };

    // Creates large popout marker (which gives more details on the currently selected pill marker + link)
    const addLargeMarker = (markerData) => {
      // deletes large marker (google map object and staored marker data) if one is currently active
      if (largeMarkerRef.current) {
        largeMarkerRef.current.marker.map = null;
        largeMarkerRef.current = false;
        setLargeMarker(false);
      }

      // creates new google maps advanced marker object
      const newMarker = new window.google.maps.marker.AdvancedMarkerView({
        map,
        content: largeMarkerContent(markerData),
        position: markerData.coords,
      });

      // sets new marker z-index property to 10 (so it appears in from of everything else)
      newMarker.element.style.zIndex = 10;

      // click listener which calls props.setActiveLink when large marker is clicked
      newMarker.addListener("click", (event) => {
        props.setActiveLink("/hotels/" + largeMarkerRef.current.markerData.key);
      });

      // updates activeLargeMarker variable and state variable with google maps marker object and marker data (element from hotelArray)
      largeMarkerRef.current = { marker: newMarker, markerData: markerData };
      setLargeMarker({ marker: newMarker, markerData: markerData });
    };

    if (!props.firstLoad) {
      // initialise variables
      let largeMarkerRetained;
      let keysObject = {};

      // (1) loop through current hotel data array and create object containing all hotel keys
      // (2) check if stored currentMarker and prevMarker keys appear in current hotelArray - if not reset currentMarker and prevMarker values
      // (3) check if keys stored in markerState appear in current hotelArray - if so retain those object properties in updated markerState object
      for (let i = 0; i < props.hotelArray.length; i++) {
        // add key current hotelArray element to keys object
        keysObject[props.hotelArray[i].key] = true;
        // check if the key for currently active large marker matches current hotelArray element key - if so set largeMarkerRetained to true
        if (largeMarkerRef.current) {
          if (largeMarkerRef.current.markerData.key === props.hotelArray[i].key) {
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
        for (let i = 0; i < props.hotelArray.length; i++) {
          if (!residualKeysObject[props.hotelArray[i].key]) {
            addPillMarker(props.hotelArray[i]);
          }
        }

      // set markersLoaded state to true
      if (!markersLoadedRef.current) {
        markersLoadedRef.current = true;
      }
    }
  }, [props.hotelArray, props.firstLoad]);

  // changes style to highlight pill marker (uses scale property to make pill slightly larger and z-index to bring forward)
  function highlight(markerView, markerData) {
    markerView.content.classList.add("highlight");
    markerView.element.style.zIndex = 2;
  }

  // changes style to highlight pill marker (returns scale and z-index properties to initial values)
  function unhighlight(markerView, markerData) {
    markerView.content.classList.remove("highlight");
    markerView.element.style.zIndex = "";
  }

  // creates css selector for a given property key
  const getMarkerSelector = (markerKey) => {
    const selectorName = "." + markerKey;
    const newSelector = document.querySelector(selectorName);
    return newSelector;
  };

  // sets pill marker styles to "currently active" (i.e dark background and white text)
  // takes marker key and google map marker object as arguments
  const setPillStyleCurrent = (markerKey, marker) => {
    // creates css selector for a pill marker idenitifed by key
    const activeResultSelector = getMarkerSelector(markerKey);
    // sets styles
    if (activeResultSelector) {
      activeResultSelector.style.backgroundColor = "black";
      activeResultSelector.style.color = "white";
      marker.element.style.zIndex = 1;
    }
  };

  // sets pill marker styles to "previously active" (i.e shaded grey)
  // takes marker key and google map marker object as arguments
  const setPillStylePrev = (markerKey) => {
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
  };

  // handles user click on pill marker - changes newly selected maker style and also stores crrently selected marker in state (which triggers re-tyling of prev selected marker)
  function clickPill(markerData, marker) {
    setPillStyleCurrent(markerData.key, marker);
    if (currentPillMarkerRef.current) {
      setPillStylePrev(currentPillMarkerRef.current);
    }
    currentPillMarkerRef.current = markerData.key;
  }

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



  // calculates position and generates html content for large marker
  function largeMarkerContent(markerData) {
    // gets current map bounds and ne and sw limit coords
    const mapBounds = map.getBounds();
    const neCoords = mapBounds.getNorthEast(); // Coords of the northeast corner
    const swCoords = mapBounds.getSouthWest(); // Coords of the southwest corner

    // initialises largeMarker width, min margin (buffer from edge of map where large marker cannot be rendered)
    let containerWidth = 327;
    // sets min margin (buffer from edge of map where large marker cannot be rendered)
    const minMargin = 35;
    // get dimensions/position of map container html element
    const mapBox = props.mapContainer.current.getBoundingClientRect();
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
    if (props.largeView) {
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
    }

    return content;
  }

  // adjusts map bounds if new country or city is inputted by user
  useEffect(() => {
    // map bound update is triggered if props.searchLocation.name has a non-false value and the value is not "map area" (which would be triggered by the user moving the map)
    if (props.mapBbox) {
      // creates google map LatLng object for NE of country bbox
      const bound1 = new window.google.maps.LatLng(
        props.mapBbox[1],
        props.mapBbox[0]
      );
      // creates google map LatLng object for SW of country bbox
      const bound2 = new window.google.maps.LatLng(
        props.mapBbox[3],
        props.mapBbox[2]
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
  }, [props.mapBbox]);

  const callMapSearch = () => {
    const newMapParameters = {
      bounds: map.getBounds(),
      center: map.getCenter(),
      zoom: map.getZoom(),
      box: props.mapContainer.current.getBoundingClientRect(),
    };
    props.makeServerCall("map", newMapParameters);
  };

  // creates new google map object and event listeners etc
  const renderMap = () => {
    // parameters for initial map center and zoom
    let mapCenter = {
      lat: 48.6,
      lng: 0,
    };
    let mapZoom = 5;
    // creates new google map object
    map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: mapZoom,
      center: mapCenter,
      mapId: "4504f8b37365c3d0",
      disableDefaultUI: true,
      gestureHandling: "greedy",
      mapTypeId: "terrain",
    });
    // sets mapLoaded state to true when first idle event occurs (which then enables adding of markers inside the react component)
    window.google.maps.event.addListenerOnce(map, "idle", function () {
      callMapSearch();
    });
    // updates stored map parameters (bounds, center, zoom etc) when map bounds change
    window.google.maps.event.addListener(map, "idle", function () {
      mapMoveListener.current = true;
    });

    // event listener for map click events - used to turn off largeMarker (if open)
    map.addListener("click", (event) => {
      removeLargeMarker();
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
  };

  // checks google API has loaded before rendering map
  const googleMapChecker = () => {
    // check for maps in case using other google api are being used
    if (!window.google) {
      // loops back round if api hasn't loaded
      setTimeout(googleMapChecker, 100);
    } else {
      // the google maps api is ready to use, render the map
      renderMap();
    }
  };

  // calls googleMapChecker when component loads for the first time
  useEffect(() => {
    googleMapChecker();
  }, []);

  // function which removes large marker
  const removeLargeMarker = () => {
    largeMarkerRef.current.marker.map = null;
    largeMarkerRef.current = false;
    setLargeMarker(false);
    setPillStylePrev(currentPillMarkerRef.current);
    currentPillMarkerRef.current = false;
  };

  // xyz

  mapMoveListener.registerListener(function (val) {
    if (val) {
      // if map idle has been triggered by either a user drag, change of zoom or search location input change, props.handleMapMove is triggered
      if (mapZoomedRef.current || mapDraggedRef.current) {
        if (props.locationSearchCurrentRef.current) {
          props.locationSearchCurrentRef.current = false;
          mapZoomedRef.current = false;
          mapDraggedRef.current = false;
        } else {
          callMapSearch();
          mapZoomedRef.current = false;
          mapDraggedRef.current = false;
        }
      }
    }
  });

  return (
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
                data-testid="map/GoogleMap"
              >
                {props.largeView ? (
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
                          onClick={props.toggleMapView}
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
                                {props.expandMapView ? (
                                  <path d="m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932"></path>
                                ) : (
                                  <path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path>
                                )}
                              </g>
                            </svg>
                          </div>
                          {props.expandMapView ? (
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

                {props.dataLoading || props.pageLoading ? (
                  <Loader
                    largeView={props.largeView}
                    largeMarker={largeMarker}
                  />
                ) : null}
                <div
                  ref={props.mapContainer}
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
      {largeMarker && !props.largeView ? (
        <PopoutBoxSm
          markerData={largeMarker.markerData}
          removeLargeMarker={removeLargeMarker}
          setActiveLink={props.setActiveLink}
        />
      ) : null}
    </div>
  );
}

export default ResultsMap;
