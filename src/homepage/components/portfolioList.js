import PortfolioItem from "./portfolioItem";
// array of data - each element contains data for a single portfolio item
import itemArray from "../../data/itemArray";
import "../css/portfolioList.css";

// renders list of individual portfolio items in a grid

function PortfoiloList() {
  return (
    <div className="portfoliolist-yu1">
      <div className="portfoliolist-ap7">
        <div className="portfoliolist-pp6">
          {itemArray.map((x) => (
            <PortfolioItem name={x.name} image={x.image} href={x.href} modal={x.modal} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PortfoiloList;
