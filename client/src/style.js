//style.js
const style = {
 commentBox: {
 width:'96vw',
 margin:'0 auto',
 fontFamily:'Roboto'
 },
 title: {
 textAlign:'center',
 textTransform:'uppercase'
 },
 commentList: {
 border:'1px solid #f1f1f1',
 padding:'0 12px',
 maxHeight:'30vh',
 overflow:'scroll'
 },
 comment: {
 backgroundColor:'#fafafa',
 margin:'10px',
 padding:'3px 10px',
 fontSize:'.85rem'
 },
 commentForm: {
 margin:'10px',
 display:'flex',
 flexFlow:'row wrap',
 justifyContent:'space-between'
 },
 commentFormAuthor: {
 minWidth:'150px',
 margin:'3px',
 padding:'0 10px',
 borderRadius:'3px',
 height:'40px',
 flex:'2'
 },
 commentFormText: {
 flex:'4',
 minWidth:'400px',
 margin:'3px',
 padding:'0 10px',
 height:'40px',
 borderRadius:'3px'
 },
 commentFormPost: {
 minWidth:'75px',
 flex:'1',
 height:'40px',
 margin:'5px 3px',
 fontSize:'1rem',
 backgroundColor:'#A3CDFD',
 borderRadius:'3px',
 color:'#fff',
 textTransform:'uppercase',
 letterSpacing:'.055rem',
 border:'none'
 },
 updateLink: {
 textDecoration:'none',
 paddingRight:'15px',
 fontSize:'.7rem'
 },
 deleteLink: {
 textDecoration:'none',
 paddingRight:'15px',
 fontSize:'.7rem',
 color:'red'
 },
 bottomEl: {
   height:'1px'
 },
 generator: {
   position: 'fixed',
   zIndex: '10000',
   backgroundColor: 'black'
 },
 generatorButton: {
   fontFamily:'Roboto',
   height: '60px',
   verticalAlign: 'middle'
 },
 genLabel: {
   fontSize: '2rem'
 },
 genContainer: {
   width: '90%',
  marginLeft: '5%',
  position: 'fixed',
  bottom: '15px'
 },
 recipeTitle: {
   marginLeft: '5px',
   marginRight: '5px',
   marginTop: '8px',
   marginBottom: '15px',
   fontFamily:'Roboto',
   textAlign: 'center',
   color: '#F2EEF1',
   textShadow: '0px 0px 6px #282623',
   backgroundColor: 'rgba(0,0,0,0.5) ',
   padding: '5px',
   paddingBottom: '10px',
   borderRadius: '3px'
 },
 recipeDesc: {
   marginRight: '5px',
   marginLeft: '5px'
 },
 noRecipe: {
   fontFamily:'Roboto',
   textAlign: 'center',
   marginTop: '35vh',
   color: 'white'
 },
 link: {
   textDecoration:'none'
 },
 home: {
  position:"absolute",
   top: '-10px',
   right: '10px',
  fontFamily:'Roboto',
  textAlign: 'right'
},
profPic: {
  width: '300px',
  height: 'auto',
  marginTop: '10px'
},
backToInsp: {
  width:'305px',
  marginTop:'30vh',
  verticalAlign:'middle'
},
header: {
  position: 'fixed',
  top: '2px',
  right: '2px'
},
headerBar: {
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '100vw',
  height: '40px',
  backgroundColor: '#2b2824',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, .5)',
  zIndex: '100000'
},
profile: {
  fontFamily:'Roboto',
  textAlign: 'center',
  color: 'white'
},
blankFooter: {
  height: '60px'
},
yesButton: {
  width: '50%',
  zIndex: '90000'
},
yesContainer:{
  width: '40vw',
  position: 'fixed',
  bottom: '15px',
  right: '5px',
  zIndex: '90000'
},
noButton: {
  width: '50%',
  zIndex: '90000'
},
noContainer:{
  width: '40vw',
  position: 'fixed',
  bottom: '15px',
  left: '5px',
  zIndex: '90000'
},
profileRecOwn:{
  maxHeight: '45vh',
  overflow: 'scroll',
  backgroundColor: 'rgba(255,255,255,0.8)',
  color: 'black',
  marginBottom: '15px',
  paddingLeft: '5px',
  borderRadius: '3px'
},
ingSearchContainer:{
  overflow: 'scroll',
  backgroundColor: 'rgba(255,255,255,0.7)',
  color: 'black',
  fontFamily:'Roboto',
  marginTop: '15px',
  padding: '15px',
  borderRadius: '3px'
},
recipeIngredients:{
  fontFamily:'Roboto'
},
inspIngredients:{
  marginTop:'10px',
  marginRight: '5px',
  marginLeft: '5px',
  fontFamily:'Roboto',
  paddingLeft: '10vw',
  color: 'white',
  backgroundColor: 'rgba(0,0,0,0.5) ',
  paddingBottom: '10px',
  paddingTop: '10px',
  borderRadius: '3px'
},
gotIngredient:{
  width: '120px',
  display: 'inline-block',
  float: 'right'
},
ingLine:{
  width: '60%',
  display: 'inline-block',
  position: 'relative',
  paddingLeft:'10px',
  marginRight: '10px'
},
ingRow:{
  minHeight: '40px',
  paddingLeft: '10px',
  paddingBottom: '5px',
  paddingTop: '5px'
},
inspRecipe:{
  position: 'relative',
  zIndex: '-100'
},
favFriend:{
  float: 'right',
  width: '20px',
  marginTop: '-10px'
},
directions:{
  fontFamily:'Roboto',
  textDecoration:'none',
  textAlign: 'center',
  color: 'white',
  textShadow: '0px 0px 10px #B24036'
},
tickIcon: {
  display: 'inline-block',
  width: '24px',
  verticalAlign: 'middle'
},
recipeImage: {
  maxWidth: '100%',
  height: 'auto',
},
inspListItem: {
  color: 'white'
},
chatInput: {
  width: '70vw',
  margin: '10px'
},
spinner: {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  top: '0',
  left: '0',
  backgroundColor: 'rgba(20,20,20,0.8) ',
  fontFamily:'Roboto',
  fontSize: '30px',
  color: 'white',
  paddingTop: '40vh',
  zIndex: '99999'
},
ingTextField: {
  marginRight: '15%',
  marginLeft: '15%',
  width: '70%'
}
}
module.exports = style;
