import PortfolioItem from "./portfolioItem";
import SwipeableGallery from "../../swipeableGallery/components/swipeableGallery";
import rangeSliderImg from "../images/rangeSlider.png";
import hotelAppImg from "../images/hotelApp.jpg";
import "../css/portfolioList.css";

// renders list of individual portfolio items in a grid

function PortfoiloList() {
  return (
    <main className="portfoliolist-yu1">
      <div className="portfoliolist-ap7">
        <div className="portfoliolist-pp6">
          <PortfolioItem
            name="hotel app"
            lightBackground={true}
            image={hotelAppImg}
            href="/hotel-app"
            modal="searchMap"
          />
          <PortfolioItem
            name="range sliders"
            image={rangeSliderImg}
            href="/range-slider"
            modal="rangeSlider"
          />
          <SwipeableGallery />
        </div>
      </div>
    </main>
  );
}

export default PortfoiloList;
