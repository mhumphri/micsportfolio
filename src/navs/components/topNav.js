import React from "react";
import { useDispatch } from "react-redux";
import { updateMainModal } from "../../redux/modals/modalsSlice";
import "../css/topNav.css";

// renders header and nav for site -  layout can be set using itemName url parameter and is reposnive to screen size (CSS)

function TopNav(props) {
  // redux hook for dispatching data
  const dispatch = useDispatch();


  return (

    <>
    {/* fix for scroll bounce on firefox iOS -  white block added at top of page to prevent overscroll showing overflow content underneath  */}
      <div className="topnav-cc7" />
    <header className="topnav-df5">
      <nav className={props.narrow ? "topnav-pn1 narrow" : "topnav-pn1"}>
        <div className={props.narrow ?  "topnav-po9 narrow" : "topnav-po9"}>
          <a href="/"className="topnav-jk9">mic's portfolio</a>
          {/* display "item info" button if item-name url parameter is set */}
          {props.itemName ? (
            <button
              className="topnav-ly8"
              onClick={() => dispatch(updateMainModal(props.itemName))}
            >
              item info
            </button>
          ) : null}
        </div>
        {/* display github image and link if no item-name url parameter is set */}
        {props.itemName ? null : (
          <a className="topnav-lb9" href="https://github.com/mhumphri/micsportfolio" target="_blank" rel="noreferrer" >
            <img
              alt="GitHub Logomark"
              className="topnav-ek4"
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            />
          </a>
        )}
      </nav>
    </header>
  </>
  );
}

export default TopNav;
