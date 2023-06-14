import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMainModal } from "../../redux/modals/modalsSlice";
import SearchModal from "./searchModal";
import allLocationArray from "../data/allLocationArray.js";
import popularLocationArray from "../data/popularLocationArray.js";
import "../css/hotelAppNav.css";

// header, nav and controls for hotel app - both large and small view
function HotelAppNav(props) {
  // redux hook for dispatching data
  const dispatch = useDispatch();
  // screen width (stored in redux)
  const largeView = useSelector((state) => state.deviceData.largeView);
  // stores array of country names which currently appear as dropdown/search modal options (i.e. have not need filteredt out by text input search)
  const [searchResultArray, setSearchResultArray] = useState(popularLocationArray);
  // boolean indicating if deafult polular location search options are displayed - if true, turns on popular location label (at top of search option list)
  const [popularLocationActive, setPopularLocationActive] = useState(true);
  // stores local text input (distinct from props.searchLocation.name which is the final inputted and validated value (taken from country array) used for the search)
  const [locationInputText, setLocationInputText] = useState("");
  // stores highlighted dropdown option (highlighted as a reult of keyboard controls being used). large view only
  const [highlightedDdOption, setHighlightedDdOption] = useState();
  // ref for searchbar and dropdown element - used to detect clicks outside when dropdown is open
  const searchbarRef = useRef(null);
  // ref for text input - used to focus, blur etc
  const textInputRef = useRef(null);
  // array of refs for active dropdown / search modal option list - used for navigating dropdown search options with keyboard
  const searchResultArrayRef = useRef([]);
  // ref for text input - used to focus, blur etc
  const textInputLgRef = useRef(null);

  // prevents scrolling when search modal is open
  useEffect(() => {
    // if activeSearch is true and in small view (i.e. search modal is open) scrolling of search result list is disabled
    if (props.activeSearch && !largeView) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "relative";
    }
    // else if not in expanded map view scrolling of search result list is enabled
    else if (!props.expandMapView) {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
    }
  }, [props.activeSearch, props.expandMapView, largeView]);

  // updates text input value when an input value is selected from the dropdown (large view) / seach modal (small view) list
  useEffect(() => {
    setLocationInputText(props.searchLocation.name);
  }, [props.searchLocation.name]);

  // resets search options for dropdown or search modal when they close
  const resetSearchOptionList = () => {
    // if current text input does not equal stored search location, location input is reset to stored search location
    if (locationInputText !== props.searchLocation.name) {
      setLocationInputText(props.searchLocation.name);
      // if stored search location is set to either "map area" or there is no value for stored search location, search options are reset to popular locations default
      if (
        props.searchLocation.name === "map area" ||
        !props.searchLocation.name
      ) {
        setSearchResultArray(popularLocationArray);
        setPopularLocationActive(true);
      }
      // else search options are set to the current stored search location
      else {
        // retrieves full data object for current stored search location and stores value in searchResultArray (i.e. it becomes the search result visible in dropdown)
        for (let i = 0; i < allLocationArray.length; i++) {
          if (props.searchLocation.name === allLocationArray[i].name) {
            setSearchResultArray([allLocationArray[i]]);
            setPopularLocationActive(false);
            break;
          }
        }
      }
    }
  };

  // closes dropdown menu and resets highlighted dropdown option, turns off text input and resets search option list
  const closeDropdown = () => {
    props.setActiveSearch(false);
    setHighlightedDdOption(false);
    textInputRef.current.blur();
    resetSearchOptionList();
  };

  // closes search modal (small view) and resets search option list
  const closeSearchModal = () => {
    props.setActiveSearch(false);
    resetSearchOptionList();
  };

  // click event listener which closes dropdown menu if user clicks outside searchnav / dropdown list (large view only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchbarRef.current &&
        !searchbarRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  // updates stored search location (& triggers new search) when user selects an item from search list (in either dropdown or search)
  const selectLocation = (newLocation) => {

    // updates stored search location & triggers new search
    props.updateSearchLocation(newLocation);

    if (largeView) {
      // updates text input
      setLocationInputText(newLocation.name);
      // updates stored search location & triggers new search
      props.updateSearchLocation(newLocation);
      // updates search option list with single value
      setSearchResultArray([newLocation]);
      // turns off popular location label (at top of search option list)
      if (popularLocationActive) {
        setPopularLocationActive(false);
      }
      props.setActiveSearch(false);
      // turns off text input
      textInputRef.current.blur();
    }
    else {
      // introduces a delay before closing searchModal to avoid a flash (of search results truning grey when modal closes)
      setTimeout(() => {
        // updates text input
        setLocationInputText(newLocation.name);
        // updates search option list with single value
        setSearchResultArray([newLocation]);
        // turns off popular location label (at top of search option list)
        if (popularLocationActive) {
          setPopularLocationActive(false);
        }
  props.setActiveSearch(false);
}, "100");

    }








  };

  // opens dropdown (large view) / searchModal (small view) and clears text input value if stored search value is set to "map area"
  const locationSearch = () => {
    // if stored search location is "map area", text input value is set to  "" and search option list is reset to defaults
    if (props.searchLocation.name === "map area") {
      console.log("locationSearch2");
      setLocationInputText("");
      setSearchResultArray(popularLocationArray);
      setPopularLocationActive(true);
    }
    // opens dropdown / search modal
    props.setActiveSearch("location");
    textInputRef.current.focus();
  };

  // handles keyDown event when text input is active - used to navigate dropdown menu options
  const handleKeyPress = (event) => {
    // if key is tab or down arrow highlight the next option (below) and remove highlight from prev highlighted option
    if (event.keyCode === 9 || event.keyCode === 40) {
      // if highlightedDdOption set to false, the first item in dropdown option list is highlighted (as zero is falsey, !== "number" is used instead)
      if (typeof highlightedDdOption !== "number") {
        setHighlightedDdOption(0);
        searchResultArrayRef.current[0].classList.add("highlighted");
      }
      // if highlightedDdOption already set to a number (and the next option does not exceed the length of the array), the highlighted option is increment by one and previous option highlighting removed
      else {
        const nextOption = highlightedDdOption + 1;
        if (nextOption < searchResultArray.length) {
          searchResultArrayRef.current[highlightedDdOption].classList.remove(
            "highlighted"
          );
          searchResultArrayRef.current[nextOption].classList.add("highlighted");
          setHighlightedDdOption(nextOption);
        }
      }
    }

    // if key is up arrow highlight the next option (above) and remove highlight from prev highlighted option
    else if (event.keyCode === 38) {
      // if highlighted option array position is greater than 0 (i.e. at least second on the list), code for moving up the list is triggered
      if (highlightedDdOption > 0) {
        // new option highlighted, prev option unhighlighted and new option stored in state
        const nextOption = highlightedDdOption - 1;
        searchResultArrayRef.current[highlightedDdOption].classList.remove(
          "highlighted"
        );
        searchResultArrayRef.current[nextOption].classList.add("highlighted");
        setHighlightedDdOption(nextOption);
      }
    }
    // if key is enter or return. currently highlighted option is selected and highlighted option, active key and text input are reset
    else if (event.keyCode === 13 || event.keyCode === 14) {
      if (typeof highlightedDdOption === "number") {
        selectLocation(searchResultArray[highlightedDdOption]);
        setHighlightedDdOption(false);
        // turns off text input
        textInputRef.current.blur();
      }
    }
  };

  // updates text input value when user inputs text
  const textInputHandler = (event) => {
    const newInputValue = event.target.value;
    // if text input string length is zero, search options list is set to default popular options
    if (newInputValue.length === 0) {
      setLocationInputText(newInputValue);
      setPopularLocationActive(true);
      setSearchResultArray(popularLocationArray);
    }
    // text input string is matched against location names in allLocationArray and the top 4 are taken as the search option list
    else {
      // turn off popular location label
      setPopularLocationActive(false);
      // set location text input to new input string
      setLocationInputText(newInputValue);
      let count = 0;
      let activeLocations = [];
      // match input text string to first letters of location names in allLocationArray
      for (let i = 0; i < allLocationArray.length; i++) {
        // convert text input to lower case
        const inputLowerCase = newInputValue.toLowerCase();
        // get first x letters of location name in current array element and convert to lower case
        const locationNameFragment = allLocationArray[i].name
          .substring(0, inputLowerCase.length)
          .toLowerCase();
        // compare text string against location name fragment, if match push to active search option array
        if (inputLowerCase === locationNameFragment) {
          activeLocations.push(allLocationArray[i]);
          count++;
        }
        // stop when active search option array reaches 4 in length
        if (count > 3) {
          break;
        }
      }
      // set options as search reault list
      setSearchResultArray(activeLocations);
    }
  };

  // deletes text input value when user inputs clicks on cross button
  const deleteInputText = (e) => {
    e.stopPropagation();
    // sets search results to default popular locations
    setSearchResultArray(popularLocationArray);
    // turns on popular location label (at top of search option list)
    setPopularLocationActive(true);
    // clears location input text
    setLocationInputText("");
    textInputRef.current.focus();
  };

  // when searchResultArray (active list of dropdown/seachmodal options) updates, refs for options list are updated, highlighted option and activeKey are reset and scroll back to top of options list
  useEffect(() => {
    if (searchResultArray) {
      searchResultArrayRef.current = searchResultArrayRef.current.slice(
        0,
        searchResultArray.length
      );
      setHighlightedDdOption(false);
    }
  }, [searchResultArray]);

  if (largeView) {
    return (
      <header className="search-map-nav-h1v">
        <div className="search-map-nav-c1x">
          <a href="/" className="search-map-nav-jk9">
            mic's portfolio
          </a>
        </div>
        <div className="search-map-nav-c7e" ref={searchbarRef}>
          <nav className="search-map-nav-pl4">
            <div className="search-map-nav-ga1" onClick={locationSearch}>
              <label className="search-map-nav-f6t" htmlFor="locationInputText">
                <div>
                  <div className="search-map-nav-snp">Location</div>
                  <input
                    className="search-map-nav-1yi"
                    id="locationInputText"
                    placeholder="Search Locations"
                    type="text"
                    name="name"
                    autoComplete="off"
                    onKeyDown={handleKeyPress}
                    onChange={textInputHandler}
                    value={locationInputText}
                    ref={textInputRef}
                  />
                </div>
              </label>
              <div
                className={
                  props.activeSearch && locationInputText.length > 0
                    ? "search-map-nav-gs1"
                    : "search-map-nav-gs2"
                }
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  aria-label="Clear Input"
                  type="button"
                  className="cross_button_10r"
                  onClick={(e) => deleteInputText(e)}
                >
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cross_button_fa3"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path d="m6 6 20 20"></path>
                    <path d="m26 6-20 20"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="search-map-nav-ll9">
              <button
                className="search-map-nav-q1e"
                type="button"
                onClick={() => props.handleNavSearchClick()}
              >
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  className="svg_search_lg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                >
                  <g fill="none">
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                  </g>
                </svg>
              </button>
            </div>
            {props.activeSearch ? (
              <>
                <div className="search-map-nav-mm2" onClick={closeDropdown} />
                <div className="search-map-nav-xhc">
                  <div className="search-map-nav-ue3">
                    <div
                      className="search-map-nav-k3s"
                      role="listbox"
                      aria-label="Search suggestions"
                      tabindex="-1"
                    >
                      {popularLocationActive ? (
                        <div className="search-map-nav-pa9">popular locations</div>
                      ) : null}
                      {searchResultArray.length > 0 ? (
                        searchResultArray.map((x, i) => (
                          <div
                            key={x + i + searchResultArray.length}
                            ref={(el) => (searchResultArrayRef.current[i] = el)}
                            className="search-map-nav-uzo"
                            onClick={() => selectLocation(x)}
                          >
                            <div className="search-map-nav-bi8">
                              <svg
                                className="search-map-nav-iu5"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="presentation"
                                focusable="false"
                              >
                                <path d="m15.9999.33325c6.4433664 0 11.6667 5.22332687 11.6667 11.66665 0 .395185-.0196984.7942624-.0585936 1.1970109-.3656031 3.7857147-2.3760434 7.7525726-5.487905 11.7201691-1.1932825 1.5214248-2.4696691 2.9382012-3.7464266 4.2149447l-.264609.2625401-.2565836.2505683-.4871024.4643445-.3377669.3126669-.2592315.2338445-.7684829.6644749-.6531219-.5633124-.7123549-.6476755-.4871002-.4643445c-.1682693-.1630063-.3422204-.3341398-.5211901-.5131084-1.2767516-1.2767436-2.5531323-2.69352-3.74640918-4.2149449-3.11184685-3.9675963-5.12227757-7.9344539-5.48787896-11.7201677-.03889501-.4027484-.05859326-.8018256-.05859326-1.1970105 0-6.44329813 5.22335863-11.66665 11.66665-11.66665zm0 2c-5.3387224 0-9.66665 4.32792195-9.66665 9.66665 0 .3301812.01653349.665142.04933146 1.004757.32161647 3.3302606 2.17313947 6.9835713 5.07084634 10.6781398.9771881 1.2459122 2.0157692 2.4217661 3.0628871 3.5026159l.5240256.5323924.4974749.4897834.4621846.4404115.2257179-.2133444.4810251-.4660964.252726-.2507558c1.2232503-1.2232369 2.4468714-2.5814442 3.5869296-4.0350084 2.8977203-3.6945683 4.7492518-7.3478787 5.0708697-10.6781384.0327981-.3396149.0493317-.6745755.0493317-1.0047566 0-5.33875305-4.3279026-9.66665-9.6667-9.66665zm.0001 4.66675c2.7614237 0 5 2.23857625 5 5 0 2.7614237-2.2385763 5-5 5s-5-2.2385763-5-5c0-2.76142375 2.2385763-5 5-5zm0 2c-1.6568542 0-3 1.3431458-3 3s1.3431458 3 3 3 3-1.3431458 3-3-1.3431458-3-3-3z"></path>
                              </svg>
                            </div>
                            <div className="search-map-nav-182">{x.name}</div>
                          </div>
                        ))
                      ) : (
                        <div className="search-map-nav-jp4">
                          <div className="search-map-nav-182">no matches</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </nav>
        </div>
        <div className="search-map-nav-c1kb">
          {" "}
          <button
            className="search-map-nav-ly8"
            onClick={() => dispatch(updateMainModal("hotelApp"))}
          >
            item info
          </button>
        </div>
      </header>
    );
  } else {
    return (
      <>
        {/* fix for scroll bounce on firefox iOS -  white block added at top of page to prevent overscroll showing overflow content underneath  */}
        <div className="search-map-nav-cc7" />
        <header className="search-map-nav-h1v">
          <nav className="search-map-nav-sd3" onClick={locationSearch}>
            <div className="search-map-nav-ie1">
              <label className="search-map-nav-f6t">
                <div>
                  <div className="search-map-nav-snp">Location</div>
                  <div className="search-map-nav-1yi">
                    {props.searchLocation.name.length > 0 ? (
                      props.searchLocation.name
                    ) : (
                      <span className="search-map-nav-ds1">
                        Search countries
                      </span>
                    )}{" "}
                  </div>
                </div>
              </label>
            </div>
            <div className="search-map-nav-ll9">
              <div className="search-map-nav-ah2">
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  className="svg_search_lg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                >
                  <g fill="none">
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                  </g>
                </svg>
              </div>
            </div>
          </nav>
        </header>
        {props.activeSearch ? (
          <SearchModal
            closeModal={closeSearchModal}
            searchResultArray={searchResultArray}
            textInputHandler={textInputHandler}
            selectLocation={selectLocation}
            locationInputText={locationInputText}
            setLocationInputText={setLocationInputText}
            popularLocationActive={popularLocationActive}
            textInputRef={textInputRef}
            deleteInputText={deleteInputText}
          />
        ) : null}
      </>
    );
  }
}

export default HotelAppNav;
