import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

interface GameModeProps {
  title?: string;
  typeChart: string[][];
  expectedValues: (string | number)[][];
  gameMode: string;
  disableTestMode?: boolean;
}

const GameMode: React.FC<GameModeProps> = ({
  title,
  typeChart,
  expectedValues,
  gameMode,
  disableTestMode = false,
}) => {
  const [showAnswers, setShowAnswers] = useState(true);
  const [userAnswers, setUserAnswers] = useState<(string | number)[][]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [clickedCorrectCells, setClickedCorrectCells] = useState<Set<string>>(
    new Set()
  );
  const [timer, setTimer] = useState(0);

  // Get total correct answers based on game mode
  const getTotalCorrect = () => {
    switch (gameMode) {
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

  // Format timer from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Timer effect - starts when test begins, stops when all correct grids found
  useEffect(() => {
    let interval: number;
    if (isTestMode && correctCount < getTotalCorrect()) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestMode, correctCount, getTotalCorrect]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    console.log(rowIndex, colIndex);
    if (!isTestMode || colIndex === 0) return;

    const expectedValue = expectedValues[rowIndex + 1][colIndex];
    const currentValue = typeChart[rowIndex + 1][colIndex];

    if (currentValue === expectedValue) {
      // Create a unique key for this cell
      const cellKey = `${rowIndex + 1}-${colIndex}`;

      // Check if this cell has already been clicked correctly
      if (!clickedCorrectCells.has(cellKey)) {
        // New correct answer - highlight the cell and increment counter
        console.log("correct");
        const newAnswers = [...userAnswers];
        if (!newAnswers[rowIndex + 1]) newAnswers[rowIndex + 1] = [];
        newAnswers[rowIndex + 1][colIndex] = expectedValue;
        setUserAnswers(newAnswers);
        setCorrectCount((prev) => prev + 1);

        // Mark this cell as clicked correctly
        setClickedCorrectCells((prev) => new Set(prev).add(cellKey));
      }
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
    setCorrectCount(0);
    setClickedCorrectCells(new Set());
    setTimer(0);
  };

  const resetTest = () => {
    setIsTestMode(false);
    setShowAnswers(true);
    setUserAnswers([]);
    setErrorCount(0);
    setCorrectCount(0);
    setClickedCorrectCells(new Set());
    setTimer(0);
  };

  const getCellStyle = (rowIndex: number, colIndex: number, value: string) => {
    if (colIndex === 0)
      return { backgroundColor: "transparent", color: "black" };

    const numericValue = parseFloat(value);
    const expectedValue = expectedValues[rowIndex + 1][colIndex];
    const userAnswer = userAnswers[rowIndex + 1]?.[colIndex];

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
    const expectedValue = expectedValues[rowIndex + 1][colIndex];
    const userAnswer = userAnswers[rowIndex + 1]?.[colIndex];

    if (isTestMode && userAnswer === expectedValue) {
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
      {isTestMode && (
        <Row className="mb-3">
          <Col className="text-center">
            <h4>Errors: {errorCount}</h4>
            <h4>
              Correct: {correctCount}/{getTotalCorrect()}
            </h4>
            <h4>Time: {formatTime(timer)}</h4>
          </Col>
        </Row>
      )}

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

      <Row className="mt-3">
        <Col className="text-center">
          {!isTestMode && !disableTestMode && (
            <Button variant="primary" onClick={startTest} className="m-2">
              Test Yourself
            </Button>
          )}
          {!isTestMode && disableTestMode && (
            <Button variant="secondary" disabled className="m-2">
              Test Yourself
            </Button>
          )}
          {isTestMode && (
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
    </Container>
  );
};

export default GameMode;
