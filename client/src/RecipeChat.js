import React, { Component } from 'react';
import style from './style';
import { subscribeToChat, sendRecipeChat } from './socketapi';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';


class RecipeChat extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: []};
    this.messageSend = this.messageSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    // console.log('recipeChat has mounted');
   let recId = this.props.recId;
   subscribeToChat(recId, (err, messages) => {
     if(this.unmounted) return
     this.setState({ messages: messages })
   });
  //  this.scrollToBottom();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  componentDidUpdate() {
    this.scrollToBottom();
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

  scrollToBottom(){
    // console.log('scroll height: ',this.refs.chat.scrollHeight);
    // console.log('div height: ', this.refs.chat.clientHeight);
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight-this.refs.chat.clientHeight;
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
            <h3>{message.author}: </h3>
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
          <Paper style={style.profileRecOwn}>
            <div
              style={style.profileRecOwn}
              onLoad={this.scrollToBottom}
              ref="chat">
              <h2><FontIcon className="material-icons md-dark">chat</FontIcon> Chat:</h2>
              <List>
                {recipeMessages}
              </List>
            {/* </Paper>
            <Paper style={style.profileRecOwn}> */}
              <TextField
                style={style.chatInput}
                value={this.state.chatInput}
                onChange={this.handleChange}
                hintText="Type away"
                floatingLabelText="Chat To Your Friends"
                multiLine={true}
                rows={2}
              />
              <RaisedButton onClick={this.messageSend} label="Send" />
            </div>
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default RecipeChat;
