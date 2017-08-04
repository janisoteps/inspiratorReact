import React, { Component } from 'react';
// import style from './style';
import { subscribeToChat, sendRecipeChat } from './socketapi';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class RecipeChat extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: []};
    this.messageSend = this.messageSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log('recipeChat has mounted');
   let recId = this.props.recId;
   subscribeToChat(recId, (err, messages) => {
     if(this.unmounted) return
     this.setState({ messages: messages })
   });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  messageSend() {
    console.log(this.state.chatInput);
    let message = this.state.chatInput;
    let recId = this.props.recId;
    let author = this.props.user.name;
    let authorId = this.props.user._id;
    sendRecipeChat(recId, message, author, authorId, (err, messages) => {
      this.setState({ messages: messages })
    });
    this.setState({chatInput: ''});
  }

  handleChange(event) {
    this.setState({chatInput: event.target.value});
  }

  render(){
    // console.log('chat messages: ', this.state.messages);

    var messageKey = 0;
    if(this.state.messages[0]){
      var recipeMessages = this.state.messages[0].comments.map(message => {
        // if (buddy.favName === )
        messageKey++;
        return (
          <ListItem key={ messageKey }>
            <h3>{message.author} says: </h3>
            <div>{message.comment}</div>
          </ListItem>
        )
      });
    } else {
      recipeMessages = "No messages yet";
    }



    return (
      <MuiThemeProvider>
        <div>
          <List>
            {recipeMessages}
          </List>
          <TextField
            value={this.state.chatInput}
            onChange={this.handleChange}
            hintText="Type away"
            floatingLabelText="Chat To Your Friends"
            multiLine={true}
            rows={2}
          />
          <RaisedButton onClick={this.messageSend} label="Send" />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default RecipeChat;
