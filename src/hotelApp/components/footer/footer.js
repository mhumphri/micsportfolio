import React from "react";
import "../../css/footer/footer.css";

function Footer(props) {
  const footerLinks = [
    {
      header: "Support",
      links: [
        { name: "Help Centre", href: "/help/home?from=footer" },
        { name: "Safety information", href: "/trust" },
        { name: "Supporting people with disabilities", href: "/accessibility" },
        {
          name: "Cancellation options",
          href:
            "/help/article/2701/extenuating-circumstances-policy-and-the-coronavirus-covid19",
        },
        { name: "Report a concern", href: "/neighbors" },
      ],
    },
    {
      header: "Community",
      links: [
        { name: "Good causes", href: "/refugees" },
        { name: "Combating discrimination", href: "/discrimination" },
      ],
    },
    {
      header: "Hotels",
      links: [
        { name: "Log in", href: "/login" },
        { name: "New accounts", href: "/sales" },
        { name: "Report an issue", href: "/aircoverforhosts" },
        { name: "Explore hotel resources", href: "/hostingresources" },
      ],
    },
    {
      header: "About us",
      links: [
        { name: "Newsroom", href: "/newsroom" },
        { name: "Careers", href: "/careers" },
        { name: "Investors", href: "/investors" },
        { name: "Gift cards", href: "/giftcards" },
      ],
    },
  ];


  const footerRender = (linksData) => {
    let footerRender = [];
    for (let i = 0; i < linksData.length; i++) {
      const columnData = linksData[i].links;
      let linksColumn = [];
      for (let j = 0; j < columnData.length; j++) {
        linksColumn.push(
          <li className="footer-wmu" key={columnData[j].name}>
        {/*  <a href={columnData[j].href} className="_1e6wtwm5"> */}
        <span className="footer-1e6">
              {columnData[j].name}
            </span>
          </li>
        );
      }
      footerRender.push(
        <section className="footer-1l3" key={linksData[i].header}>
          <div className="footer-x6q">
            <h3 className="footer-otc">{linksData[i].header}</h3>
          </div>
          <ul className="footer-yuo">{linksColumn}</ul>
        </section>
      );
    }
    return footerRender;
  };

if (props.largeView) {
    return (

        <footer className="footer-1fa">
          <div className={props.narrow ? "footer-1s9" : "footer-1s9 wide"}>
            <div className="footer-fyx">{footerRender(footerLinks)}</div>
          </div>
        </footer>

    );
  } else {
    return (


      <footer className="footer-1fa">
      <div className="footer-1s9" >
      <div className="footer-fyx">
      {footerRender(footerLinks)}
      </div>
      </div>
      </footer>


    );
  }
}

export default Footer;
