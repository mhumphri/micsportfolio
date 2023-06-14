import React from "react";
import { useSelector } from "react-redux";
import "../css/popoutBoxSm.css";

function PopoutBoxSm(props) {
  // viewport width & height (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);
  const screenHeight = useSelector((state) => state.deviceData.screenHeight);

  return (
    <div
      className={
        screenHeight < 500
          ? "popout-box-sm-yr3 low-screen-height"
          : "popout-box-sm-yr3"
      }
    >
      <div className="popout-box-sm-pm1" onClick={props.removeLargeMarker} />
      <div
        className="popout-box-sm-zt8"
        onClick={() => props.setActiveLink("/hotels/" + props.markerData.key)}
      >
        <div className="popout-box-sm-ks9">
          <div className="popout-box-sm-he6">
            <img
              className="popout-box-sm-ja7"
              alt="alt"
              src={props.markerData.photos[0]}
            />
          </div>
          <div className="popout-box-sm-fr3">
            <div>
              <div className="popout-box-sm-jh3">{props.markerData.name}</div>

              <div className="popout-box-sm-jh4">{props.markerData.locationName}</div>
            </div>

            <div>
              <div className="popout-box-sm-pp1">
                <div className="popout-box-sm-ll2">
                  <span className="popout-box-sm-al5">
                    £{props.markerData.price}
                  </span>{" "}
                  {screenWidth < 400 ? "night" : "per night"}
                </div>

                <div className="popout-box-sm-hh3">
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      display: "block",
                      height: "12px",
                      width: "12px",
                      fill: "black",
                    }}
                  >
                    <path
                      d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                  <div className="popout-box-sm-ma1">
                    {props.markerData.rating}{" "}
                    {screenWidth < 400
                      ? null
                      : " (" + props.markerData.numReviews + ")"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="popout-box-sm-pm1" onClick={props.removeLargeMarker} />
    </div>
  );
}

export default PopoutBoxSm;
