import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateNavigateAway } from "../../redux/hotelApp/hotelAppSlice";
import getHref from "../functions/getHref";
import SwipeableGallery from "./swipeableGallery";
import "../css/indListItem.css";

// render for individual hotel search result (appearing in resultsList.js)

function IndListItem(props) {
  // redux hook for dispatching data
  const dispatch = useDispatch();
  // boolean indicating if item is currently loading (used to imitate server loading delay)
  const [indItemLoading, setIndItemLoading] = useState(props.navigateAway ? false : true);

  //  controls delay for individual search result (adding on small random additonal delay) when props.listItemLoading in the parent component (resultsList.js) updates
  useEffect(() => {
    if (!props.listItemLoading) {
      // random delay added
      let msDelay = props.itemId * 50;

      // loading state changed to false after random delay timeout
      setTimeout(() => {
        setIndItemLoading(false);
      }, msDelay);
    } else {
      setIndItemLoading(true);
    }
  }, [props.listItemLoading, props.itemId]);

  // activates chevron styling and active item in reponse to mouse entering
  const handleMouseEnter = () => {
    props.setHoverHotel(props.hotelData.key);
  };

  // de-activates chevron styling and active item in reponse to mouse entering
  const handleMouseLeave = () => {
    props.setHoverHotel(false);
  };

  const navigate = useNavigate();

  const navigateToProperty = () => {
    const href = getHref(props.hotelData.hotelDataKey)
     navigate(href);
     dispatch(updateNavigateAway(true))
  }

  return (
    <div
      className="ind-list-item-la6"
      onClick={navigateToProperty}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={props.itemId}
    >
      <SwipeableGallery
        itemLoading={indItemLoading}
        photos={indItemLoading ? [] : props.hotelData.photos}
      />
      <div className="ind-list-item-gd5">
        <div className="ind-list-item-pq1">
          <div className="ind-list-item-lq2">
            <span className={indItemLoading ? "ind-list-item-oa3" : ""}>
              {props.hotelData ? props.hotelData.name : "hotel name placeholder"}
            </span>
          </div>

          <div
            className={
              indItemLoading
                ? "ind-list-item-hg3 text-loading "
                : "ind-list-item-hg3"
            }
            role="img"
          >
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              style={
                indItemLoading
                  ? {
                      display: "block",
                      height: "12px",
                      width: "12px",
                      fill: "#DDDDDD",
                    }
                  : {
                      display: "block",
                      height: "12px",
                      width: "12px",
                      fill: "currentcolor",
                    }
              }
              aria-hidden="true"
              role="presentation"
              focusable="false"
            >
              <path
                d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"
              ></path>
            </svg>
            <div className="ind-list-item-ma1">
              {props.hotelData ? props.hotelData.rating + " (" + props.hotelData.numReviews + ")" : "x.x (xxx)"}
            </div>
          </div>
        </div>
        <div>
          <div
            className={
              indItemLoading
                ? "ind-list-item-te8 text-loading"
                : "ind-list-item-te8"
            }
          >
            {props.hotelData ? props.hotelData.locationName : "location  placeholder"}
          </div>
        </div>
        <div>
          <div
            className={
              indItemLoading
                ? "ind-list-item-te8 text-loading"
                : "ind-list-item-te8"
            }
          >
            <span className="ind-list-item-al5">£{props.hotelData.price}</span>{" "}
            per night
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndListItem;
