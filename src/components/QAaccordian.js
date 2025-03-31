import React from 'react';
import { Accordion, Container } from 'react-bootstrap';

const QAaccordion = () => {
    return(
        <Container className="my-5">
            {/* Jumbotron Header */}
            <div className="qa-jumbotron">
                <h1 class="qa-header text-center">Q&A</h1>
            </div>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="accord-header text-center">Are all features of PlateItUp available for free?</Accordion.Header>
                    <Accordion.Body className="accord-body">
                    Absolutely! All features of the app are 100% free — no paywalls, subscriptions, or hidden fees. Just plan, plate, post, and prosper!
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header className="accord-header">Does PlateItUp save my recipes for later use?</Accordion.Header>
                    <Accordion.Body className="accord-body">
                    Yes! Every recipe you create is saved to your personal collection.
                    Want to share your masterpiece? Post it, and others can view and save it too!
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header className="accord-header">Can I customize my meal plans to my needs?</Accordion.Header>
                    <Accordion.Body className="accord-body">
                    Definitely. Build your own meals, tweak ingredients, and plan out your week — or month — exactly how you like it. Your meals, your way.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header className="accord-header">Can I track calories and nutritional info?</Accordion.Header>
                    <Accordion.Body className="accord-body">
                    You bet! Every ingredient and meal comes with detailed calorie info, so you can keep track of what you eat without the hassle.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header className="accord-header">Is the app good for beginners?</Accordion.Header>
                    <Accordion.Body className="accord-body">
                    For sure! Whether you're a kitchen newbie or a meal prep pro, the app is easy to use and packed with tips to help you succeed.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default QAaccordion;