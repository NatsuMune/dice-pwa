import './App.scss';
import 'react-dice-complete/dist/react-dice-complete.css'
import { useRoutes } from 'hookrouter';

import Homepage from './HomePage';
import Wind from './Wind';
import Cardpicking from './CardPicking';

const routes = {
  '/wind': () => <Wind />,
  '/pick': () => <Cardpicking />
}

function App() {
  return useRoutes(routes) || <Homepage />;
}

export default App;
