import React from "react";
import Header from "./header";
import Footer from "./footer";
import "./layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle="PlateItUp" />

      <Link to="/add-recipe/" className="floating-btn material-icons">
        add
      </Link>

      <main>{children}</main>
      <Footer siteTitle="PlateItUp" />
    </>
  );
};

export default Layout;
