import PortfolioItem from "./portfolioItem";
import widgetsImg from "../images/widgets.png";
import datepickersImg from "../images/datepickers.png";
import hotelAppImg from "../images/hotelApp.jpg";
import "../css/portfolioList.css";

// renders list of individual portfolio items in a grid

function Homepage() {
  return (
    <main className="portfoliolist-yu1">
      <div className="portfoliolist-ap7">
        <div className="portfoliolist-pp6">
        <PortfolioItem
          name="shop app"
          lightBackground={true}
          image={hotelAppImg}
          href="/shop-app"
        />
          <PortfolioItem
            name="hotel app"
            lightBackground={true}
            image={hotelAppImg}
            href="/hotel-app"
          />
          <PortfolioItem
            name="datepickers"
            image={datepickersImg}
            href="/datepickers"
          />
          <PortfolioItem
            name="widgets"
            image={widgetsImg}
            href="/widgets"
          />
        </div>
      </div>
    </main>
  );
}

export default Homepage;
