import { createSlice } from "@reduxjs/toolkit";
import getHotelArrayInit from "../../hotelApp/functions/getHotelArrayInit";

const initialState = {
  hotelArray: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ],
  navigateAway: false,
  savedMapData: {},
  mapBbox: false,
  numberHotels: 1000,
  maxPages: false,
  activePage: 1,
  searchLocation: { name: "" },
  expandMapView: false,
  markerStateObject: {},
  activeMarker: false,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    updateHotelArray(state, action) {
      state.hotelArray = action.payload;
    },
    updateNavigateAway(state, action) {
      state.navigateAway = action.payload;
    },
    updateSavedMapData(state, action) {
      state.savedMapData = action.payload;
    },
    updateMapBbox(state, action) {
      state.mapBbox = action.payload;
    },
    updateNumberHotels(state, action) {
      state.numberHotels = action.payload;
    },
    updateMaxPages(state, action) {
      state.maxPages = action.payload;
    },
    updateActivePage(state, action) {
      state.activePage = action.payload;
    },
    updateSearchLocationRedux(state, action) {
      state.searchLocation = action.payload;
    },
    updateExpandMapView(state, action) {
      state.expandMapView = action.payload;
    },
    updateMarkerStateObject(state, action) {
      let newMarkerStateObject = {... state.markerStateObject};
      newMarkerStateObject[action.payload] = true;
      state.markerStateObject = newMarkerStateObject;
    },
    refreshMarkerStateObject(state, action) {
      state.markerStateObject = action.payload;
    },
    updateActiveMarker(state, action) {
      state.activeMarker = action.payload;
    },
  },
});

export const {
  updateHotelArray,
  updateNavigateAway,
  updateSavedMapData,
  updateMapBbox,
  updateNumberHotels,
  updateMaxPages,
  updateActivePage,
  updateSearchLocationRedux,
  updateExpandMapView,
  updateMarkerStateObject,
  updateActiveMarker,
  refreshMarkerStateObject,
} = modalsSlice.actions;

export default modalsSlice.reducer;
