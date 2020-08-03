import React, {useContext} from 'react';
import {Context} from './context/authContext'
import Ingredients from './components/Ingredients/Ingredients';
import AuthPage from './components/Auth';

const App = props => {
  const context = useContext(Context);

  let content =  <AuthPage />
  if( context.isAuthenticated ){
    content = <Ingredients />;
  }

  return content;
};

export default App;
