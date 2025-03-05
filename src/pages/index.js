import * as React from "react"


const pageStyles = {
  color: "#F9F7F7",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  color: "#112D4E",
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}

const paragraphStyles = {
  color: "#112D4E",
  marginBottom: 48,
}

const IndexPage = () => {

  return (
    <main style={pageStyles} >
      <h1 style={headingStyles} className="px-auto bg-danger">
        Meal Planning App
      </h1>
      <p style={paragraphStyles} >
        Paragraph
      </p>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
