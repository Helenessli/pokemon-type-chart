import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

interface GameModeProps {
  title: string;
  typeChart: string[][];
  expectedValues: (string | number)[][];
  gameMode: string;
}

const GameMode: React.FC<GameModeProps> = ({
  title,
  typeChart,
  expectedValues,
  gameMode,
}) => {
  const [showAnswers, setShowAnswers] = useState(true);
  const [userAnswers, setUserAnswers] = useState<(string | number)[][]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    console.log(rowIndex, colIndex);
    if (!isTestMode || colIndex === 0) return;

    const expectedValue = expectedValues[rowIndex][colIndex];
    const currentValue = typeChart[rowIndex][colIndex];

    if (currentValue === expectedValue) {
      // Correct answer - highlight the cell
      console.log("correct");
      const newAnswers = [...userAnswers];
      if (!newAnswers[rowIndex]) newAnswers[rowIndex] = [];
      newAnswers[rowIndex][colIndex] = expectedValue;
      setUserAnswers(newAnswers);
    } else {
      // Wrong answer - increment error counter
      setErrorCount((prev) => prev + 1);
    }
  };

  const startTest = () => {
    setIsTestMode(true);
    setShowAnswers(false);
    setUserAnswers([]);
    setErrorCount(0);
  };

  const resetTest = () => {
    setIsTestMode(false);
    setShowAnswers(true);
    setUserAnswers([]);
    setErrorCount(0);
  };

  const getCellStyle = (rowIndex: number, colIndex: number, value: string) => {
    if (colIndex === 0)
      return { backgroundColor: "transparent", color: "black" };

    const numericValue = parseFloat(value);
    const expectedValue = expectedValues[rowIndex][colIndex];
    const userAnswer = userAnswers[rowIndex]?.[colIndex];

    if (isTestMode && userAnswer === expectedValue) {
      // User got it correct - show the expected color
      if (expectedValue === "2")
        return { backgroundColor: "green", color: "white" };
      if (expectedValue === "0.5")
        return { backgroundColor: "red", color: "white" };
      if (expectedValue === "0")
        return { backgroundColor: "black", color: "white" };
      return { backgroundColor: "transparent", color: "black" };
    }

    if (showAnswers) {
      // Show all answers
      if (numericValue === -1)
        return { backgroundColor: "transparent", color: "black" };
      if (numericValue > 1) return { backgroundColor: "green", color: "white" };
      if (numericValue < 1 && numericValue > 0)
        return { backgroundColor: "red", color: "white" };
      if (numericValue === 0)
        return { backgroundColor: "black", color: "white" };
      return { backgroundColor: "transparent", color: "black" };
    }

    // Test mode - show nothing
    return { backgroundColor: "transparent", color: "black" };
  };

  const getCellContent = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    if (colIndex === 0) return value;

    const numericValue = parseFloat(value);
    const expectedValue = expectedValues[rowIndex][colIndex];
    const userAnswer = userAnswers[rowIndex]?.[colIndex];

    if (isTestMode && userAnswer === expectedValue) {
      // Show the correct answer
      if (expectedValue === "2") return "2";
      if (expectedValue === "0.5") return "1/2";
      if (expectedValue === "0") return "0";
      return "";
    }

    if (showAnswers) {
      if (numericValue === -1) return "";
      if (numericValue > 1) return "2";
      if (numericValue < 1 && numericValue > 0) return "1/2";
      if (numericValue === 0) return "0";
      return "";
    }

    return "";
  };

  return (
    <Container>
      <h1 className="text-center">{title}</h1>

      {isTestMode && (
        <Row className="mb-3">
          <Col className="text-center">
            <h4>Errors: {errorCount}</h4>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col className="text-center">
          {!isTestMode ? (
            <Button variant="primary" onClick={startTest} className="m-2">
              Test Yourself
            </Button>
          ) : (
            <Button variant="secondary" onClick={resetTest} className="m-2">
              Reset Test
            </Button>
          )}

          {!isTestMode && (
            <Button
              variant="secondary"
              onClick={() => setShowAnswers(!showAnswers)}
              className="m-2"
            >
              {showAnswers ? "Hide Solution" : "Show Solution"}
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <table className="table table-bordered">
            <thead>
              <tr>
                {typeChart[0].map((type, index) => (
                  <th key={index} className="type-header">
                    {type}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {typeChart.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      style={getCellStyle(rowIndex, colIndex, value)}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={
                        colIndex === 0
                          ? "type-header"
                          : isTestMode
                          ? "clickable-cell"
                          : ""
                      }
                    >
                      {getCellContent(rowIndex, colIndex, value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
    </Container>
  );
};

export default GameMode;
