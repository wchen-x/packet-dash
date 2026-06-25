import { useMemo, useState } from "react";
import "./App.css";
import { levels } from "./data/levels";

function App() {
  const [started, setStarted] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const routeSteps = ["Laptop", "Router", "Internet", "Server", "Laptop"];

  const currentLevel = levels[levelIndex];
  const shuffledOptions = useMemo(() => {
    return [...currentLevel.options].sort(() => Math.random() - 0.5);
  }, [currentLevel]);

  function startGame() {
    setStarted(true);
    setLevelIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameFinished(false);
  }

  function chooseAnswer(option: string) {
    if (selectedAnswer !== null) return;

    const correct = option === currentLevel.answer;

    setSelectedAnswer(option);
    setIsCorrect(correct);

    if (correct) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function goToNextLevel() {
    const nextLevelIndex = levelIndex + 1;

    if (nextLevelIndex >= levels.length) {
      setGameFinished(true);
      return;
    }

    setLevelIndex(nextLevelIndex);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }

  if (!started) {
    return (
      <main className="app">
        <section className="start-card">
          <p className="eyebrow">Mission: Data Delivery</p>

          <h1>Packet Dash</h1>

          <p className="subtitle">Can you deliver the data?</p>

          <p className="description">
            Help Pip the packet travel from a laptop to a website server by
            choosing the correct network step.
          </p>

          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </section>
      </main>
    );
  }

  if (gameFinished) {
    const resultTitle =
      score === levels.length
        ? "Perfect delivery!"
        : score >= 3
          ? "Mission complete!"
          : "Good effort!";

    const resultMessage =
      score === levels.length
        ? "Pip delivered every packet perfectly and made it safely back to the laptop."
        : score >= 3
          ? "Pip delivered the data and made it back to the laptop."
          : "Pip made it back, but some network steps need another try.";

    const badge =
      score === levels.length
        ? "Packet Pro"
        : score >= 3
          ? "Network Navigator"
          : "Packet Trainee";

    return (
      <main className="app">
        <section className="start-card">
          <p className="eyebrow">
            {score >= 3 ? "Mission Complete" : "Mission Review"}
          </p>

          <h1>{resultTitle}</h1>

          <p className="subtitle">
            You scored {score} out of {levels.length}
          </p>

          <p className="badge">{badge}</p>

          <p className="description">{resultMessage}</p>

          <button className="start-button" onClick={startGame}>
            Play Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="game-card">
        <div className="game-header">
          <p className="eyebrow">{currentLevel.title}</p>
          <p className="score">
            Score: {score}/{levels.length}
          </p>
        </div>

        <div className="route" aria-label="Packet journey">
          {routeSteps.map((step, index) => {
            const isPastStep = index < levelIndex;
            const isCurrentStep = index === levelIndex;
            const isRevealed = isPastStep || (isCurrentStep && selectedAnswer !== null);

            return (
              <div
                key={`${step}-${index}`}
                className={`route-step ${index <= levelIndex ? "active" : ""}`}
              >
                <div className="route-node">
                  {isCurrentStep ? "Pip" : index + 1}
                </div>

                <span>{isRevealed ? step : "???"}</span>
              </div>
            );
          })}
        </div>

        <p className="story">{currentLevel.story}</p>

        <h2>{currentLevel.question}</h2>

        <div className="options">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              className={`option-button ${
                selectedAnswer === option
                  ? option === currentLevel.answer
                    ? "correct"
                    : "wrong"
                  : ""
              }`}
              onClick={() => chooseAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedAnswer && (
          <div className={isCorrect ? "feedback correct-box" : "feedback wrong-box"}>
            <strong>{isCorrect ? "Correct!" : "Not quite!"}</strong>
            <p>{currentLevel.explanation}</p>

            <button className="next-button" onClick={goToNextLevel}>
              {levelIndex === levels.length - 1 ? "Finish Mission" : "Next Mission"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;