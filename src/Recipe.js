import React, { Component } from 'react';
import style from './style';
import List from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
// import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
    //map the ingredients array to a list of ingredients
    let ingredients = this.props.recipe.ingredients.map(ingredient => {
      return (
        <div key={ ingredient }>
          <p><FontIcon className="material-icons">local_grocery_store</FontIcon> {ingredient}</p>
        </div>
      )});

    return(
      <MuiThemeProvider>
        <div>
          <div style={ style.recipeTitle }>
            <h1> { recipeTitle } </h1>
            <img src={ recipeImage } alt="Recipe"></img>
          </div>
          <List style={style.inspIngredients}>
            <h2><FontIcon className="material-icons md-dark">content_paste</FontIcon> Ingredients</h2>
            { ingredients }
          </List>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Recipe;
