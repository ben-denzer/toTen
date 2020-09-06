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

const wait = (sec: number = 2) => new Promise((resolve) => setTimeout(resolve, sec * 1000));

const App: React.FC<{}> = () => {
  const [animalLocationMap, setAnimalLocationMap] = useState<AnimalLocationMap>({ ...initialLocationMap });
  const [generatorVal, setGeneratorVal] = useState<number | null>(null);
  const [calculatorVal, setCalculatorVal] = useState<number | null>(null);
  const [gameState, setGameState] = useState<gameStates>(gameStates.userClickButton);
  const [totalScores, setTotalScores] = useState<Scores>({ ...initialScore });
  const [matchScores, setMatchScores] = useState<Scores>({ ...initialScore });
  const [hasAllowedSpeech, setHasAllowedSpeech] = useState<boolean>(false);
  const [canDrag, setCanDrag] = useState<boolean>(false);

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
    setCanDrag(gameState === gameStates.userFirstRound || gameState === gameStates.userSecondRound);
    runStateLogic();
  }, [gameState, hasAllowedSpeech]);

  const moveAnimal = (newLocation: animalLocation) => (position: number, movedBy: player) => {
    const updated = { ...animalLocationMap, [position]: { location: newLocation, movedBy } };
    setAnimalLocationMap(updated);
  };

  const addAnimalToVehicle = moveAnimal(animalLocation.vehicle);
  const addAnimalToHome = moveAnimal(animalLocation.home);

  const updateMap = async (player: player, count: number) => {
    let updatedCount = 0;
    let updated: AnimalLocationMap = JSON.parse(JSON.stringify(animalLocationMap));
    if (count > 0) {
      for (let i of arrayOfTen) {
        if (updated[i].location === animalLocation.home) {
          updated[i].location = animalLocation.vehicle;
          updatedCount++;
          if (updatedCount === count) {
            break;
          }
        }
      }
    }
    setAnimalLocationMap(updated);
    setMatchScores({ ...matchScores, [player]: matchScores[player] + updatedCount });
    setNextGameState();
  };

  const aiFinishGame = async () => {
    const onVehicleCount = getAnimalsOnVehicleCount(animalLocationMap);
    const remaining = 10 - onVehicleCount;
    setCalculatorVal(remaining);
    await wait(1);
    updateMap(player.ai, remaining);
    speak(`${onVehicleCount} plus ${remaining} equals ten.`);
    const updatedScore: Scores = {
      [player.ai]: totalScores[player.ai] + matchScores[player.ai] + remaining,
      [player.user]: totalScores[player.user] + matchScores[player.user],
    };
    setTotalScores(updatedScore);
    await wait(3);
    resetMatch(true);
  };

  const getRandom = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const generatorClicked = (force?: boolean) => {
    if (!generatorVal || force) {
      const val = getRandom(10);
      setGeneratorVal(val);
      setNextGameState();
    }
  };

  const submitCalcVal = async () => {
    if (gameState === gameStates.userSecondRound) {
      const onVehicleCount = getAnimalsOnVehicleCount(animalLocationMap);
      if (onVehicleCount === generatorVal) {
        speak('Great job');
        setMatchScores({ ...matchScores, [player.user]: matchScores[player.user] + generatorVal });
        setNextGameState();
        return;
      } else {
        speak('Try Again');
      }
    }

    if (calculatorVal === null || generatorVal === null) {
      speak('Try Again.');
      return;
    }
    if (gameState === gameStates.userFirstRound) {
      if (calculatorVal + generatorVal === 10) {
        await wait(1);
        speak(`Awesome. ${calculatorVal} is correct. ${generatorVal} plus ${calculatorVal} makes 10.`);
        await wait();
        updateMap(player.user, calculatorVal);
        await wait(3);
        setMatchScores({ ...matchScores, [player.user]: matchScores[player.user] + calculatorVal });
        resetMatch(false);
        setNextGameState();
      } else {
        speak('Try Again.');
      }
    }
  };

  const allowSpeech = () => {
    speak('Hello');
    setHasAllowedSpeech(true);
  };

  const setNextGameState = () => {
    const nextStateMap: Record<gameStates, gameStates> = {
      [gameStates.userClickButton]: gameStates.aiFirstRound,
      [gameStates.aiFirstRound]: gameStates.userFirstRound,
      [gameStates.userFirstRound]: gameStates.aiClickButton,
      [gameStates.aiClickButton]: gameStates.userSecondRound,
      [gameStates.userSecondRound]: gameStates.aiSecondRound,
      [gameStates.aiSecondRound]: gameStates.userClickButton,
    };

    setGameState(nextStateMap[gameState]);
  };

  const runStateLogic = async () => {
    switch (gameState) {
      case gameStates.userClickButton:
        await wait(1);
        speak(getGameStateMessage(gameState));
        break;
      case gameStates.aiFirstRound:
        await wait();
        speak(getGameStateMessage(gameState, generatorVal?.toString()));
        await wait();
        updateMap(player.ai, Number(generatorVal));
        break;
      case gameStates.userFirstRound:
        await wait(1);
        speak(getGameStateMessage(gameState));
        break;
      case gameStates.aiClickButton:
        await wait(1);
        speak(getGameStateMessage(gameState));
        await wait();
        generatorClicked(true);
        break;
      case gameStates.userSecondRound:
        await wait(1);
        speak(getGameStateMessage(gameState, generatorVal?.toString()));
        break;
      case gameStates.aiSecondRound:
        await wait(1);
        const aiMoveCount = 10 - getAnimalsOnVehicleCount(animalLocationMap);
        speak(getGameStateMessage(gameState, aiMoveCount.toString()));
        await wait();
        aiFinishGame();
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
        <Vehicle animalLocationMap={animalLocationMap} addAnimalToVehicle={addAnimalToVehicle} canDrag={canDrag} />
        <NumberGenerator generatorClicked={generatorClicked} generatorVal={generatorVal} />
      </Row>
      <Row>
        <AnimalHome animalLocationMap={animalLocationMap} addAnimalToHome={addAnimalToHome} canDrag={canDrag} />
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
