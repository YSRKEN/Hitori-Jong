import React, { useContext } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import StateContext from './context';
import useStore from './store';
import StartForm from './Form/StartForm';
import GameForm from './Form/GameForm';

const FormSelector: React.FC = () => {
  const { applicationMode } = useContext(StateContext);

  switch(applicationMode) {
    case 'StartForm':
      return (<StartForm />);
    case 'GameForm':
      return (<GameForm />);
    default:
      return (<></>);
  }
}

const App: React.FC = () => {
  const context = useStore();

  return (<StateContext.Provider value={context}><FormSelector /></StateContext.Provider>);
};

export default App;
