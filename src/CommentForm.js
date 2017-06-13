//CommentForm.js
import React, { Component } from 'react';
import style from './style';

class CommentForm extends Component {
 constructor(props) {
   super(props);
   this.state = { author: this.props.profile.name, text: '' };
  //  this.handleAuthorChange = this.handleAuthorChange.bind(this);
   this.handleTextChange = this.handleTextChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
 }
 // handleAuthorChange(e) {
 //   this.setState({ author: e.target.value });
 // }
 handleTextChange(e) {
   this.setState({ text: e.target.value });
 }
 handleSubmit(e) {
   e.preventDefault();
   let author = this.props.profile.name;
   let text = this.state.text.trim();
   let recId = this.props.recId;
   if (!text || !author) {
     return;
   }
   this.props.onCommentSubmit({ author: author, text: text , recId: recId});
   console.log(`${this.props.profile.name} said “${this.state.text}” `);
   this.setState({ text: '', author: '', recId: '' });
   //we will be tying this into the POST method in a bit
 }
 render() {
   return (
     <form style={ style.commentForm } onSubmit={ this.handleSubmit }>
       <p>{this.props.profile.name} will say</p>
       <input
         type='text'
         placeholder='Say something…'
         style={ style.commentFormText}
         value={ this.state.text }
         onChange={ this.handleTextChange } />
       <input
         type='submit'
         style={ style.commentFormPost }
         value='Post' />
     </form>
   )
 }
}
export default CommentForm;
