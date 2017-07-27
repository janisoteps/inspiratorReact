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
    let socialRank = this.props.recipe.socialRank;
    if(socialRank){
      socialRank = socialRank.toFixed(2);
    }

    if (!recipeTitle){
      return(
        <div style={ style.noRecipe }>
          <h2>Out of ideas what to cook?</h2>
        </div>
      )
    }
    //map the ingredients array to a list of ingredients
    let ingredients = this.props.recipe.ingredients.map(ingredient => {
      let index = this.props.recipe.ingredients.indexOf(ingredient) + Math.random();
      index = index.toFixed(2);
      console.log(index);
      return (
        <div key={ index }>
          <p><FontIcon className="material-icons">local_grocery_store</FontIcon> {ingredient}</p>
        </div>
      )});

    return(
      <MuiThemeProvider>
        <div>
          <div style={ style.recipeTitle }>
            <h1> { recipeTitle } </h1>
            <img style={style.recipeImage} src={ recipeImage } alt="Recipe"></img>
            <h3> This recipe is liked by {socialRank}% of people.</h3>
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
