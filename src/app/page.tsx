import { Game } from '@/features/game';
import gameConfig from '@/shared/config/questions.json';

const HomePage = () => (
  <Game config={gameConfig} />
);

export default HomePage;
