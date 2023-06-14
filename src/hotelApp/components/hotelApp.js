import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ResultsMap from "./resultsMap";
import ResultsList from "./resultsList";
import HotelAppNav from "./hotelAppNav";
import LinkModal from "./linkModal";
import generateKey from "../functions/generateKey";
import getHotelArrayInit from "../functions/getHotelArrayInit";
import mapSearch from "../functions/mapSearch";
import locationSearch from "../functions/locationSearch";
import updatePageSearch from "../functions/updatePageSearch";
import searchRefreshSearch from "../functions/searchRefreshSearch";
import "../css/hotelApp.css";

// homepage component for hotelApp - contains jsx for homepage and search/server comms logic

function HotelApp(props) {
  // large view (boolean indicating if app currently in large view) and screen height (stored in redux)
  const largeView = useSelector((state) => state.deviceData.largeView);
  // viewport height (stored in redux)
  const screenHeight = useSelector((state) => state.deviceData.screenHeight);
  // viewport width (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);
  // boolean indicating if expanded map view is active
  const [expandMapView, setExpandMapView] = useState(false);
  // params of the currently visible map (bounds, center, zoom and box (position on screen))
  const [mapParameters, setMapParameters] = useState();
  // current stored search location (either country name or "map area")
  const [searchLocation, setSearchLocation] = useState({ name: "" });
  // array containg data for current search results
  const [hotelArray, setHotelArray] = useState(getHotelArrayInit);
  // Boolean indicating if first load of app is taking place - used to prevent searchLocation variable being set to "map area" when map bounds are first declared
  const [firstLoad, setFirstLoad] = useState(true);
  // total number of hotels returned by search
  const [numberHotels, setNumberHotels] = useState(1000);
  // max number of search pages returned by search (capped at 15)
  const [maxPages, setMaxPages] = useState();
  // boolean set to true when new search data is loading
  const [dataLoading, setDataLoading] = useState(true);
  // stores currently active page (which is shown / controlled by paginationNav)
  const [activePage, setActivePage] = useState(1);
  // stores currently active page (which is shown / controlled by paginationNav)
  const [activeLink, setActiveLink] = useState();
  // stores hotel key if mouse currently hovering over in results list - used for highlighting pill marker on map
  const [hoverHotel, setHoverHotel] = useState();
  // boolean which indicates if text input / dropdown(large view) / search modal(small view) are open
  const [activeSearch, setActiveSearch] = useState();
  // holds latest map boundary box returned from server
  const [mapBbox, setMapBbox] = useState();
  // map data saved every time there is a map search - used for update page search
  const [savedMapData, setSavedMapData] = useState();
  // boolean indicating if location search is uderway - used to block a new map search from occuring when the map updates
  // const [locationSearchCurrent, setLocationSearchCurrent] = useState();
  // holds key for latest search - used to filter out returns for older searches, if several are active simultaneously
  const [latestSearchKey, setLatestSearchKey] = useState();
  // used to store current version latestSearchKey - needed as function is called fromgoogle maps event handler (to avoid react state closure issue)
  const searchKeyRef = useRef();
  searchKeyRef.current = latestSearchKey;
  const locationSearchCurrentRef = useRef();

  //ref for map container - used to access position / dimensions of map containers
  const mapContainer = useRef(null);

  // updates searchLocation in response to user input and sets searchLocationUpdate boolean to true
  const updateSearchLocation = (newLocation) => {
    setSearchLocation(newLocation);
    makeServerCall("location", newLocation);
  };

  // boolean controlling visibility of map button (if page scrolled right down beyond limit of listcontainer, the button is not rendered)
  const [mapButtonActive, setMapButtonActive] = useState(true);
  // initialises css styles for search list outer container (needed for change of map view)
  const [searchListStyle, setSearchListStyle] = useState("fmdphkf dir dir-ltr");
  // initialises css styles for map outer container (needed for change of map view)
  const [mapStyle, setMapStyle] = useState("m1ict9kd dir dir-ltr");
  // ref for outer container of results list (used for controlling visibility of "show list" / "show map" button)
  const listContainerRef = useRef(null);

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
      setExpandMapView(false);
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
      setExpandMapView(true);
      // disables scrolling when full map is enabled (needed for windows chrome/edge browsers where scrollbar changes size of map)
      document.body.style.overflow = "hidden";
      document.body.style.position = "relative";
      setSearchListStyle("fmdphkf fgnm67p f1lf7snk dir dir-ltr");
      setMapStyle("m1ict9kd m1k84ca2 dir dir-ltr");
    }
  };

  // handles user inputs from paginationNav
  const goToPage = (newPageNumber) => {
    setActivePage(newPageNumber);
    makeServerCall("updatePage", newPageNumber);
  };

  // handles user click on nav search icon - makes srver call to refresh search
  const handleNavSearchClick = () => {
    makeServerCall("searchRefresh");
  };

  // handles server calls and routes - mimics REST API POST call - uses promises and timeOut functions to imitate server comms
  const makeServerCall = (type, searchData) => {
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
        setHotelArray(newSearchResults.hotelArray);
        // updates map boundary box (for location search when map will move in response to search results)
        if (newSearchResults.mapBbox) {
          setMapBbox(newSearchResults.mapBbox);
        }
        // sets number of hotels for current search "typeof" used as a zero response is also falsey
        if (typeof newSearchResults.numberHotels === "number") {
          setNumberHotels(newSearchResults.numberHotels);
        }
        // sets number of maxPages for current search "typeof" used as a zero response is also falsey
        if (typeof newSearchResults.maxPages === "number") {
          setMaxPages(newSearchResults.maxPages);
        }
        // resets search page (i.e. sets page to 1)
        if (newSearchResults.activePage) {
          setActivePage(newSearchResults.activePage);
        }
        setDataLoading(false);
        console.log("just before reset first load");
        if (firstLoad) {
          console.log("inside reset first load");
          setFirstLoad(false);
        }
      }
    };
    // handles server calls initiated by map movements ("idle google map event handler")
    if (type === "map") {
      // adds previous zoom level to search object
      if (savedMapData) {
        searchData.prevZoom = savedMapData.zoom;
      }

      // updates savedMapData with latest search data
      setSavedMapData(searchData);
      let prevHotelArray = hotelArray;
      // if not first load searchLocation set to "map search" . If firstLoad searchLocation remains unchanged and prevHotelArray is set to false (to avoid init dummy variables being sent to server)
      if (firstLoad) {
        console.log("it's firstLoad");
        prevHotelArray = [];
      } else {
        console.log("it's not firstLoad");
        setSearchLocation({ name: "map area" });
      }
      // generates unique key and calls initialise search function
      const newSearchKey = generateKey();
      initialiseSearch(newSearchKey);
      // sets up route (function mimics REST API POST call) for map search server call
      serverRoute = mapSearch(newSearchKey, searchData, prevHotelArray);
    }
    // handles server calls initiated by user selecting option from location dropdown menu
    else if (type === "location") {
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
        console.log("maxPages===newPageNumber");
        // if greater than 15*18 (max number of hotels which can be seen due to 15 page max, the number of hotles on the final page is set the max, which is 18)
        if (numberHotels>269) {
          finalPageHotels = 18
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
      }, 1500);
    });

    makeServerCall.then((value) => fulfilServerCall(value));
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
                      <path
                        fill-rule="evenodd"
                        d="M2.5 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 12v2H6v-2h9zM2.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 7v2H6V7h9zM2.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 2v2H6V2h9z"
                      ></path>
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
                      <path
                        fill-rule="evenodd"
                        d="M2.5 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 12v2H6v-2h9zM2.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 7v2H6V7h9zM2.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 2v2H6V2h9z"
                      ></path>
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
            setHoverHotel={setHoverHotel}
            firstLoad={firstLoad}
          />
        </div>
        <div className={mapStyle}>
          <ResultsMap
            expandMapView={expandMapView}
            toggleMapView={toggleMapView}
            searchLocation={searchLocation}
            setMapParameters={setMapParameters}
            mapParameters={mapParameters}
            hotelArray={hotelArray}
            dataLoading={dataLoading}
            largeView={largeView}
            screenWidth={screenWidth}
            setActiveLink={setActiveLink}
            hoverHotel={hoverHotel}
            makeServerCall={makeServerCall}
            firstLoad={firstLoad}
            mapContainer={mapContainer}
            mapBbox={mapBbox}
            locationSearchCurrentRef={locationSearchCurrentRef}
          />
        </div>
      </main>
      {activeLink ? (
        <LinkModal activeLink={activeLink} setActiveLink={setActiveLink} />
      ) : null}
    </div>
  );
}

export default HotelApp;
