import React, { useState } from "react";
import FullChart from "./components/FullChart";
import SuperEffectiveChart from "./components/SuperEffectiveChart";
import NotEffectiveChart from "./components/NotEffectiveChart";
import NoEffectChart from "./components/NoEffectChart";
import { Container, Row, Col, Button } from "react-bootstrap";

function App() {
  const [chartType, setChartType] = useState("full");
  const [testState, setTestState] = useState({
    isTestMode: false,
    timer: 0,
    correctCount: 0,
    errorCount: 0,
  });

  // Format timer from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get total correct answers based on chart type
  const getTotalCorrect = () => {
    switch (chartType) {
      case "full":
        return 120;
      case "super":
        return 51;
      case "not":
        return 61;
      case "no":
        return 8;
      default:
        return 0;
    }
  };

  return (
    <>
      <div className="header-container">
        <h1 className="header-title">POKÉMON TYPE CHART</h1>
        <div className="header-decoration"></div>
        <div className="header-circle"></div>
      </div>
      <Container>
        <Row className="chart-buttons-container">
          <Col className="text-center">
            <Button
              variant="primary"
              onClick={() => setChartType("full")}
              className={`chart-button ${chartType === "full" ? "active" : ""}`}
            >
              Full
            </Button>
            <Button
              variant="primary"
              onClick={() => setChartType("super")}
              className={`chart-button ${
                chartType === "super" ? "active" : ""
              }`}
            >
              Super-Effective
            </Button>
            <Button
              variant="primary"
              onClick={() => setChartType("not")}
              className={`chart-button ${chartType === "not" ? "active" : ""}`}
            >
              Not-Effective
            </Button>
            <Button
              variant="primary"
              onClick={() => setChartType("no")}
              className={`chart-button ${chartType === "no" ? "active" : ""}`}
            >
              Immune
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <div className="answers-display">
              {testState.isTestMode ? (
                <>
                  <span>Time: {formatTime(testState.timer)}</span>
                  <span className="test-spacer"></span>
                  <span>
                    Correct: {testState.correctCount}/{getTotalCorrect()}
                  </span>
                  <span className="test-spacer"></span>
                  <span>Errors: {testState.errorCount}</span>
                </>
              ) : (
                <>
                  {chartType === "full" && "120 Answers"}
                  {chartType === "super" && "51 Answers"}
                  {chartType === "not" && "61 Answers"}
                  {chartType === "no" && "8 Answers"}
                </>
              )}
            </div>
          </Col>
        </Row>
        {chartType === "full" && <FullChart onTestStateChange={setTestState} />}
        {chartType === "super" && (
          <SuperEffectiveChart onTestStateChange={setTestState} />
        )}
        {chartType === "not" && (
          <NotEffectiveChart onTestStateChange={setTestState} />
        )}
        {chartType === "no" && (
          <NoEffectChart onTestStateChange={setTestState} />
        )}
      </Container>
    </>
  );
}

export default App;
