import * as React from "react"
import { Link } from "gatsby"
import { Container, Row, Col } from "react-bootstrap"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

import heroImage from '../images/heroImage.png'
import HowItWorksCarousel from "../components/howworkscarousel"

const links = [
]

const samplePageLinks = [
  {
    text: "Page 2",
    url: "page-2",
    badge: false,
    description:
      "A simple example of linking to another page within a Gatsby site",
  },
  { text: "TypeScript", url: "using-typescript" },
  { text: "Server Side Rendering", url: "using-ssr" },
  { text: "Deferred Static Generation", url: "using-dsg" },
]

const moreLinks = [
  { text: "Join us on Discord", url: "https://gatsby.dev/discord" },
  {
    text: "Products",
    url: "",
  },
  {
    text: "Contact Us",
    url: "",
  },
  {
    text: "About Us",
    url: "",
  },
  {
    text: "API Reference",
    url: "",
  },
  { text: "Issues", url: "https://github.com/gatsbyjs/gatsby/issues" },
]

const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

export default function HomePage() {
  return (
    <>
    <Layout>
    {/* <Hero /> */}
    <section className="hero-section">
      <Container fluid className="p-5">
        <Row className="align-items-center">
          <Col md={6} className="text-section">
            <h1 className="mb-4">Plattr</h1>
            <h3 className="mb-4">Plan, Plate, Post, Prosper</h3>     
            <p className="mb-4">Plan your meals. Keep your recipes. Share with friends. Reach your goals. All with Plattr.</p>
          </Col>
          <Col md={6}>
            <img src={heroImage} alt="Hero Image" className="hero-image" />
          </Col>
        </Row>
      </Container>
    </section>
    {/* How It Works Section */}
    <HowItWorksCarousel />
    {/* Mission Statement Section */}
    <section className="mission-statement">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h2>Our Mission</h2>
            <p>
            Our mission is to bring people together through the joy of food. We empower everyday cooks to plan meals with ease, share recipes with flair, and stay mindful of health and budget—all in one playful, community-driven platform. With every post, plate, and plan, we help people connect, create, and prosper around the table.
            </p>
          </Col>
        </Row>
      </Container>  
    </section>
    </Layout>
    </>
  );
}

export const Head = () => <Seo title="Home" />
