import * as React from "react"
import { Link } from "gatsby"
import { Container, Row, Col } from "react-bootstrap"

import Layout from "../components/layout"

import heroImage from '../images/heroImage.png'
import HowItWorksCarousel from "../components/howworkscarousel"
import QAaccordion from "../components/QAaccordian"

const links = [
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
            <h1 className="mb-4">PlateItUp</h1>
            <h3 className="mb-4">Plan, Plate, Post, Prosper</h3>     
            <p className="mb-4">Plan your meals. Keep your recipes. Share with friends. Reach your goals. All with PlateItUp.</p>
          </Col>
          <Col md={6}>
            <img src={heroImage} alt="Hero Image" className="hero-image" />
          </Col>
        </Row>
      </Container>
    </section>
    {/* How It Works Section */}
    <HowItWorksCarousel />
    {/* Q&A Section */}
    <QAaccordion />
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

//export const Head = () => <Seo title="Home" />
