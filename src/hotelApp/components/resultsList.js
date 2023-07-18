import React from "react";
import IndListItem from "./indListItem";
import PaginationNav from "./paginationNav";
import "../css/resultsList.css";

// top level component for search results list view - contains logic for controlling mock "data loading" styles

function ResultsList(props) {

  return (
    <>
      <div className="results-list-yt6">
        <span className={props.dataLoading ? "results-list-kb8" : ""}>
          {props.numberHotels > 999 ? "1,000+" : props.numberHotels} results
        </span>
      </div>
      <div className="results-list-na8">
        <div ref={props.listContainerRef} className="results-list-lq1">
          {props.hotelArray.map((x, index) => (
            <IndListItem
              listItemLoading={props.dataLoading}
              itemId={index}
              key={index}
              hotelData={x}
              setActiveLink={props.setActiveLink}
              hoverHotel={props.hoverHotel}
              setHoverHotel={props.setHoverHotel}
              navigateAway={props.navigateAway}
            />
          ))}
        </div>

        <PaginationNav
          activePage={props.activePage}
          maxPages={props.maxPages}
          goToPage={props.goToPage}
          numberHotels={props.numberHotels}
        />
      </div>
    </>
  );
}

export default ResultsList;
