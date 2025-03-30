// src/components/howworkscarousel.js
import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import "./howworkscarousel.css"

import Recipe from '../images/Recipe.png'
import Mealplan from '../images/MealPlan.png'
import Budget from '../images/Budget.png'


const features = [
  {
    title: 'Create and Share Recipes',
    text: 'Share your favorite meals with friends and family in one click.',
    image: Recipe,
  },
  {
    title: 'Meal Planning',
    text: 'Plan your weekly meals and shop smarter with guided suggestions. And keep track of your daily intake to achieve your health goals.',
    image: Mealplan, 
  },
  {
    title: 'Budgeting',
    text: 'Set and track your grocery budget to save money every month.',
    image: Budget,
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
              <Row className="align-items-center g-0">
                <Col md={6} className="text-center">
                  <img
                    className="carousel-img img-fluid rounded"
                    src={feature.image}
                    alt={feature.title}
                  />
                </Col>
                <Col md={4}>
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
