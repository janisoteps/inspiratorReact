import React, { Component } from 'react';
import style from './style';
import RaisedButton from 'material-ui/RaisedButton';
// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
// import axios from 'axios';
// const endPoint = 'http://localhost:5000';

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
    // console.log('user id :',this.props.user[0]._id);
    if(!this.props.user[0]) {
      alert('Please log in!');
      return
    }
    this.setState({ recipeId: id , userId: this.props.user[0]._id });
    this.props.onRecGen({ recipeId: id , userId: this.props.user[0]._id  });
    // console.log(`${id} is the new recipe Id`);
    this.setState({ recipeId: '' });
  }

  // when recipe accepted get the ID of the recipe from onclick and set the path to the recipe route and then add recipe id to user profile
  recYes(id){
    let recipePath = 'recipe/'+id;
    let recipeName = this.props.recipe.title;
    // console.log(recipePath, recipeName);
    // console.log(this.props.user[0]);
    let userId = this.props.user[0]._id;
    // console.log(userId);

    let recYesBody = {
      id: userId,
      recId: id,
      recName: recipeName
    };

    // axios.put(endPoint+'/api/users', {
    //   id: userId,
    //   recId: id,
    //   recName: recipeName
    // }).then(res => {
    //   // console.log(res.data);
    //   // this.setState({ data: res.data });
    // });

    fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recYesBody)
    })

    this.goTo(recipePath);
  }


  render() {
    const isRecipe = this.props.recipe._id;
    // console.log(this.props.recipe._id);
    // const isLoading = this.state.spinner;
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
                buttonStyle={ style.generatorButton}
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
                  buttonStyle={ style.generatorButton}
                  label="Let's Go!"/>
              </div>
              <div style={style.noButton}>
                <RaisedButton
                  labelColor="#ffffff"
                  backgroundColor="#ff7716"
                  style={ style.noContainer }
                  onClick={this.genId}
                  labelStyle={ style.genLabel }
                  buttonStyle={ style.generatorButton}
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
