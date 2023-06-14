import React, { useState, useEffect, useRef, useCallback } from "react";
import "../css/datepicker.css";
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// responsive datePicker component
function DatePicker(props) {
  console.log("DatePicker")
  const dotwArray = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // active month being viewed in picker data - LHS month in large view above 850px (where two months are visible)
  const [currentMonth, setCurrentMonth] = useState(props.largeView ? 1 : 0);

  // manages position of calendar months as they slide in and out (large view only)
  const [trackStyle, setTrackStyle] = useState({
    transform: "translateX(0px)",
    width: "1564px",
  });
  // manages css style for months as they slide in and out (large view only)
  const [tabLg1Style, setTabLg1Style] = useState("_fdp53bg");
  const [tabLgLastStyle, setTabLgLastStyle] = useState("_kuxo8ai");
  // manages position of first calendar months as the months slide in and out (large view only)
  const [tabLg1Pos, setTabLg1Pos] = useState({});

  //  temporary checkin/out values - used for temp setting values when mouse hovers over dotm
  const [tempCheckout, setTempCheckout] = useState();
  const [tempCheckin, setTempCheckin] = useState();
  // checkin/out values stored locally (in practice could be stored elsewhere e.g. in parent component or redux)
  const [localCheckout, setLocalCheckout] = useState();
  const [localCheckin, setLocalCheckin] = useState();
  // set height of wrapper round full month picker - height may change when month chages as number of weeks in month can vary
  const [pickerHeight, setPickerHeight] = useState(350);
  // stores datepicker dimensions for a single panel render in large view - responsive to container width
  const [singlePanelDimensions, setSinglePanelDimensions] = useState({});
  // stores datepicker dimensions for a double panel render in large view - responsive to container width
  const [doublePanelDimensions, setDoublePanelDimensions] = useState({});
  // stores datepicker dimensions for slider track (width and horizontal movement) - responsive to container width
  const [sliderTrackDimensions, setSliderTrackDimensions] = useState({});
  // number of months visible in small view
  const [visibleMonths, setVisibleMonths] = useState(4);
  // Boolean which records whether last date to be set was checkin or checkout - for setDate() logic for small view.
  const [checkinLastSelected, setCheckinLastSelected] = useState();
  // ref for container which controls height of datepicker - ref used to control css styles (switch on/off transition/animation, so it isn't animated when change is a result of container width changing)
  const [pickerHeightStyle, setPickerHeightStyle] = useState("none");
  // calendar data object
  const [calendarData, setCalendarData] = useState();



  // initialises calendar data upon component load
  useEffect(() => {
    // two year period
    let numMonths = 24;
    //  let firstDayOfMonth = dayjs().utc().startOf("month");
    let firstDayOfMonth = dayjs().startOf("month");

    if (props.largeView) {
      // 26 months is used for a two year perios as we need to bookend the datepicker with a month either side for sliding effect
      numMonths = 26;
      // one month is subtracted for today as we need the previous month to bookedn for the sliding effect
      // firstDayOfMonth = dayjs().utc().subtract(1, "month").startOf("month");
      firstDayOfMonth = dayjs().subtract(1, "month").startOf("month");
    }

    let monthArray = [];

    // makes array of first day of month for specified number of months
    for (let i = 0; i < numMonths; i++) {
      // need to add .startOf('month') to avoid summer time complications
      const newFDOM = dayjs(firstDayOfMonth).add(i, "month").startOf("month");
      monthArray.push(newFDOM);
    }

    // makes array of objects containing month data - name of month and aray of dates
    let monthObjectArray = [];
    for (let j = 0; j < numMonths; j++) {
      const monthName = dayjs(monthArray[j]).format("MMMM YYYY");
      const startDate = monthArray[j];
      // const endDate = dayjs(monthArray[j]).utc().endOf("month");
      const endDate = dayjs(monthArray[j]).endOf("month");

      // adds 'false' elements at start of dotmArray for empty days at start of month
      let dotmArray = [];
      let firstDay = dayjs(startDate).day();
      // dayjs has sunday as zero but need it as 7
      if (firstDay === 0) {
        firstDay = 7;
      }

      for (let k = 1; k < firstDay; k++) {
        dotmArray.push(false);
      }

      // adds all the dotm to dotmArray
      let currentDate = startDate;
      while (currentDate <= endDate) {
        dotmArray.push(currentDate);
        currentDate = dayjs(currentDate).add(1, "day");
      }

      // adds 'false' elements at end of dotmArray for empty days at start of month
      let lastDay = dayjs(endDate).day();
      // dayjs has sunday as zero but need it as 7
      if (lastDay === 0) {
        lastDay = 7;
      }
      const remainingDays = 7 - lastDay;

      for (let l = 0; l < remainingDays; l++) {
        dotmArray.push(false);
      }

      // bring together monthName and dotmArray to create month object
      const monthObject = {
        monthName: monthName,
        dotmArray: dotmArray,
      };

      // adds object for this month to all Month array
      monthObjectArray.push(monthObject);
    }
    setCalendarData(monthObjectArray);
  }, [props.largeView]);


  const calcPickerHeight = useCallback((newMonth) => {
    if (calendarData) {
      let baseMonth = newMonth;
      // if a new month is not provided as an argument, use current month from state as baseMonth
      if (!newMonth) {
        baseMonth = currentMonth;
      }

      const numRows1 = Math.ceil(calendarData[baseMonth].dotmArray.length / 7);
      const numRows2 = Math.ceil(
        calendarData[baseMonth + 1].dotmArray.length / 7
      );

      let newPickerHeight;

      if (props.doublePanel) {
        const dateHeight = (props.width - 130) / 14 - 2;
        let numRows = numRows1;
        if (numRows2 > numRows1) {
          numRows = numRows2;
        }
        newPickerHeight = dateHeight * numRows + 120;
      } else {
        const dateHeight = (props.width - 76) / 7 - 2;
        newPickerHeight = dateHeight * numRows1 + 120;
      }

      return newPickerHeight;
    }
  }, [props.doublePanel, props.width, calendarData, currentMonth]);;

  // calcs width of dotm & dotw divs plus outer wrapper in samll view - varies with screenWidth in samll view
  const calcPickerDimensions = useCallback(() => {
    let dimensions = {};
    if (props.largeView) {
      if (props.doublePanel) {
        dimensions = {
          dotm: (props.width - 130) / 14 - 2,
          dotw: (props.width - 130) / 14,
        };
      } else {
        dimensions = {
          dotm: (props.width - 76) / 7 - 2,
          dotw: (props.width - 76) / 7,
        };
      }
    } else {
      let newDotw = Math.round((props.width - 77) / 7);
      if (newDotw > 70) {
        newDotw = 70;
      }
      dimensions = {
        dotm: newDotw - 2,
        dotw: newDotw,
        outer: newDotw * 7 + 27,
      };
    }
    return dimensions;
  }, [props.doublePanel, props.largeView, props.width]);

  // initialises data upon page load
  useEffect(() => {

    const calcSinglePanelDimensions = () => {
      const newSinglePanelDimensions = {
        outerContainer: props.width - 2,
        outerContainer2: props.width - 3,
        dateWidth: (props.width - 76) / 7 - 2,
        dateHeight: (props.width - 76) / 7 - 2,
        dotwWidth: (props.width - 76) / 7,
        // sliderTrackWidth: (props.width-76)*4,
      };

      return newSinglePanelDimensions;
    };

    const calcDoublePanelDimensions = () => {
      const newDoublePanelDimensions = {
        outerContainer: props.width - 2,
        outerContainer2: props.width - 3,
        dateWidth: (props.width - 130) / 14 - 2,
        dateHeight: (props.width - 130) / 14 - 2,
        dotwWidth: (props.width - 130) / 14,
        // sliderTrackWidth: (props.width-76)*4,
      };

      return newDoublePanelDimensions;
    };

    const calcSliderTrackDimensions = () => {
      if (props.doublePanel) {
        return {
          trackWidth: (props.width - 21) * 2,
          horizontalMovement: (props.width - 21) / 2,
        };
      } else {
        return {
          trackWidth: (props.width - 21) * 4,
          horizontalMovement: props.width - 21,
        };
      }
    };

    setPickerHeightStyle("unset");
    setPickerDimensions(calcPickerDimensions());
    setSinglePanelDimensions(calcSinglePanelDimensions());
    setDoublePanelDimensions(calcDoublePanelDimensions());
    setPickerHeight(calcPickerHeight());
    setSliderTrackDimensions(calcSliderTrackDimensions());
  }, [props.width, props.doublePanel, calcPickerHeight, calcPickerDimensions]);

  // contains width of dotm & dotw divs plus outer wrapper in samll view - varies with screenWidth in samll view
  const [pickerDimensions, setPickerDimensions] = useState(
    calcPickerDimensions()
  );



  // updates selected date range and active date input field on the nav
  const setDate = (newDate) => {
    // updates both local active date and global active date (in redux) when user clicks on dotm
    const updateCheckin = (newDate) => {
      setLocalCheckin(newDate);
      setTempCheckin(newDate);
      setCheckinLastSelected(true);
    };

    const updateCheckout = (newDate) => {
      setLocalCheckout(newDate);
      setTempCheckout(newDate);
      setCheckinLastSelected(false);
    };

    if (!localCheckin) {
      updateCheckin(newDate);
    }
    if (localCheckin && !localCheckout) {
      if (dayjs(newDate).isSameOrAfter(localCheckin, "day")) {
        updateCheckout(newDate);
      } else {
        updateCheckin(newDate);
      }
    }
    if (localCheckin && localCheckout) {
      if (!checkinLastSelected) {
        if (dayjs(newDate).isBefore(localCheckout, "day")) {
          updateCheckin(newDate);
        } else {
          updateCheckin(newDate);
          updateCheckout(false);
        }
      } else {
        if (dayjs(newDate).isSameOrBefore(localCheckin, "day")) {
          updateCheckin(newDate);
          updateCheckout(false);
        } else {
          updateCheckout(newDate);
        }
      }
    } else {
      if (props.largeNav === "checkin") {
        updateCheckin(newDate);
        if (localCheckout && dayjs(newDate).isAfter(localCheckout, "day")) {
          updateCheckout(false);
        }
        props.setLargeNav("checkout");
      }

      if (props.largeNav === "checkout") {
        if (dayjs(newDate).isBefore(localCheckin, "day")) {
          updateCheckin(newDate);
          updateCheckout(false);
        } else if (!localCheckin) {
          updateCheckout(newDate);
          props.setLargeNav("checkin");
        } else {
          updateCheckout(newDate);
        }
      }
    }
  };

  // moves forward active month by one (largeView only)
  const moveForward = () => {
    if (currentMonth < calendarData.length - 3) {
      setTabLgLastStyle("_1lds9wb");
      setTrackStyle({
        transform:
          "translateX(-" + sliderTrackDimensions.horizontalMovement + "px)",
        width: sliderTrackDimensions.trackWidth + "px",
        transition: "transform 200ms ease-in-out 0s",
      });
      setPickerHeightStyle("height 0.2s ease-in-out 0s");
      setPickerHeight(calcPickerHeight(currentMonth + 1));
      setTimeout(() => {
        setTrackStyle({
          transform: "translateX(0px)",
          width: singlePanelDimensions.sliderTrackWidth + "px",
        });
        setTabLgLastStyle("_kuxo8ai");
        setCurrentMonth(currentMonth + 1);
      }, "200");
    }
  };

  // moves active month back by one (largeView only)
  const moveBack = () => {
    if (currentMonth > 1) {
      setTabLg1Pos({
        position: "absolute",
        left: -sliderTrackDimensions.horizontalMovement + "px",
      });
      setTabLg1Style("_1lds9wb");
      setTrackStyle({
        transform: "translateX(391px)",
        width: singlePanelDimensions.sliderTrackWidth + "px",
        transition: "transform 200ms ease-in-out 0s",
      });
      setPickerHeightStyle("height 0.2s ease-in-out 0s");
      setPickerHeight(calcPickerHeight(currentMonth - 1));
      setTimeout(() => {
        setTabLg1Pos({});
        setTrackStyle({
          transform: "translateX(0px)",
          width: singlePanelDimensions.sliderTrackWidth + "px",
        });
        setTabLg1Style("_fdp53bg");
        setCurrentMonth(currentMonth - 1);
      }, "200");
    }
  };

  // sets local checkin / checkout date if mouse hovers over dotm
  const dateHover = (e, date) => {
    e.stopPropagation();
    if (localCheckin && !localCheckout) {
      if (dayjs(date).isBefore(dayjs(localCheckin), "day")) {
        setTempCheckout(false);
      } else {
        setTempCheckout(date);
      }
    }
    if (localCheckout && !localCheckin) {
      if (dayjs(date).isAfter(dayjs(localCheckout), "day")) {
        setTempCheckout(false);
      } else {
        setTempCheckin(date);
      }
    }
  };


  // sets temp checkin / checkout to false when mouse moves outside the outer container (so that dates temporarily highlighted by mouse hover are unhighlighted when mouse moves outside the datepicker component)
  const dateContainerHover = (e, date) => {
    if (localCheckin && !localCheckout) {
      setTempCheckout(false);
    }
    if (localCheckout && !localCheckin) {
      setTempCheckin(false);
    }
  };

  // creates calendar render for a single month, including the formatting etc of selected dates
  const monthRender = (monthData) => {
    const calendarData = monthData.dotmArray;
    let newRender = [];
    const numRows = Math.ceil(calendarData.length / 7);

    for (let i = 0; i < numRows; i++) {
      const rowStart = i * 7;
      const rowEnd = (i + 1) * 7;

      let newRow = [];
      for (let j = rowStart; j < rowEnd; j++) {
        // returns true / false if before current date or not
        const inPast = dayjs(calendarData[j]).isBefore(dayjs(), "day");
        // adds an empty <td> if day is before start of month
        if (!calendarData[j]) {
          newRow.push(<td></td>);
        } else {
          const checkin =
            tempCheckin && dayjs(calendarData[j]).isSame(tempCheckin, "day");

          const checkout =
            tempCheckout && dayjs(calendarData[j]).isSame(tempCheckout, "day");

          const betweenDay =
            tempCheckin &&
            tempCheckout &&
            dayjs(calendarData[j]).isAfter(tempCheckin, "day") &&
            dayjs(calendarData[j]).isBefore(tempCheckout, "day");

          // sets styles for mid-row days
          let style1 = "_xzo51qd";
          let style2 = "_6gi1qsw";
          if (inPast) {
            style1 = "_10rqnsul";
            style2 = "_1ct0t2";
          }
          // sets styles for selected day - checkin
          if (checkin) {
            style1 = "_16ylgctq";
            style2 = "_1nf2vyse";
          }
          // sets styles for selected day - checkout
          if (checkout) {
            style1 = "_1ba08hns";
            style2 = "_1nf2vyse";
          }
          // sets styles for selected day - in between checkin and checkout
          if (betweenDay) {
            style1 = "_1ifwywb1";
            style2 = "_gkknk2q";
          }
          // filters for days at start of row
          if (Number.isInteger(j / 7)) {
            style1 = "_12glnvbt";
            style2 = "_1gazwvry";
            if (inPast) {
              style1 = "_1k32kw4z";
              style2 = "_1ct0t2";
            }
            // sets styles for selected day - checkin
            if (checkin) {
              style1 = "_16ylgctq";
              style2 = "_1nf2vyse";
            }
            // sets styles for selected day - checkout
            if (checkout) {
              style1 = "_1kd8ctdu";
              style2 = "_161fiz8i";
            }
            // sets styles for selected day - in between checkin and checkout
            if (betweenDay) {
              style1 = "_7179yqh";
              style2 = "_119nin5s";
            }
          }
          // filters for days at end of row
          if (Number.isInteger((j + 1) / 7)) {
            // sets styles for unselected days
            style1 = "_uab5izv";
            style2 = "_1gazwvry";
            if (inPast) {
              style1 = "_874f7s1";
              style2 = "_1ct0t2";
            }
            // sets styles for selected day - checkin
            if (checkin) {
              style1 = "_8hxfazu";
              style2 = "_161fiz8i";
            }
            // sets styles for selected day - checkout
            if (checkout) {
              style1 = "_1ba08hns";
              style2 = "_1nf2vyse";
            }
            // sets styles for selected day - in between checkin and checkout
            if (betweenDay) {
              style1 = "_luu0gt5";
              style2 = "_ws34ciu";
            }
          }
          // sets styles if either checkin only  is selected
          if (checkin && !tempCheckout) {
            style1 = "_16d21rye";
            style2 = "_1ueso2fg";
          }

          // sets styles if either checkout only is selected
          if (checkout && !tempCheckin) {
            style1 = "_16d21rye";
            style2 = "_1ueso2fg";
          }

          // this section adjusts formatting if the dotm falls at the beginning or end of the month
          let overflow = false;
          let overflowForward = false;
          const startOfMonth = dayjs(calendarData[j]).isSame(
            dayjs(calendarData[j]).startOf("month"),
            "day"
          );
          const endOfMonth = dayjs(calendarData[j]).isSame(
            dayjs(calendarData[j]).endOf("month"),
            "day"
          );
          const isntSunday = dayjs(calendarData[j]).day() !== 0;
          const isntMonday = dayjs(calendarData[j]).day() !== 1;
          // formatting for end of month (if not Sunday)
          if (endOfMonth && betweenDay && isntSunday && !checkout) {
            overflow = true;
            overflowForward = true;
          }
          // formatting for end of month (if not Monday)
          if (startOfMonth && betweenDay && isntMonday && !checkin) {
            overflow = true;
          }

          // adds table element for start and end of month (if not Sunday or Monday)
          if (overflow) {
            newRow.push(
              <td
                class={style1}
                role="button"
                aria-disabled="false"
                aria-label="1, Thursday, December 2022. Available. Select as checkout date. "
                tabindex="-1"
                onClick={inPast ? null : () => setDate(calendarData[j])}
                aria-describedby="20221201"
                onMouseOver={
                  inPast ? null : (e) => dateHover(e, calendarData[j])
                }
              >
                <div className="_h84ua7">
                  <div class={overflowForward ? "_qxze2vs" : "_2ehw1pm"}></div>
                  <div
                    class={style2}
                    data-testid="calendar-day-01/12/2022"
                    data-is-day-blocked="false"
                    style={{
                      width: pickerDimensions.dotm + "px",
                      height: pickerDimensions.dotm + "px",
                    }}
                  >
                    {dayjs(calendarData[j]).format("D")}
                  </div>
                </div>
              </td>
            );
          } else {
            // adds table element for all other days of the month
            newRow.push(
              <td
                class={style1}
                role="button"
                aria-disabled="false"
                aria-label="29, Saturday, October 2022. Available. Select as check-in date. "
                tabindex="-1"
                onClick={inPast ? null : () => setDate(calendarData[j])}
                onMouseOver={
                  inPast ? null : (e) => dateHover(e, calendarData[j])
                }
              >
                <div
                  class={style2}
                  data-testid="calendar-day-29/10/2022"
                  data-is-day-blocked="false"
                  style={{
                    width: pickerDimensions.dotm + "px",
                    height: pickerDimensions.dotm + "px",
                  }}
                >
                  {dayjs(calendarData[j]).format("D")}
                </div>
              </td>
            );
          }
        }
      }
      newRender.push([<tr>{newRow}</tr>]);
    }

    if (props.largeView) {
      // add render elements around rows of dotm
      const monthRender = [
        <div
          className="_ytfarf"
          style={{ padding: "0px 27px" }}
          data-visible="true"
        >
          <div className="_ihvjx2">
            <section>
              <h2 tabindex="-1" className="_14i3z6h" elementtiming="LCP-target">
                {monthData.monthName}
              </h2>
            </section>
          </div>
          <table
            className="_cvkwaj"
            style={{ borderSpacing: "0px 2px" }}
            role="presentation"
          >
            <tbody>{newRender}</tbody>
          </table>
        </div>,
      ];
      return monthRender;
    } else {
      // add render elements around rows of dotm
      const monthRender = [
        <div>
          <div
            style={{ padding: "0px 13px" }}
            className="_ytfarf"
            data-visible="true"
          >
            <div className="_t720qti">
              <section>
                <h2 tabindex="-1" className="_14i3z6h" elementtiming="LCP-target">
                  {monthData.monthName}
                </h2>
              </section>
            </div>
            <table
              className="_cvkwaj"
              style={{ borderSpacing: "0px 2px" }}
              role="presentation"
            >
              <tbody>{newRender}</tbody>
            </table>
          </div>
        </div>,
      ];
      return monthRender;
    }
  };

  const visibleMonthsRender = () => {
    let newRender = [];
    for (let i = 0; i < visibleMonths; i++) {
      newRender.push(monthRender(calendarData[i], tempCheckin, tempCheckout));
    }
    return newRender;
  };

  const loadMoreDates = () => {
    if (visibleMonths < 24) {
      setVisibleMonths(visibleMonths + 4);
    }
  };

if (calendarData) {
  if (props.largeView) {
    return (
      <div className="_kasbqg">
        <div>
          <div>
            <div className="c1nifi44 fuhmdl6 l16t0m55 dir dir-ltr">
              <section>
                <div className="dir dir-ltr">
                  <div className="_1avex2v">
                    <div className="_u02imw">
                      <div id="tabs" aria-label="">
                        <div>
                          <div
                            role="tabpanel"
                            onMouseOver={() => dateContainerHover()}
                            onMouseLeave={() => dateContainerHover()}
                          >
                            <div className="_65d865">
                              <div className="dhjkeof dir dir-ltr">
                                <div className="_3hmsj">
                                  <div
                                    className="_g2s11rv"
                                    style={
                                      props.doublePanel
                                        ? {
                                            width:
                                              doublePanelDimensions.outerContainer +
                                              "px",
                                          }
                                        : {
                                            width:
                                              singlePanelDimensions.outerContainer +
                                              "px",
                                          }
                                    }
                                  >
                                    <div>
                                      <div
                                        style={
                                          props.doublePanel
                                            ? {
                                                width:
                                                  doublePanelDimensions.outerContainer2 +
                                                  "px",
                                              }
                                            : {
                                                width:
                                                  singlePanelDimensions.outerContainer2 +
                                                  "px",
                                              }
                                        }
                                      >
                                        <div
                                          className="_1x76l5m3"
                                          aria-hidden="true"
                                          role="presentation"
                                        >
                                          <div
                                            className="_2cafln"
                                            style={{
                                              left: "0px",
                                              padding: "0px 27px",
                                            }}
                                          >
                                            <ul className="_xv14sf">
                                              {dotwArray.map((x) => (
                                                <li
                                                  className="_92xroi"
                                                  style={{
                                                    width: props.doublePanel
                                                      ? doublePanelDimensions.dotwWidth
                                                      : singlePanelDimensions.dotwWidth +
                                                        "px",
                                                  }}
                                                >
                                                  {x}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                          {props.doublePanel ? (
                                            <div
                                              className="_2cafln"
                                              style={{
                                                left:
                                                  sliderTrackDimensions.horizontalMovement +
                                                  "px",
                                                padding: "0px 27px",
                                              }}
                                            >
                                              <ul className="_xv14sf">
                                                {dotwArray.map((x) => (
                                                  <li
                                                    className="_92xroi"
                                                    style={{
                                                      width:
                                                        doublePanelDimensions.dotwWidth +
                                                        "px",
                                                    }}
                                                  >
                                                    {x}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          ) : null}
                                        </div>
                                        <div
                                          className="_14676s3"
                                          tabindex="-1"
                                          role="application"
                                          aria-label="Calendar"
                                        >
                                          <div className="_5neba7a">
                                            <div className="_1d1qzab">
                                              <button
                                                aria-disabled="false"
                                                aria-label="Go back to switch to the previous month."
                                                type="button"
                                                className="_oda838"
                                                onClick={moveBack}
                                                disabled={
                                                  currentMonth < 2
                                                    ? true
                                                    : false
                                                }
                                              >
                                                <span className="_e296pg">
                                                  <svg
                                                    viewBox="0 0 18 18"
                                                    role="presentation"
                                                    aria-hidden="true"
                                                    focusable="false"
                                                    style={{
                                                      height: "12px",
                                                      width: "12px",
                                                      display: "block",
                                                      fill: "currentcolor",
                                                    }}
                                                  >
                                                    <path
                                                      d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z"
                                                      fill-rule="evenodd"
                                                    ></path>
                                                  </svg>
                                                </span>
                                              </button>
                                            </div>

                                            <div className="_qz9x4fc">
                                              <button
                                                aria-disabled="false"
                                                aria-label="Move forward to change to the next month."
                                                type="button"
                                                className="_oda838"
                                                onClick={moveForward}
                                                disabled={
                                                  currentMonth > 22
                                                    ? true
                                                    : false
                                                }
                                              >
                                                <span className="_e296pg">
                                                  <svg
                                                    viewBox="0 0 18 18"
                                                    role="presentation"
                                                    aria-hidden="true"
                                                    focusable="false"
                                                    style={{
                                                      height: "12px",
                                                      width: "12px",
                                                      display: "block",
                                                      fill: "currentcolor",
                                                    }}
                                                  >
                                                    <path
                                                      d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z"
                                                      fill-rule="evenodd"
                                                    ></path>
                                                  </svg>
                                                </span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                        {props.doublePanel
                                          ? [
                                              <div
                                                className="_1foj6yps"
                                                style={{
                                                  width:
                                                    doublePanelDimensions.outerContainer2 +
                                                    "px",
                                                  height: pickerHeight + "px",
                                                  transition: pickerHeightStyle,
                                                }}
                                              >
                                                <div
                                                  className="_2hyui6e"
                                                  style={trackStyle}
                                                >
                                                  <div
                                                    class={tabLg1Style}
                                                    style={tabLg1Pos}
                                                  >
                                                    {monthRender(
                                                      calendarData[
                                                        currentMonth - 1
                                                      ],
                                                      tempCheckin,
                                                      tempCheckout
                                                    )}
                                                  </div>
                                                  <div className="_1lds9wb">
                                                    {monthRender(
                                                      calendarData[
                                                        currentMonth
                                                      ],
                                                      tempCheckin,
                                                      tempCheckout
                                                    )}
                                                  </div>
                                                  <div className="_1lds9wb">
                                                    {monthRender(
                                                      calendarData[
                                                        currentMonth + 1
                                                      ],
                                                      tempCheckin,
                                                      tempCheckout
                                                    )}
                                                  </div>
                                                  <div class={tabLgLastStyle}>
                                                    {monthRender(
                                                      calendarData[
                                                        currentMonth + 2
                                                      ],
                                                      tempCheckin,
                                                      tempCheckout
                                                    )}
                                                  </div>
                                                </div>
                                              </div>,
                                            ]
                                          : [
                                              <div
                                                className="_1foj6yps"
                                                style={{
                                                  width:
                                                    singlePanelDimensions.outerContainer2 +
                                                    "px",
                                                  height: pickerHeight + "px",
                                                  transition: pickerHeightStyle,
                                                }}
                                              >
                                                <div
                                                  className="_2hyui6e"
                                                  style={trackStyle}
                                                >
                                                  <div
                                                    class={tabLg1Style}
                                                    style={tabLg1Pos}
                                                  >
                                                    {monthRender(
                                                      calendarData[
                                                        currentMonth - 1
                                                      ],
                                                      tempCheckin,
                                                      tempCheckout
                                                    )}
                                                  </div>
                                                  <div className="_1lds9wb">
                                                    {monthRender(
                                                      calendarData[
                                                        currentMonth
                                                      ],
                                                      tempCheckin,
                                                      tempCheckout
                                                    )}
                                                  </div>
                                                  <div class={tabLgLastStyle}>
                                                    {monthRender(
                                                      calendarData[
                                                        currentMonth + 1
                                                      ],
                                                      tempCheckin,
                                                      tempCheckout
                                                    )}
                                                  </div>
                                                </div>
                                              </div>,
                                            ]}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <section className="biod118 dir dir-ltr" aria-hidden="false">
        <div className="dp1cp1f dir dir-ltr" style={{ top: "148px" }}>
          <div className="_1h0hirz"
            onMouseOver={() => dateContainerHover()}
            onMouseLeave={() => dateContainerHover()}
            >
            <div className="_1mfsr54">
              <div className="_1y26gh8o">
                <div>
                  <div>
                    <div className="_e296pg" aria-hidden="true" role="presentation">
                      <div className="_1kypzrpr">
                        <ul className="_xv14sf">
                          {dotwArray.map((x) => (
                            <li
                              className="_92xroi"
                              style={{
                                width: pickerDimensions.dotw + "px",
                              }}
                            >
                              {x}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div
                      className="_14676s3"
                      tabindex="-1"
                      role="application"
                      aria-label="Calendar"
                    >
                      <div className="_9xlqonb">
                        {calendarData ? (
                          <div
                            className="_1s79stsj"
                            style={{
                              transform: "translateY(0px)",
                              width: pickerDimensions.outer + "px",
                            }}
                          >
                            {visibleMonthsRender()}
                          </div>
                        ) : null}

                        {visibleMonths < 24 ? (
                          <div className="_gor68n">
                            <div className="_1l06a80">
                              <button
                                type="button"
                                className="_snbhip0"
                                onClick={loadMoreDates}
                              >
                                Load more dates
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
}

export default DatePicker;
