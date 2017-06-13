import React, { Component } from 'react';
import style from './style';
import RaisedButton from 'material-ui/RaisedButton';
// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Generator extends Component {
  constructor(props) {
    super(props);
    this.state = { recipeId: ''};
    this.genId = this.genId.bind(this);
    this.recYes = this.recYes.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  goTo(route) {
    this.props.history.replace(`/${route}`)
  }
  //Generate a random ID for recipe retrieval
  genId(){
    let id = Math.floor((Math.random() * 40000) + 10000);
    // console.log(id);
    this.setState({ recipeId: id });
    this.props.onRecGen({ recipeId: id });
    // console.log(`${id} is the new recipe Id`);
    this.setState({ recipeId: '' });
  }

  // when recipe accepted get the ID of the recipe from onclick and set the path to the recipe route and then add recipe id to user profile
  recYes(id){
    const recipePath = 'recipe/'+id;
    console.log(recipePath);

    console.log(this.props.user[0]);
    let userId = this.props.user[0]._id;
    console.log(userId);
    //
    // this.goTo(recipePath);
  }


  render() {
    const isRecipe = this.props.recipe._id;
    // console.log(this.props.recipe._id);
    // const user = this.props.user;
    // console.log(user);
    return (
      <div>
        {
          !isRecipe && (
            <div>
              <RaisedButton
                labelColor="#ffffff"
                backgroundColor="#a4c639"
                style={ style.genContainer }
                onClick={this.genId.bind(this)}
                labelStyle={ style.genLabel }
                buttonStyle={ style.generator}
                label="Generate Recipe"/>
            </div>
          )
        }
        {
          isRecipe && (

            <div>
              <div style={style.yesButton}>
                <RaisedButton
                  labelColor="#ffffff"
                  backgroundColor="#a4c639"
                  style={ style.yesContainer }
                  onClick={this.recYes.bind(this, isRecipe)}
                  labelStyle={ style.genLabel }
                  buttonStyle={ style.generator}
                  label="Let's Go!"/>
              </div>
              <div style={style.noButton}>
                <RaisedButton
                  labelColor="#ffffff"
                  backgroundColor="#ff7716"
                  style={ style.noContainer }
                  onClick={this.genId}
                  labelStyle={ style.genLabel }
                  buttonStyle={ style.generator}
                  label="Nope"/>
              </div>
            </div>
          )
        }
      </div>

    )
  }
}

export default Generator;
