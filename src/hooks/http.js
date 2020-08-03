import { useReducer , useCallback } from 'react';

// we will use intialState to reset state
const intialState = { 
    loading : false ,
    error: null ,
    data : null , 
    requestExtra : null , 
    reqIdentifier : null
}

const httpReducer = ( currentHttpState, action ) => {
    switch(action.type){
        case 'SEND':
            return { 
                loading : true ,
                requestExtra :null ,
                data : null,
            }
        case 'RESPONSE':
            return { 
                ...currentHttpState,
                loading : false ,
                data : action.data,
                reqIdentifier : action.reqIdentifier,
                requestExtra : action.requestExtra
            }
        case 'ERROR':
            return { 
                loading : false ,
                error : action.message, 
                data :null 
            }
        case 'CLEAR':
            return intialState
        default : 
            throw new Error(" HTTP State Error : The code Should not get here we need to cater for all cases")
    }
}
  
// by prefixing you component with 'use' react will treat it as a cstom hook
const useHttp = () => {
    // pass in your reducer and an initial value for state
    const [ httpState , dispatchHttpState ] = useReducer( httpReducer , { 
                                                                loading : false ,
                                                                error: null ,
                                                                data : null , 
                                                                requestExtra : null , 
                                                                reqIdentifier : null
                                                            });
    const clear = useCallback( () => {
        dispatchHttpState({type :'CLEAR' })
    },[])
    // avoid unnecessary re-render by using the useCallback hook                                                    
    const sendRequest = useCallback(( url , method , body , requestExtra , reqIdentifier ) => {
        dispatchHttpState({
            type : 'SEND',
            reqIdentifier : reqIdentifier
        })

        fetch( url ,{
          method : method,
          body : body,
          headers : {
            'Content-Type':'application/json'
          }
        })
        .then( response => {
            return response.json()
        })
        .then( responseData => {
          dispatchHttpState({
            type : 'RESPONSE' , 
            data : responseData ,
            requestExtra : requestExtra,
            reqIdentifier : reqIdentifier
          })
          console.log("Here is : ",responseData)
        })
        .catch( error => {
          dispatchHttpState({type : 'ERROR' , message : error.message})
          console.log(error);
        }) 
    },[]) // send request has no external dependancies

    return { 
        loading : httpState.loading,
        error : httpState.error,
        data : httpState.data,
        sendRequest :sendRequest,
        requestExtra : httpState.requestExtra, 
        reqIdentifier : httpState.reqIdentifier,
        clear : clear
     }

}

export default useHttp;