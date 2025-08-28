import React, { useState } from "react";
import FullChart from "./components/FullChart";
import SuperEffectiveChart from "./components/SuperEffectiveChart";
import NotEffectiveChart from "./components/NotEffectiveChart";
import NoEffectChart from "./components/NoEffectChart";
import { Container, Row, Col, Button } from "react-bootstrap";

function App() {
  const [showAnswers, setShowAnswers] = useState(true);
  const [chartType, setChartType] = useState("full");

  return (
    <Container>
      <Row className="mt-3">
        <Col className="text-center">
          <Button
            variant="primary"
            onClick={() => setChartType("full")}
            className="m-2"
          >
            Full Chart
          </Button>
          <Button
            variant="primary"
            onClick={() => setChartType("super")}
            className="m-2"
          >
            Super Effective Chart
          </Button>
          <Button
            variant="primary"
            onClick={() => setChartType("not")}
            className="m-2"
          >
            Not Effective Chart
          </Button>
          <Button
            variant="primary"
            onClick={() => setChartType("no")}
            className="m-2"
          >
            No Effect Chart
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowAnswers(!showAnswers)}
            className="m-2"
          >
            {showAnswers ? "Hide Solution" : "Show Solution"}
          </Button>
        </Col>
      </Row>
      {chartType === "full" && <FullChart showAnswers={showAnswers} />}
      {chartType === "super" && <SuperEffectiveChart />}
      {chartType === "not" && <NotEffectiveChart />}
      {chartType === "no" && <NoEffectChart />}
    </Container>
  );
}

export default App;
