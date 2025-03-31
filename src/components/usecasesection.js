import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './usecasesection.css'

// FIX ADD IMPORTS FOR IMAGES
{/* 
import MobileImg from '../images/mobile.png';
import WebImg from '../images/web.png';
import PaperImg from '../images/paper.png';
*/}

const useCases = [
  {
    key: 'mobile',
    title: 'Mobile',
    text: 'Experience our app on the go with a seamless mobile interface that lets you plan and share recipes quickly.',
    image: 'https://placehold.co/400',
  },
  {
    key: 'web',
    title: 'Web',
    text: 'Access our full-featured web platform for an expansive and detailed view of your meal plans and recipes.',
    image: 'https://placehold.co/400',
  },
  {
    key: 'paper',
    title: 'Paper',
    text: 'Print out recipes in a beautifully designed format—perfect for cooking without screens.',
    image: 'https://placehold.co/400',
  },
];

const UseCaseSection = () => {
  const [selectedCase, setSelectedCase] = useState('mobile');
  const currentCase = useCases.find((u) => u.key === selectedCase);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Use Cases</h2>
      
      {/* Button Group for Use Case Selection */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group usecasebutton" role="group" aria-label="Use case toggle">
          <input
            type="radio"
            className="btn-check"
            name="usecase"
            id="btnradio1"
            autoComplete="off"
            checked={selectedCase === 'mobile'}
            onChange={() => setSelectedCase('mobile')}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio1">
            Mobile
          </label>

          <input
            type="radio"
            className="btn-check"
            name="usecase"
            id="btnradio2"
            autoComplete="off"
            checked={selectedCase === 'web'}
            onChange={() => setSelectedCase('web')}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio2">
            Web
          </label>

          <input
            type="radio"
            className="btn-check"
            name="usecase"
            id="btnradio3"
            autoComplete="off"
            checked={selectedCase === 'paper'}
            onChange={() => setSelectedCase('paper')}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio3">
            Paper
          </label>
        </div>
      </div>
      
      {/*Static Image (FIX ME: ANIMATION NO WORK FOR PICS)*/} 
      <Row className="align-items-center">
        <Col md={6} className="text-center">
          <img
            src={currentCase.image}
            alt={currentCase.title}
            className="img-fluid"
          />
        </Col>
      {/* Animated Text Column with Transition */}
        <Col md={6}>
          <TransitionGroup>
            <CSSTransition
              key={currentCase.key}
              timeout={500}
              classNames="fade"
            >
              <div>
                <h3>{currentCase.title}</h3>
                <p>{currentCase.text}</p>
              </div>
            </CSSTransition>
          </TransitionGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UseCaseSection;