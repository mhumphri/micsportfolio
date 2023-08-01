import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/dropdown.css";


function Dropdown(props) {

const [inputValue, setInputValue] = useState();


    return (
      <div className="dropdown-st42">
        <label className="dropdown-hq78">
          xxxx
          <span className="dropdown-mm33" />
        </label>
        <div className="dropdown-gw25">
          <select className="dropdown-nr45" value={inputValue} onChange={(event) => setInputValue(event.target.value)}>
            <option value="" >
                    Select an option
                </option>
                <option value="2993209637">
                    2023
                </option>
                <option value="2993209638">
                    2024
                </option>

          </select>
        </div>
      </div>
    );

  }

export default Dropdown;
