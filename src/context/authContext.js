import React , { useState }from 'react';

export const Context = React.createContext({
    isAuthenticated : false,
    login : () => {}
});


const  AuthContextProvider = props => {
    const [ isLoggedIn , SetLogin ] = useState(false);

    const loginHandler = () => {
        SetLogin(true);
    }

    return(

        <Context.Provider  value={{login : loginHandler , isAuthenticated: isLoggedIn}} >
            {props.children}
        </Context.Provider>
    )
}

export default AuthContextProvider;