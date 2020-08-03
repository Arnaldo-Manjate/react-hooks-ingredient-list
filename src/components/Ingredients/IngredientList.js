import React from 'react';

import './IngredientList.css';

// use callback will only work if the parent uses React.memo
const IngredientList = React.memo(props => {
  console.log('Rendering Ingredient List');
  return (
    <section className="ingredient-list">
      <h3>Loaded Ingredients</h3>
      <ul>
        {props.ingredients.map( ( ig , index ) => (
          <li key={index} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section> 
  );
});

export default IngredientList;
