import React from "react"
import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle="PlateItUp" />
      <main>{children}</main>
      <footer
        style={{
          marginTop: `var(--space-5)`,
          fontSize: `var(--font-sm)`,
        }}
      >
        © {new Date().getFullYear()} &middot; Built with{" "}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </>
  )
}

export default Layout
