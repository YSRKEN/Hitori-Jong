import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

const App: React.FC = () => (
  <Container>
    <Row>
      <Col className="my-5">
        <h1 className="text-center">ヒトリジャン</h1>
      </Col>
    </Row>
    <Row>
      <Col xs={12} sm={8} md={4} className="my-3 mx-auto">
        <Form>
          <Button className="w-100">スタート</Button>
        </Form>
      </Col>
    </Row>
  </Container>
);

export default App;
