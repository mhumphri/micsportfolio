import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  updateScreenDimensions,
  updateTouchScreen,
} from "./redux/deviceData/deviceDataSlice";
import TopNav from "./navs/components/topNav";
import Homepage from "./homepage/components/homepage";
import Widgets from "./widgets/components/widgets";
import HotelApp from "./hotelApp/components/hotelApp";
import Modal from "./modal/components/modal";
import DatepickersAll2 from "./datepickerX/components/datepickersAll2";

function App() {
  const dispatch = useDispatch();

  // main modal state (stored in redux)
  const mainModal = useSelector((state) => state.modals.mainModal);

  // listens for screen resize and updates screen width variable in redux
  useEffect(() => {
    // stores current screenwidth in redux
    const updateScreenWidth = () => {
      dispatch(
        updateScreenDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      );
    };
    updateScreenWidth();
    // detect if a "coarse pointer" - usually a touch screen - is the primary input device and stores touchScreen boolean in redux
    dispatch(updateTouchScreen(window.matchMedia("(pointer: coarse)").matches));
    window.addEventListener("resize", () => {
      updateScreenWidth();
    });
    return () => {
      window.removeEventListener("resize", () => {
        updateScreenWidth();
      });
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TopNav />
              <Homepage />
            </>
          }
        />
        <Route
          path="/widgets"
          element={
            <>
              <TopNav narrow={true} itemName="widgets" />
              <Widgets />
            </>
          }
        />
        <Route
          path="/hotel-app"
          element={
            <>
              <HotelApp />
            </>
          }
        />
        <Route
          path="/datepickers"
          element={
            <>
              <TopNav narrow={true} itemName="datepickers" />
              <DatepickersAll2 />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {mainModal ? <Modal /> : null}
    </Router>
  );
}

export default App;
