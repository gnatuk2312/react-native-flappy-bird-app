import { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

const BIRD_SIZE = 50;

const GAME_WIDTH = 416;
const GAME_HEIGHT = 800;
const GRAVITY = 5;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

export default function App() {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2)
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId: any;
    if (gameHasStarted && birdPosition < (GAME_HEIGHT - BIRD_SIZE)) {
      timeId = setInterval(() => {
        setBirdPosition(birdPosition => birdPosition + GRAVITY)
      }, 24)
    }
    return () => clearInterval(timeId)
  }, [gameHasStarted, birdPosition]);

  const handleClick = () => {
    const newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      setGameHasStarted(true);
    } else if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition)
    }
  }

  useEffect(() => {
    let obstacleId: any;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft(obstacleLeft => obstacleLeft - 5)
      }, 24)
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH)
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)))
    }

    return () => clearInterval(obstacleId)
  }, [gameHasStarted, obstacleLeft])

  useEffect(() => {
    const hasCollidedWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle = birdPosition <= GAME_HEIGHT && birdPosition >= GAME_HEIGHT - bottomObstacleHeight;

    if (obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)) {
      setGameHasStarted(false)
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft])

  return (
    <Container onTouchStart={handleClick}>
      <SafeAreaView>
        <GameBox width={GAME_WIDTH} height={GAME_HEIGHT}>
          <Obstacle top={0} left={obstacleLeft} width={OBSTACLE_WIDTH} height={obstacleHeight} />
          <Obstacle top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)} left={obstacleLeft} width={OBSTACLE_WIDTH} height={bottomObstacleHeight} />
          <Bird top={birdPosition} size={BIRD_SIZE} />
        </GameBox>
      </SafeAreaView>
      <StatusBar style="auto" />
    </Container>
  );
}

const Container = styled.View`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  
`;

type GameBoxProps = {
  height: number;
  width: number;
}
const GameBox = styled.View<GameBoxProps>`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  background-color: #ADD8E6;
`;

type BirdProps = {
  top: number;
  size: number;
}
const Bird = styled.View<BirdProps>`
  position: absolute;
  top: ${props => props.top}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: red;
  border-radius: 50%;
`
type ObstacleProps = {
  top: number;
  left: number;
  width: number;
  height: number;
}
const Obstacle = styled.View<ObstacleProps>`
  position: relative;
  background-color: green;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`
