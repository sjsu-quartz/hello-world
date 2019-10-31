"use strict";

//dom elements
let body;
let userInput;
let output;
let chatdiv; // javascript element -- same as p5 dom output
let submit;
let ask;

let database;
let allData;
let allDataArray;
let keys;

function setup() {
  var canvas = createCanvas(400, 300);
  canvas.parent('#canvas');
  background(51);


  userInput = select("#userInput")
  userInput.changed(post); // upon event that input changed (hit enter), run function newText
  //userInput.input(newTyping); //upon ANY text entered
  output = select('#output'); //selecting html paragraph id tag
  chatdiv = document.getElementById('output'); //this is to scroll output using js dom
  submit = select("#submit");
  submit.mousePressed(post);
  body = select("#body");



  // Your web app's Firebase configuration
  // This is named anon-chat-template-quartz
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDWEshNTibOD7sKfeqUd_DSESaXsowEA3Y",
    authDomain: "anon-forms-template.firebaseapp.com",
    databaseURL: "https://anon-forms-template.firebaseio.com",
    projectId: "anon-forms-template",
    storageBucket: "anon-forms-template.appspot.com",
    messagingSenderId: "167050591489",
    appId: "1:167050591489:web:d37f55469850813f8def00"
  };
  // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  //
  // database = firebase.database();
  // // console.log(firebase);

  //retrieving data
  //reference part of database you want to access
  // var ref = database.ref('responses/test');
  // ref.on('value', gotData, errData);

  firebase.initializeApp(firebaseConfig);

database = firebase.database();


let ref = database.ref('posts');
ref.on('value', gotData, errData);

}



function askFBseed() {
  // ask = "initialize femmebot";
  //
  // var data = {
  //     query: ask
  // };
  // socket.emit('ask', data);
  //scroll
  chatdiv.scrollTop = chatdiv.scrollHeight - chatdiv.clientHeight;
}

function post() {
  post = userInput.value();
  var postText = createP(post);
  postText.parent('#output');
  postText.class('user')

  let userData = {
    post: post,
    timeStamp: Date.now() // actuall same as postID but, whatever
  }

  savePost(userData);

  //reference part of the firebase database amd push to it
  // var ref = database.ref('responses/test');
  // ref.push(data);

  //reset field and scroll
  userInput.value("");
  chatdiv.scrollTop = chatdiv.scrollHeight - chatdiv.clientHeight;
}


function FBreply(data) {
  // console.log("FBreply called--- data:");
  // console.log(data);
  //
  // setTimeout(delayReply, 750);
  //
  // var reply = data.result.fulfillment.speech;
  // var modReply = reply.replace(/assistant/i, "femmebot");

  function delayReply() {
    var reply = createP(modReply);
    reply.parent('#output');
    reply.class('femmebot');

    // //store action called
    // action = data.result.action;
    // console.log(action);
    //
    // //store parameters if ANY
    // var parameters = data.result.parameters

    //scroll chatbox
    chatdiv.scrollTop = chatdiv.scrollHeight - chatdiv.clientHeight;
  }
}

function createPosts(){

  // create post for each entry
  // note this allows for filtering
  allDataArray.forEach(function(postNode) {
createP(postNode.post).parent('#output').class('femmebot');
  });

  // let posts = createP(modReply);
  // posts.parent('#output');
  // posts.class('femmebot');
}

function clearDiv(elementID) {
  document.getElementById(elementID).innerHTML = "";
}


//old femmebot
//callbacks for accessing firebase data
// function gotData(data) {
//   console.log("firebase confirmed")
//     // console.log(data.val());
//     var posts = data.val();
//     //create array of object keys so you can iterate thru them
//     var keys = Object.keys(posts);
//     //console.log(keys);
//     //now you can iterate thru objects and access data
//     for (var i = 0; i < keys.length; i++) {
//         var k = keys[i];
//         var asks = posts[k].query;
//     }
// }
//
// function errData(err) {
//     console.log('error retrieving data from Firebase:');
//     console.log(err);
// }
