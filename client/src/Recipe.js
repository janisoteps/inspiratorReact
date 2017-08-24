import React, { Component } from 'react';
import style from './style';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
// import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Recipe extends Component {
  render() {
    let recipeTitle = this.props.recipe.title;
    let recipeImage = this.props.recipe.image;
    let socialRank = this.props.recipe.socialRank;
    let recipeDesc = this.props.recipe.description;
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
      // console.log(index);
      return (
        <ListItem style={style.inspListItem} key={ index }>
          <FontIcon style={style.inspListItem} className="material-icons">local_grocery_store</FontIcon> {ingredient}
        </ListItem>
      )});

    return(
      <MuiThemeProvider>
        <div>
          <div style={ style.recipeTitle }>
            <h1> { recipeTitle } </h1>
            <img style={style.recipeImage} src={ recipeImage } alt="Recipe"></img>
            <h4> This recipe is liked by {socialRank}% of people.</h4>
            <p style={style.recipeDesc}> {recipeDesc}</p>
          </div>

          <List style={style.inspIngredients}>
            <h2><FontIcon style={style.inspListItem} className="material-icons md-dark">content_paste</FontIcon> Ingredients</h2>
            { ingredients }
            <p>Recipe provided by Food2Fork.com</p>
          </List>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Recipe;
