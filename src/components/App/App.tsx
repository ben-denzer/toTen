import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Vehicle from '../Vehicle';
import { animalLocation, AnimalLocationMap, player, gameStates, Scores } from '../../types';
import { arrayOfTen, gameStateMessages } from '../../config';
import AnimalHome from '../AnimalHome';
import NumberGenerator from '../NumberGenerator';
import Calculator from '../Calculator';
import { getAnimalsOnVehicleCount } from '../../utils';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
  background-color: #ccc;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const ScoreRow = styled(Row)`
  width: 100%;
  justify-content: space-evenly;
  margin-bottom: 10px;
`;

const ScoreBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  min-height: 30px;
  background-color: blue;
  color: white;
  border-radius: 5px;
`;

const initialLocationMap: AnimalLocationMap = arrayOfTen.reduce((acc, cur) => {
  return { ...acc, [cur]: { location: animalLocation.home, movedBy: null } };
}, {});

const initialScore: Scores = {
  [player.ai]: 0,
  [player.user]: 0,
};

const App: React.FC<{}> = () => {
  const [animalLocationMap, setAnimalLocationMap] = useState<AnimalLocationMap>({ ...initialLocationMap });
  const [generatorVal, setGeneratorVal] = useState<number | null>(null);
  const [calculatorVal, setCalculatorVal] = useState<number | null>(null);
  const [gameState, setGameState] = useState<gameStates>(gameStates.aiActionFirst);
  const [firstPlayer, setFirstPlayer] = useState<player>(player.ai);
  const [totalScores, setTotalScores] = useState<Scores>({ ...initialScore });
  const [matchScores, setMatchScores] = useState<Scores>({ ...initialScore });

  const resetMatch = (clearMatchScore: boolean) => {
    const nextFirstPlayer = firstPlayer === player.ai ? player.user : player.ai;
    setAnimalLocationMap({ ...initialLocationMap });
    setGeneratorVal(null);
    setCalculatorVal(null);
    setFirstPlayer(nextFirstPlayer);
    if (clearMatchScore) {
      setMatchScores({ ...initialScore });
    }
    setGameState(nextFirstPlayer === player.ai ? gameStates.aiActionFirst : gameStates.userActionFirst);
  };

  useEffect(() => {
    console.log(gameStateMessages[gameState]);
  }, [gameState]);

  useEffect(() => {
    console.log('match scores', matchScores);
  }, [matchScores]);

  const moveAnimal = (newLocation: animalLocation) => (position: number, movedBy: player) => {
    const updated = { ...animalLocationMap, [position]: { location: newLocation, movedBy } };
    setAnimalLocationMap(updated);
  };

  const addAnimalToVehicle = moveAnimal(animalLocation.vehicle);
  const addAnimalToHome = moveAnimal(animalLocation.home);

  const aiMove = (count: number) => {
    let updatedCount = 0;
    let updated: AnimalLocationMap = JSON.parse(JSON.stringify(animalLocationMap));
    for (let i of arrayOfTen) {
      if (updated[i].location === animalLocation.home) {
        updated[i].location = animalLocation.vehicle;
        updatedCount++;
        if (updatedCount === count) {
          break;
        }
      }
    }
    setMatchScores({ ...matchScores, [player.ai]: matchScores[player.ai] + updatedCount });
    setAnimalLocationMap(updated);
  };

  const aiFinishGame = () => {
    const remaining = 10 - getAnimalsOnVehicleCount(animalLocationMap);
    setCalculatorVal(remaining);
    aiMove(remaining);
    const updatedScore: Scores = {
      [player.ai]: totalScores[player.ai] + matchScores[player.ai] + remaining,
      [player.user]: totalScores[player.user] + matchScores[player.user],
    };
    setTotalScores(updatedScore);
    setTimeout(() => resetMatch(true), 3000);
  };

  const getRandom = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const generatorClicked = () => {
    if (!generatorVal) {
      const val = getRandom(9);
      setGeneratorVal(val);
      if (firstPlayer === player.ai) {
        setTimeout(() => {
          aiMove(val);
          setTimeout(() => {
            setGameState(gameStates.userActionLast);
          }, 1000);
        }, 2000);
      } else {
        setTimeout(() => setGameState(gameStates.userActionFirst), 1000);
      }
    }
  };

  const submitCalcVal = () => {
    if (gameState === gameStates.userActionFirst) {
      const onVehicleCount = getAnimalsOnVehicleCount(animalLocationMap);
      if (onVehicleCount === generatorVal) {
        // say great job!
        setMatchScores({ ...matchScores, [player.user]: matchScores[player.user] + (calculatorVal || 0) });
        setTimeout(() => {
          setGameState(gameStates.aiActionLast);
          setTimeout(aiFinishGame, 1000);
        }, 2000);
        return;
      } else {
        setGameState(gameStates.userTryAgainFirst);
      }
    }

    if (calculatorVal === null || generatorVal === null) {
      return;
    }
    if (calculatorVal + generatorVal === 10) {
      setMatchScores({ ...matchScores, [player.user]: matchScores[player.user] + calculatorVal });
      setGameState(gameStates.userWinsMatch);
      setTimeout(() => resetMatch(false), 3000);
    } else {
      setGameState(gameStates.userTryAgainLast);
    }
  };

  return (
    <AppWrapper>
      <ScoreRow>
        <ScoreBox>Player 1 (You): {totalScores[player.user]}</ScoreBox>
        <ScoreBox>Player 2 (Computer): {totalScores[player.ai]}</ScoreBox>
      </ScoreRow>
      <Row>
        <Vehicle animalLocationMap={animalLocationMap} addAnimalToVehicle={addAnimalToVehicle} />
        <NumberGenerator generatorClicked={generatorClicked} generatorVal={generatorVal} />
      </Row>
      <Row>
        <AnimalHome animalLocationMap={animalLocationMap} addAnimalToHome={addAnimalToHome} />
        <Calculator
          calculatorVal={calculatorVal}
          setCalculatorVal={setCalculatorVal}
          submitCalcValue={submitCalcVal}
          gameState={gameState}
        />
      </Row>
    </AppWrapper>
  );
};

export default App;
