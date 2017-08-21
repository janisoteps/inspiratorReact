import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:5000');
let port = process.env.PORT || 5000;
const socket = openSocket(window.location.hostname +':'+ port);

//Function to subscribe to chat messages on recipe, ingests recipe id sent by component and callback function
function subscribeToChat(recId, callBack) {
  // console.log('trying to subscribe with recipe ID: ', recId);
  socket.on('chat', messages => callBack(null, messages));
  socket.emit('subscribeToChat', recId);
}

export { subscribeToChat };


//Function to send messages to Server
function sendRecipeChat(recId, message, author, authorId, callBack){
  // console.log('trying to send message with recipe ID: ', recId);
  socket.emit('message', {recId: recId, message: message, author: author, authorId: authorId, date: new Date()});
}

export { sendRecipeChat };
