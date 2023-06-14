import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../css/paginationNav.css";

// search results page selection nav which appears at bottom of resultsList.js - different layouf for large / small view

function PaginationNav(props) {
  // boolean for current view (i.e. large or small) (stored in redux)
  const largeView = useSelector((state) => state.deviceData.largeView);
  // stores current state of render for page number options (large view only)
  const [paginationRender, setPaginationRender] = useState(1);
  // booleans holding state of rhs/lhs chevrons (i.e. can be inactive if not possible to navigate further in that direction)
  const [nextChevron, setNextChevron] = useState(true);
  const [prevChevron, setPrevChevron] = useState();

  // updates state of rhs/lhs chevrons when either active page or max pages update.
  useEffect(() => {
    // if active page same or greater than max possible pages, rhs chevron is disabled
    if (props.activePage >= props.maxPages) {
      setNextChevron(false);
    } else {
      setNextChevron(true);
    }
    // if active page is 1 it is not possible to navigate to a lower page number so lhs is disabled
    if (props.activePage === 1) {
      setPrevChevron(false);
    } else {
      setPrevChevron(true);
    }
  }, [props.activePage, props.maxPages]);



  // triggers update of the render for the page selector input when props.activePage, props.numberHotels or props.maxPages updates
  useEffect(() => {

    // render for the central part of page selector input (section between the chevrones showing groups page number buttons which are separated by elipsis when they break to a new number level) at the bottom of the search page
    const updatePaginationRender = () => {
      // initialises array containing numbers and elipsis' (represented as false)
      let renderArray = [];

      // depending on the max number of pages and currently active page, a selection of different renders are used for displaying page numbers (and elipsis) in the pagination nav. the number selection and elsipsis inclusion are put in the renderArray here
      if (props.maxPages <= 7) {
        for (let i = 0; i < props.maxPages; i++) {
          renderArray.push(i + 1);
        }
      } else {
        if (props.activePage < 4) {
          renderArray = [1, 2, 3, 4, false, props.maxPages];
        } else if (props.activePage > 3 && props.activePage < props.maxPages - 2) {
          renderArray = [
            1,
            false,
            props.activePage - 1,
            props.activePage,
            props.activePage + 1,
            false,
            props.maxPages,
          ];
        } else if (props.activePage > props.maxPages - 3) {
          renderArray = [
            1,
            false,
            props.maxPages - 3,
            props.maxPages - 2,
            props.maxPages - 1,
            props.maxPages,
          ];
        }
      }

      // initialises array for storing render of page number options and elsipsis
      let newPaginationRender = [];

      // loops through renderArray and inserts button for page number (with active page highlighted) and elipsis (shown as false in renderArray) where specified
      for (let i = 0; i < renderArray.length; i++) {
        if (renderArray[i] && renderArray[i] === props.activePage) {
          // render for currently active page number button
          newPaginationRender.push(
            <button
              aria-current="page"
              disabled=""
              aria-disabled="true"
              role="link"
              type="button"
              className="_u60i7ub"
              onClick={() => props.goToPage(renderArray[i])}
            >
              {renderArray[i]}
            </button>
          );
        }
        // render for not currently active page number button
        else if (renderArray[i] && renderArray[i] !== props.activePage) {
          newPaginationRender.push(
            <button
              className="_833p2h"
              onClick={() => props.goToPage(renderArray[i])}
            >
              {renderArray[i]}
            </button>
          );
        }
        // render for elipsis (which separates groups of page number buttons)
        else {
          newPaginationRender.push(<span className="_3bjjf5">…</span>);
        }
      }
      setPaginationRender(newPaginationRender);
    };

    updatePaginationRender();
  }, [props.activePage, props.numberHotels, props.maxPages, props]);

  if (largeView) {
    return (
      <nav className="page-nav-nz3">
        <button
          aria-label="Previous"
          aria-disabled="true"
          role="link"
          type="button"
          className="page-nav-zh2"
          disabled={prevChevron ? false : true}
          onClick={() => props.goToPage(props.activePage - 1)}
        >
          <svg
            className="page-nav-ow2"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
          >
            <g fill="none">
              <path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path>
            </g>
          </svg>
        </button>

        {paginationRender}
        <button
          aria-label="Next"
          className="page-nav-pt3"
          disabled={nextChevron ? false : true}
          onClick={() => props.goToPage(props.activePage + 1)}
        >
          <svg
            className="page-nav-ow2"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
          >
            <g fill="none">
              <path d="m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932"></path>
            </g>
          </svg>
        </button>
      </nav>
    );
  } else {
    return (
      <div className="page-nav-sj2">
        <div className="page-nav-al1">
          <div className="page-nav-j4d" role="navigation" aria-label="pagination">
            <div className="page-nav-1wg">
              <button
                aria-disabled={prevChevron ? "false" : "true"}
                aria-label="Previous page"
                type="button"
                className="page-nav-1kj"
                disabled={prevChevron ? false : true}
                onClick={() => props.goToPage(props.activePage - 1)}
              >
                <svg
                  className="page-nav-lx7"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                >
                  <g fill="none">
                    <path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path>
                  </g>
                </svg>
              </button>
            </div>
            <div className="page-nav-1wg">
              <button
                aria-disabled={nextChevron ? "false" : "true"}
                aria-label="Next page"
                className="page-nav-1kj"
                disabled={nextChevron ? false : true}
                onClick={() => props.goToPage(props.activePage + 1)}
              >
                <svg
                  className="page-nav-lx7"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                >
                  <g fill="none">
                    <path d="m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaginationNav;
