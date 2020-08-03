import React, {useState, useEffect, useRef} from 'react';
import useHttp from '../../hooks/http';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  // set state 
  const [ EnteredText, setEnteredText ] = useState('');
  const { data , error , loading , sendRequest , clear } = useHttp();
  // destructure the updateIngredients here so that we can use it as a dependancy and not refers to all the props
  const { updateIngredients } = props
  const inputRef = useRef(null);
  // fetch firebase for ingredients via the searchText
  useEffect( () => {
    // attempt tp make request every 5 seconds
    const timoeutId = setTimeout( () => {
      // compare ref value to the enclosed value we got half a second ago
      if(EnteredText === inputRef.current.value){
        const query = EnteredText.length === 0 ? '' : `?orderBy="title"&equalTo="${EnteredText}"`
        sendRequest(
          'https://react-hooks-f4397.firebaseio.com/ingredients.json' + query,
          'GET'
        )
      }
    }, 500 )
    // do clean up by returning a function that will right right before the second time useEffect is called since we have dependancies
    // if we did not have dependancies it would run right befor the component is unmounted
    return () => { clearTimeout( timoeutId )}
     // list all dependancies
  }, [EnteredText , inputRef, sendRequest]);

  useEffect( () => {
    const ingredients = [];
    if( !loading && !error ){
      for( let key in data){
        ingredients.push({
          id : key,
          title : data[key].title,
          amount : data[key].amount,
        })
      }
    }

    updateIngredients(ingredients)
  }, [updateIngredients, data, loading, error])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          { loading && <span>loading ...</span>}
          <input 
            type="text" 
            ref={inputRef}
            value={EnteredText} 
            onChange={ event => {
            console.log(event.target.value)
            setEnteredText(event.target.value) }} />
        </div>
      </Card>
    </section>
  );
});

export default Search
