//CommentList.js
import React, { Component } from 'react';
import Comment from './Comment';
import style from './style';
import Scroll from 'react-scroll';

var scroll = Scroll.animateScroll;


class CommentList extends Component {
  constructor(props) {
    super(props);
    this.scrollB = this.scrollB.bind(this);
  }

  scroll = Scroll.animateScroll

  scrollTo(amount) {
    scroll.scrollTo(amount);
  }

  componentDidMount() {
    // this.refs.commentList.addEventListener('click', this.scrollB);
    this.scrollB();
  }

  componentDidUpdate() {
    this.scrollB();
  }

  scrollB(){
    let comp = this.refs.commentList;
    let height = comp.scrollHeight;
    // console.log(height);
    comp.scrollTop = height;
  }

  render() {

    let commentNodes = this.props.data.map(comment => {
      return (
        <Comment author={ comment.author } key={ comment['_id'] }>
          { comment.text }
        </Comment>
      )
    })

// onScroll={this.scrollB}

    return (
      <div>
        <div ref="commentList" style={ style.commentList }>
          { commentNodes }
          <div ref="bottom" style={ style.bottomEl }></div>
        </div>
      </div>
    )
  }
}
export default CommentList;
