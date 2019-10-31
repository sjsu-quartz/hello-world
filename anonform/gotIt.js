"use strict";

function gotData(data) {
  // need to retrieve firebase data with val() method

  allData = data.val();
  console.log("allData is " + allData);
  allDataArray = Object.values(allData);
  // numberPosts = allDataArray.length;
  console.log("allDataArray is " +  allDataArray);


  // create array of keys (post ids)
  keys = Object.keys(allData);


  // to reassign post object values > this was for making "seekingBusinessPartner" change to "humanSeeksComputer"
  // allDataArray.forEach(function(post) {
  //   if (post.postType === "seekingBusinessPartner") {
  //     console.log(post);
  //     firebase.database().ref('personals/' + post.timeStamp).update({
  //       postType: "humanSeeksComputer"
  //     });
  //   }
  // });

  createPosts();
}

function errData(err) {
  console.log("error!");
  console.log(err);
}



function savePost(data) {

  let postID = Date.now();
  // original
  let result = firebase.database().ref('posts/' + postID).set(data);
}

function pushMoreData(data) {

  // this works to add new key:value pairs and also to reassign values with same key name

  // original push
  firebase.database().ref('posts/' + postID).update(data);

  // add new data to local userData object (this will also reassign values)
  userData = Object.assign(userData, data);
  // console.log(userData);
}

function rewriteData(node, data) {

  firebase.database().ref(`posts/${postID}/${node}`).set(data);

}
