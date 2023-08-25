import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/dropdown.css";


function Dropdown(props) {

const [inputValue, setInputValue] = useState();


    return (
      <div className="dropdown-st42">
        <label className="dropdown-hq78">
          {props.label}
          {props.required ? <span className="dropdown-mm33" /> : null}
        </label>
         <div className="dropdown-gw25">
          <select className="dropdown-nr45" value={inputValue} onChange={(event) => setInputValue(event.target.value)}>
            {props.optionsArray.map((x) => (
              <option key={x.value} value={x.value}>
                  {x.label}
              </option>
            ))}
          </select>
        </div>
        <div
          className={
            props.warning
              ? "form-input-fw9"
              : "form-input-fw9 hidden"
          }
        >
          Please enter address line 2.
        </div>
      </div>
    );

  }

export default Dropdown;
