import React, { useReducer, useCallback, useMemo, useEffect} from 'react';
import useHttp from '../../hooks/http';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

// we want our Reducer Decoupled from out Component so 
// that it is not re-rendered everytime the component is re-rendered
const ingredientReducer = ( currentIngredients , action ) => {
  switch(action.type){
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients , action.ingredient ]
    case 'DELETE':
      return currentIngredients.filter( ingredient => ingredient.id !== action.id )
    default : 
      throw new Error(" Ingredient State Error :The code Should not get here we need to cater for all cases")
  }
}

const  Ingredients = props => {
    // use state must be used on the root level of a functional component or hook
    // use reducer takes one mandatory and optional value,   the reducer and an option initial value of state   
    const [ userIngredients , dispatch ] = useReducer( ingredientReducer,[]);
    const {  
            loading ,
            error , 
            data , 
            sendRequest, 
            requestExtra , 
            reqIdentifier,
            clear 
          } = useHttp() // call our custom hook

    // useEffect will run after the Component has rendered and after the request has been sent 
    useEffect( () => {
      if(reqIdentifier === 'REMOVE_INGREDIENT' && !loading && !error ){
        dispatch({type :'DELETE' , id : requestExtra })
      }else if(reqIdentifier === 'ADD_INGREDIENT'  && !loading && !error ){
        dispatch({type :'ADD' , ingredient : {id : data.name , ...requestExtra} })
      }
     
    }, [data , requestExtra , reqIdentifier , error, loading])

    const addIngredientHandler = useCallback( ingredient => {
      sendRequest(
        `https://react-hooks-f4397.firebaseio.com/ingredients.json`,
        'POST',
         JSON.stringify(ingredient), 
         ingredient, 
         'ADD_INGREDIENT'
       )

    } , [sendRequest])

    const removeIngredientHandler = useCallback(ingredientId => {
      sendRequest(
        `https://react-hooks-f4397.firebaseio.com/ingredients/${ingredientId}.json`, // url
        'DELETE', // method 
        null , // no data 
        ingredientId, // extra,
        'REMOVE_INGREDIENT'
        )

    }, [sendRequest]) // if we had not wrapped send reqest with useCallback Send Request would change 
                      // because the Ingredient component would have changed 

    // onSearchIngredients is a function inside of the Ingredients Component as a result when the 
    // ingredients component Re-renders onSearchIngredients will be reacreated so technicall its reference will chane
    // to avoid this we wrap this function in useCallBack to cache the function and avoid recreating it so that any component 
    // that includes onSearchIngredients as a dependancy will not unnesesarilly re-render
    const onSearchIngredients = useCallback(ingredients => {
      dispatch({ type: 'SET' ,ingredients});
    }, []) // takes not dependancies although we could list setUserIngredients as a depandancy because React Garentees that it will never change
    // delete an ingredient

    // we use the use Memo hook to cache the ingredientList and make sure that we only 
    // render the ingredientList when the ingredients have actually changed
    const ingredientsList = useMemo( () => {
      return    <IngredientList  
                  ingredients={userIngredients} 
                  onRemoveItem={ removeIngredientHandler }/>
    }, [removeIngredientHandler , userIngredients])


  return (
    <div className="App">
      { error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={loading} />
      <section>
        <Search 
          updateIngredients={onSearchIngredients}/>
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
