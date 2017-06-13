import React, { Component } from 'react';
import Login from './Login';
import Header from './Header';
import style from './style';
// import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';



class RecipePlan extends Component {
  constructor(props) {
    super(props);
    this.state = { recipe: {}, data: []};
    this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.getRecipe = this.getRecipe.bind(this);
  }

  getRecipe(id) {
    // let id = this.props.match.params.id;
    let recipeGet = 'http://localhost:3001/api/recipes/'+id;
    // console.log(recipeGet);
    //get the recipe from mongo based on path that contains id parameter
    axios.get(recipeGet)
    .then(res => {
     //  console.log(" res.data", res.data)
     //  this.setState({ data: res.data });
    //  console.log(res.data[0]);
     this.setState({ recipe: res.data[0]});
    //  console.log(this.state.recipe);
    })
  }

  // componentWillMount() {
  //   this.getRecipe(this.props.match.params.id);
  //   // console.log(recipe);
  // }

  componentWillMount() {
    this.getRecipe(this.props.match.params.id);
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

  loadCommentsFromServer() {
    axios.get(this.props.url, { params: { recId: this.state.recipe._id } })
    .then(res => {
     //  console.log(" res.data", res.data)
      this.setState({ data: res.data });
    })
  }

  handleCommentSubmit(comment) {
    //add POST request
    axios.post(this.props.url, comment)
    .then(res => {
      console.log(res);
      this.setState({ data: res.data });
    })
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    let recipeTitle = this.state.recipe.title;
    let recipeImage = this.state.recipe.image;
    if (!recipeTitle){
      return(
        <h1>Loading</h1>
      )
    }
    let ingredients = this.state.recipe.ingredients.map(ingredient => {
      return (
        <div key={ ingredient }>
          <p>{ingredient}</p>
        </div>
      )});
    // console.log(this.state.profile);
    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <Login history={this.props.history} auth={this.props.auth}/>
          <div>
            <div>
              <div style={ style.recipeTitle }>
                <h1> { recipeTitle } </h1>
                <img src={ recipeImage } alt="Recipe"></img>
              </div>
              { ingredients }
            </div>
          </div>
          <div style={ style.commentBox }>
            <h2>Comments:</h2>
            <CommentList data={ this.state.data }/>
            <CommentForm recId={this.props.match.params.id} profile={this.state.profile} onCommentSubmit={ this.handleCommentSubmit }/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default RecipePlan;
