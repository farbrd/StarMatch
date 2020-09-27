import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import utils from "./utils";
import color from "./color";
import "./App.css";

const PlayAgain = props => (
	<div className="game-done">
  	<div 
    	className="message"
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}
    >
  	  {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
  	</div>
	  <button onClick={props.onClick}>Play Again</button>
	</div>
);

const StarsDisplay = (props: any) => (
  <>
    {utils.range(1, props.count).map((starId) => (
      <div key={starId} className="star" />
    ))}
  </>
);
function PlayNumber(props) {
  return (
    <button
      className="number"
      style={{ backgroundColor: color[props.status] }}
      onClick={() => props.onClick(props.number, props.status)}
    >
      {props.number}
    </button>
  );
}

function StarMatch() {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
  	if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);

      }, 1000);
    	return () => {
        return clearTimeout(timerId);
      };
  	}
  });  

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0 
  ? 'won'
  : secondsLeft === 0 ? 'lost' : 'active'
  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
    setSecondsLeft(10);
  };

  const numberStatus = (number: any) => {
    if (!availableNums.includes(number)) return "used";
    if (candidateNums.includes(number))
      return candidatesAreWrong ? "wrong" : "candidate";

    return "available";
  };
  const onClickNumber = (number, currentStatus) => {
    if (currentStatus === "used") {
      return;
    }
    const newCandidateNums =
      currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter((cn) => cn !== number);
    if (utils.sum(newCandidateNums) !== stars)
      setCandidateNums(newCandidateNums);
    else {
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
          	<PlayAgain onClick={resetGame} gameStatus={gameStatus} />
          ) : (
          	<StarsDisplay count={stars} />
          )}

        </div>
        <div className="right">
          {utils.range(1, 9).map((number: any) => (
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onClickNumber}
            />
          ))}
        </div>
      </div>
          <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
}

export default StarMatch;
