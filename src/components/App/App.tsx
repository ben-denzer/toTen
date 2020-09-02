import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Vehicle from '../Vehicle';
import { animalLocation, AnimalLocationMap, player, gameStates, Scores } from '../../types';
import { arrayOfTen, getGameStateMessage } from '../../config';
import AnimalHome from '../AnimalHome';
import NumberGenerator from '../NumberGenerator';
import Calculator from '../Calculator';
import { getAnimalsOnVehicleCount } from '../../utils';
import { speak } from '../../services/speechService';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  padding: 0 20px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 25px;
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
  const [gameState, setGameState] = useState<gameStates>(gameStates.userClickButton);
  const [totalScores, setTotalScores] = useState<Scores>({ ...initialScore });
  const [matchScores, setMatchScores] = useState<Scores>({ ...initialScore });
  const [hasAllowedSpeech, setHasAllowedSpeech] = useState<boolean>(false);

  const resetMatch = (clearMatchScore: boolean) => {
    setAnimalLocationMap({ ...initialLocationMap });
    setGeneratorVal(null);
    setCalculatorVal(null);
    if (clearMatchScore) {
      setMatchScores({ ...initialScore });
    }
    setNextGameState();
  };

  useEffect(() => {
    const msg = getGameStateMessage(gameState);
    console.log(msg);
    if (/^ai/.test(gameState)) {
      setTimeout(setNextGameState, 2000);
    }
  }, [gameState, hasAllowedSpeech]);

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
      setNextGameState(val.toString());
    }
  };

  const submitCalcVal = () => {
    if (gameState === gameStates.userFirstRound) {
      const onVehicleCount = getAnimalsOnVehicleCount(animalLocationMap);
      if (onVehicleCount === generatorVal) {
        setMatchScores({ ...matchScores, [player.user]: matchScores[player.user] + (calculatorVal || 0) });
        setNextGameState(calculatorVal?.toString());
        return;
      } else {
        speak('Try Again');
      }
    }

    if (calculatorVal === null || generatorVal === null) {
      return;
    }
    if (calculatorVal + generatorVal === 10) {
      setMatchScores({ ...matchScores, [player.user]: matchScores[player.user] + calculatorVal });
      setNextGameState();
    } else {
      speak('Try Again.');
    }
  };

  const allowSpeech = () => {
    speak('Hello');
    setHasAllowedSpeech(true);
  };

  const wait = (sec: number = 2) => new Promise((resolve) => setTimeout(resolve, sec * 1000));

  const setNextGameState = async (val?: string | number) => {
    const nextStateMap: Record<gameStates, gameStates> = {
      [gameStates.userClickButton]: gameStates.aiFirstRound,
      [gameStates.aiFirstRound]: gameStates.userFirstRound,
      [gameStates.userFirstRound]: gameStates.aiClickButton,
      [gameStates.aiClickButton]: gameStates.userSecondRound,
      [gameStates.userSecondRound]: gameStates.aiSecondRound,
      [gameStates.aiSecondRound]: gameStates.userWinsMatch,
      [gameStates.userWinsMatch]: gameStates.userClickButton,
    };

    const nextState = nextStateMap[gameState];

    console.log('nextGameState', nextState);

    switch (gameState) {
      case gameStates.userClickButton:
        await wait();
        speak(getGameStateMessage(nextState, val?.toString()));
        await wait();
        setGameState(nextState);
        break;
      case gameStates.aiFirstRound:
        aiMove(Number(generatorVal));
        await wait();
        speak(getGameStateMessage(nextState));
        setGameState(nextState);
        break;
      case gameStates.userFirstRound:
        speak(getGameStateMessage(nextState, val?.toString()));
        resetMatch(false);
        await wait();
        setGameState(nextState);
        break;
      default:
        speak(`I don't have anything for ${gameState} yet`);
    }
  };

  return (
    <AppWrapper>
      <ScoreRow>
        <ScoreBox>Player 1 (You): {totalScores[player.user]}</ScoreBox>
        <ScoreBox>Player 2 (Computer): {totalScores[player.ai]}</ScoreBox>
      </ScoreRow>
      {!hasAllowedSpeech && <div onClick={allowSpeech}>Click here to allow speech</div>}
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
