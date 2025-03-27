// src/components/howworkscarousel.js
import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';

// FIX ME: ADD IMPORTS FOR IMAGES

const features = [
  {
    title: 'Create and Share Recipes',
    text: 'Share your favorite meals with friends and family in one click.',
    image: 'https://placehold.co/400',
  },
  {
    title: 'Meal Planning',
    text: 'Plan your weekly meals and shop smarter with guided suggestions.',
    image: 'https://placehold.co/400', 
  },
  {
    title: 'Budgeting',
    text: 'Set and track your grocery budget to save money every month.',
    image: 'https://placehold.co/400',
  },
  {
    title: 'Calorie Counting',
    text: 'Keep track of your daily intake to achieve health goals.',
    image: 'https://placehold.co/400',
  },
];

const HowItWorksCarousel = () => {
  return (
    <section className="how-it-works-carousel">
      <Container>
        <h2 className="text-center mb-4">What We Can Provide</h2>
        <Carousel>
          {features.map((feature) => (
            <Carousel.Item key={feature.title}>
              <Row className="align-items-center">
                <Col md={6} className="text-center">
                  <img
                    className="img-fluid rounded"
                    src={feature.image}
                    alt={feature.title}
                  />
                </Col>
                <Col md={6}>
                  <h3 className="mt-3 mt-md-0">{feature.title}</h3>
                  <p>{feature.text}</p>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default HowItWorksCarousel;
