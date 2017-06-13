import React, { Component } from 'react';
import style from './style';

class Recipe extends Component {
  render() {
    let recipeTitle = this.props.recipe.title;
    let recipeImage = this.props.recipe.image;
    if (!recipeTitle){
      return(
        <div style={ style.noRecipe }>
          <h2>Out of ideas what to cook?</h2>
        </div>
      )
    }

    let ingredients = this.props.recipe.ingredients.map(ingredient => {
      return (
        <div key={ ingredient }>
          <p>{ingredient}</p>
        </div>
      )});

    return(
      <div>
        <div style={ style.recipeTitle }>
          <h1> { recipeTitle } </h1>
          <img src={ recipeImage } alt="Recipe"></img>
        </div>
        { ingredients }
      </div>
    )
  }
}

export default Recipe;
