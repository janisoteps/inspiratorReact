import React, { Component } from 'react';
import style from './style';
// import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from './Login';
import Header from './Header';
import Spinner from './Spinner';
import TextField from 'material-ui/TextField';
import './recipesearch.css';
import Recipe from './Recipe';

class RecipeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { recipe: {}, spinner : false, isPicking: false, nothingFound: false, ing1: '', ing2: '', ing3: '', ing4: '', ing5: '', recipeSelector: 0 };
    this.getRecipe = this.getRecipe.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.recipeSwitcher = this.recipeSwitcher.bind(this);
    this.handleRecipeGen = this.handleRecipeGen.bind(this);
    this.getMetaData = this.getMetaData.bind(this);
    this.backToSearch = this.backToSearch.bind(this);
    this.recYes = this.recYes.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  //when app mounts get the user profile, check if mongo has a copy of it and if not copy id and name to mongo
  componentWillMount() {
   // console.log(this.props.auth);
   const isAuthenticated = this.props.auth.isAuthenticated;
   var isAuth = isAuthenticated();
   console.log('Authenticated:',isAuth);
   if(!isAuth){
     return
   }
   const getProfile = this.props.auth.getProfile;
   getProfile((err, profile) => {
       //  console.log(profile);
       //  console.log(this.state.profile);
       var getProfileUrl = '/api/users?fbId='+profile.sub;

        //try to find a user with the fb ID of the logged in user
       //  axios.get(endPoint+'/api/users', { params: { fbId: profile.sub } })

        fetch(getProfileUrl)
        .then(res => res.json())
        .then(res => {
         //  console.log(" res.data", res.data.length);
          //if the response from server doesn't contain any user data, post the user details
          if(res.length === 0){
            let userPost = {};
            userPost.name = profile.name;
            userPost.fbId = profile.sub;
            userPost.recOwner = [];
            userPost.recFriend = [];
            //axios.post(endPoint+'/api/users', userPost)

            fetch('/api/users', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userPost)
            })
            .then(res => {
               this.setState({ user: res });
               // console.log(" res.data", res.data);
            })
            .catch(err => {
              console.error(err);
            });
          }
          this.setState({ user: res });
        })
      });
  }

  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  handleChange(event) {
    let updateObject = function(){
      let returnObj = {};
      returnObj[this.target.name] = this.target.value;
      return returnObj;
    }.bind(event)();

    this.setState(updateObject);
    // console.log(updateObject);
  }

  handleSubmit(event) {
    this.setState({ spinner: true });
    // event.preventDefault();
    let ingquery = '';
    if(this.state.ing1 !== ''){
      ingquery = ingquery + this.state.ing1;
    }
    if(this.state.ing2 !== ''){
      ingquery = ingquery + ','+this.state.ing2;
    }
    if(this.state.ing3 !== ''){
      ingquery = ingquery + ','+this.state.ing3;
    }
    if(this.state.ing4 !== ''){
      ingquery = ingquery + ','+this.state.ing4;
    }
    if(this.state.ing5 !== ''){
      ingquery = ingquery + ','+this.state.ing5;
    }
    let body = {
      ingquery: ingquery
    }
    console.log(body);

    fetch('/api/recipesearch', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if(res.count === 0){
        this.setState({nothingFound: true});
        this.setState({ spinner: false });
        return
      }
      this.setState({recipes: res.recipes});
      this.recipeSwitcher();
    });
  }

  recipeSwitcher(){
    this.setState({ spinner: true });
    let recipeSelector = this.state.recipeSelector;
    this.setState({recipeSelector: recipeSelector+1});
    let recipes = this.state.recipes;
    if(!recipes[recipeSelector]){
      this.setState({nothingFound: true });
      this.setState({ spinner: false });
      this.setState({ recipe: ''});
      this.setState({ isPicking: false });
      return
    }
    let recId = recipes[recipeSelector].recipe_id;
    // console.log(recId);
    let recipeGenObj = { recipeId: recId , userId: this.state.user[0]._id };
    this.handleRecipeGen(recipeGenObj);
  }

  //Once the random id is received from generator post that ID to server to call external API to get the recipe
  handleRecipeGen(id) {
    //  console.log(id);
    //post the generated id to server
     fetch('/api/recipes', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(id)
     })
     .then(res => res.json())
     .then(res => {
       console.log('handleRecipeGen: ',res);
       //server replies with the mongo id that the recipe is saved with
       this.getMetaData(res);
     })
     .catch(err => {
      //  console.error(err);
      //  window.location = '/';
     });
   }

   //Once the recipe is generated and saved in mongo, use the mongo id to retrieve the recipe and set it to state
   getRecipe(recipeGet){
     if(this.unmounted) return
    //  console.log(recipeGet);
     fetch(recipeGet)
     .then(res => res.json())
     .then(res => {
      // console.log(res.data[0]);
      this.setState({ recipe: res[0]});
      this.setState({nothingFound: false});
      this.setState({ spinner: false });
      this.setState({ isPicking: true });
     })
   }

   //Post to another API endpoint to carry out website meta data scrub and get the description
   getMetaData(recId){
     if(this.unmounted) return
     var metaBody = {recId: recId};

     fetch('/api/recipemeta', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(metaBody)
     })
     .then(res => res.json())
     .then(res => {
      //  console.log(res);
       //server replies with the mongo id that the recipe is saved with
      //  console.log(res.data);
       //generate express API path with mongo id parameter and call getRecipe function with that path
       let recipeGet = '/api/recipes/'+res;
       this.getRecipe(recipeGet);
     });
   }

   //Ger back to ingredient input when button pressed
   backToSearch(){
     this.setState({ recipe: ''});
     this.setState({ isPicking: false });
   }

   // when recipe accepted get the ID of the recipe from onclick and set the path to the recipe route
   // and then add recipe id to user profile
   recYes(){
     let recipePath = 'recipe/'+this.state.recipe._id;
     let recipeName = this.state.recipe.title;
     // console.log(recipePath, recipeName);
     // console.log(this.props.user[0]);
     let userId = this.state.user[0]._id;
     // console.log(userId);

     let recYesBody = {
       id: userId,
       recId: this.state.recipe._id,
       recName: recipeName
     };

     fetch('/api/users', {
       method: 'PUT',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(recYesBody)
     });

     this.goTo(recipePath);
   }



  render() {
    var isLoading = this.state.spinner;
    var isPicking = this.state.isPicking;
    var nothingFound = this.state.nothingFound;
    return(
      <MuiThemeProvider>
        <div>
          { isLoading && (
                <Spinner />
          )}
          <Header />
          <Login history={this.props.history} auth={this.props.auth}/>
          { !isPicking && (
            <div>
              <div style={style.ingSearchContainer}>
                <center><h3>What do you have in fridge?</h3></center>
                <center><p>You can also input food categories, cuisines, recipe names, etc</p></center>
                <TextField
                  name="ing1"
                  style={style.ingTextField}
                  hintText="Something you want to cook with"
                  floatingLabelText="About to expire:"
                  value={this.state.ing1}
                  onChange={this.handleChange}
                />
                { this.state.ing1 !== '' && (
                  <TextField
                    name="ing2"
                    style={style.ingTextField}
                    hintText="Additional ingredient"
                    floatingLabelText="Could also throw in:"
                    value={this.state.ing2}
                    onChange={this.handleChange}
                  />
                )}
                { this.state.ing2 !== '' && (
                  <TextField
                    name="ing3"
                    style={style.ingTextField}
                    hintText="Additional ingredient"
                    floatingLabelText="Bought too much of:"
                    value={this.state.ing3}
                    onChange={this.handleChange}
                  />
                )}
                { this.state.ing3 !== '' && (
                  <TextField
                    name="ing4"
                    style={style.ingTextField}
                    hintText="Additional ingredient"
                    floatingLabelText="Don't know what to do with:"
                    value={this.state.ing4}
                    onChange={this.handleChange}
                  />
                )}
                { this.state.ing4 !== '' && (
                <TextField
                  name="ing5"
                  style={style.ingTextField}
                  hintText="Additional ingredient"
                  floatingLabelText="Need to get rid of everything!"
                  value={this.state.ing5}
                  onChange={this.handleChange}
                />
                )}
                <br />
                <br />
                { this.state.ing1 !== '' && (
                  <a href="#"><div id="ingSearchSubmit" onClick={this.handleSubmit}>INSPIRE ME!</div></a>
                )}
              </div>
            </div>
          )}
          { isPicking && (
            <a href="#"><div id="changeIngredients" onClick={this.backToSearch}>CHANGE INGREDIENTS</div></a>
          )}
          { isPicking && (
            <div>
              <Recipe style={style.inspRecipe} recipe={ this.state.recipe }/>
              <div style={style.blankFooter}></div>

              <div style={style.yesButton}>
                <RaisedButton
                  labelColor="#ffffff"
                  backgroundColor="#a4c639"
                  style={ style.yesContainer }
                  onClick={this.recYes}
                  labelStyle={ style.genLabel }
                  buttonStyle={ style.generatorButton}
                  label="Let's Go!"/>
              </div>
              <div style={style.noButton}>
                <RaisedButton
                  labelColor="#ffffff"
                  backgroundColor="#ff7716"
                  style={ style.noContainer }
                  onClick={this.recipeSwitcher}
                  labelStyle={ style.genLabel }
                  buttonStyle={ style.generatorButton}
                  label="Nope"/>
              </div>
            </div>
          )}
          { nothingFound && (
            <div id="nothingFound"><p>Nothing was found :( </p><p>Try different or less ingredients</p></div>
          )}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default RecipeSearch;
