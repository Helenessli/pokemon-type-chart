import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

interface GameModeProps {
  title?: string;
  typeChart: string[][];
  expectedValues: (string | number)[][];
  gameMode: string;
  disableTestMode?: boolean;
  onTestStateChange?: (testState: {
    isTestMode: boolean;
    timer: number;
    correctCount: number;
    errorCount: number;
  }) => void;
}

const GameMode: React.FC<GameModeProps> = ({
  title,
  typeChart,
  expectedValues,
  gameMode,
  disableTestMode = false,
  onTestStateChange,
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
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

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

  // Notify parent component of test state changes
  useEffect(() => {
    if (onTestStateChange) {
      onTestStateChange({
        isTestMode,
        timer,
        correctCount,
        errorCount,
      });
    }
  }, [isTestMode, timer, correctCount, errorCount, onTestStateChange]);

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

  const handleCellMouseEnter = (rowIndex: number, colIndex: number) => {
    setHoveredCell({ row: rowIndex, col: colIndex });
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
  };

  const getCellStyle = (rowIndex: number, colIndex: number, value: string) => {
    // Check for type-specific background colors (including leftmost column and top row)
    if (value === "NOR" || value === "NORMAL")
      return {
        backgroundColor: "#aaaa99",
        color: "white",
      };
    if (value === "FIR" || value === "FIRE")
      return {
        backgroundColor: "#ff4422",
        color: "white",
      };
    if (value === "WAT" || value === "WATER")
      return {
        backgroundColor: "#3499fe",
        color: "white",
      };
    if (value === "ELE" || value === "ELECTRIC")
      return {
        backgroundColor: "#ffcc33",
        color: "white",
      };
    if (value === "GRA" || value === "GRASS")
      return {
        backgroundColor: "#77cc55",
        color: "white",
      };
    if (value === "ICE" || value === "ICE")
      return {
        backgroundColor: "#65ccff",
        color: "white",
      };
    if (value === "FIG" || value === "FIGHTING")
      return {
        backgroundColor: "#bb5545",
        color: "white",
      };
    if (value === "POI" || value === "POISON")
      return {
        backgroundColor: "#aa5699",
        color: "white",
      };
    if (value === "GRO" || value === "GROUND")
      return {
        backgroundColor: "#dcbb55",
        color: "white",
      };
    if (value === "FLY" || value === "FLYING")
      return {
        backgroundColor: "#8899ff",
        color: "white",
      };
    if (value === "PSY" || value === "PSYCHIC")
      return {
        backgroundColor: "#ff5699",
        color: "white",
      };
    if (value === "BUG" || value === "BUG")
      return {
        backgroundColor: "#aabb23",
        color: "white",
      };
    if (value === "ROC" || value === "ROCK")
      return {
        backgroundColor: "#bbaa66",
        color: "white",
      };
    if (value === "GHO" || value === "GHOST")
      return {
        backgroundColor: "#6666bb",
        color: "white",
      };
    if (value === "DRA" || value === "DRAGON")
      return {
        backgroundColor: "#7766ee",
        color: "white",
      };
    if (value === "DAR" || value === "DARK")
      return {
        backgroundColor: "#775544",
        color: "white",
      };
    if (value === "STE" || value === "STEEL")
      return {
        backgroundColor: "#aaaabb",
        color: "white",
      };
    if (value === "FAI" || value === "FAIRY")
      return {
        backgroundColor: "#ee99ee",
        color: "white",
      };

    // Handle top row (rowIndex === -1) - just return transparent for non-type cells
    if (rowIndex === -1) {
      return { backgroundColor: "transparent", color: "black" };
    }

    const numericValue = parseFloat(value);
    const expectedValue = expectedValues[rowIndex + 1][colIndex];
    const userAnswer = userAnswers[rowIndex + 1]?.[colIndex];

    if (isTestMode && userAnswer === expectedValue) {
      // User got it correct - show the expected color
      if (expectedValue === "2")
        return { backgroundColor: "#4e9a06", color: "white" };
      if (expectedValue === "0.5")
        return { backgroundColor: "#a40001", color: "white" };
      if (expectedValue === "0")
        return { backgroundColor: "#2e3436", color: "white" };
      return { backgroundColor: "transparent", color: "black" };
    }

    if (showAnswers) {
      // Show all answers
      if (numericValue === -1)
        return { backgroundColor: "transparent", color: "black" };
      if (numericValue > 1)
        return { backgroundColor: "#4e9a06", color: "white" };
      if (numericValue < 1 && numericValue > 0)
        return { backgroundColor: "#a40001", color: "white" };
      if (numericValue === 0)
        return { backgroundColor: "#2e3436", color: "white" };
      return { backgroundColor: "transparent", color: "black" };
    }

    // Test mode - show nothing
    return { backgroundColor: "transparent", color: "black" };
  };

  const getCellClassName = (rowIndex: number, colIndex: number) => {
    // No hover highlighting for non-test mode - needs to be deprecated
    return "";
  };

  const getTestModeCellClassName = (rowIndex: number, colIndex: number) => {
    let className = "";

    // Add hover highlighting classes for test mode
    if (hoveredCell) {
      if (rowIndex === hoveredCell.row && colIndex === hoveredCell.col) {
        // Check if user has answered this cell correctly
        const userAnswer = userAnswers[rowIndex + 1]?.[colIndex];
        const expectedValue = expectedValues[rowIndex + 1]?.[colIndex];

        if (userAnswer === expectedValue) {
          // User answered correctly - apply dimming effect
          className += " chart-cell-hover-value";
        } else {
          // User hasn't answered or answered incorrectly - apply pink highlighting
          className += " chart-cell-hover";
        }
      } else if (rowIndex === hoveredCell.row || colIndex === hoveredCell.col) {
        // Check if this cell has a user answer
        const userAnswer = userAnswers[rowIndex + 1]?.[colIndex];

        if (userAnswer !== undefined) {
          // User has answered this cell - only apply dimming effect
          const numericValue = parseFloat(userAnswer.toString());

          if (
            numericValue === 2 ||
            numericValue === 0.5 ||
            numericValue === 0
          ) {
            // User answered this cell correctly and it has a value - apply dimming effect
            className += " chart-col-highlight-value";
          } else {
            // User answered this cell correctly but it's empty - apply pink highlighting
            className += " chart-col-highlight";
          }
        } else {
          // User hasn't answered this cell - apply pink row/column highlight
          className += " chart-row-highlight";
        }
      }
    }

    return className;
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
      if (expectedValue === "0.5") return "½";
      if (expectedValue === "0") return "0";
      return "";
    }

    if (showAnswers) {
      if (numericValue === -1) return "";
      if (numericValue > 1) return "2";
      if (numericValue < 1 && numericValue > 0) return "½";
      if (numericValue === 0) return "0";
      return "";
    }

    return "";
  };

  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center">
          <table
            className="table table-bordered"
            style={{
              maxWidth: "900px",
            }}
          >
            <tbody>
              {typeChart.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{ height: "32px", maxHeight: "32px" }}
                >
                  {row.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        ...(rowIndex === 0
                          ? getCellStyle(-1, colIndex, value)
                          : getCellStyle(rowIndex - 1, colIndex, value)),
                        ...(colIndex === 0 && {
                          width: "66px",
                          minWidth: "66px",
                          maxWidth: "66px",
                          verticalAlign: "middle",
                        }),
                        ...(colIndex !== 0 && {
                          width: "40px",
                          minWidth: "40px",
                          maxWidth: "40px",
                        }),
                        ...(colIndex === 0 && {
                          fontSize: "0.8rem",
                        }),
                        ...(rowIndex === 0 && {
                          fontSize: "0.8rem",
                        }),
                        ...(rowIndex !== 0 &&
                          colIndex !== 0 && {
                            fontSize: "0.8rem",
                          }),
                        ...(rowIndex === 0 &&
                          colIndex === 0 && {
                            fontSize: "5.5px",
                            padding: "0px",
                            whiteSpace: "pre",
                            backgroundColor: "transparent",
                          }),
                        height: "32px",
                        maxHeight: "32px",
                        minHeight: "32px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        lineHeight: "24px",
                        overflow: "hidden",
                      }}
                      onClick={
                        rowIndex === 0
                          ? undefined
                          : () => handleCellClick(rowIndex - 1, colIndex)
                      }
                      onMouseEnter={
                        rowIndex === 0 || colIndex === 0
                          ? undefined
                          : () => handleCellMouseEnter(rowIndex - 1, colIndex)
                      }
                      onMouseLeave={
                        rowIndex === 0 || colIndex === 0
                          ? undefined
                          : handleCellMouseLeave
                      }
                      className={
                        rowIndex === 0
                          ? ""
                          : colIndex === 0
                          ? "type-header"
                          : isTestMode
                          ? "clickable-cell " +
                            getTestModeCellClassName(rowIndex - 1, colIndex)
                          : getCellClassName(rowIndex - 1, colIndex)
                      }
                    >
                      {rowIndex === 0
                        ? value
                        : getCellContent(rowIndex - 1, colIndex, value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>

      <Row className="mt-0">
        <Col className="text-center">
          {!isTestMode && !disableTestMode && (
            <Button
              variant="primary"
              onClick={startTest}
              className="action-button"
            >
              Begin Test
            </Button>
          )}
          {!isTestMode && disableTestMode && (
            <Button variant="secondary" disabled className="action-button">
              Begin Test
            </Button>
          )}
          {isTestMode && (
            <Button
              variant="secondary"
              onClick={resetTest}
              className="action-button"
            >
              End Test
            </Button>
          )}
          {!isTestMode && (
            <Button
              variant="secondary"
              onClick={() => setShowAnswers(!showAnswers)}
              className="action-button"
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
