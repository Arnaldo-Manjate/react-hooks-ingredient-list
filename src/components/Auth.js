import React , { useContext } from 'react';
import {Context} from '../context/authContext';
import Card from './UI/Card';
import './Auth.css';

const Auth = props => {
  // to consume context you need to use 'useContex'
  const context = useContext(Context);
  const loginHandler = () => {
    context.login();
  };

  return (
    <div className="auth">
      <Card>
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};

export default Auth;