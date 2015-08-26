/**
 * Created by Raihan on 8/14/2015.
 */
// app/models/posts.js
// load the things we need
var mongoose = require('mongoose');
// methods ======================
// create the model for users and expose it to our app
module.exports = mongoose.model('Post', {
    author  :   String,
    title   :   String,
    body    :   String,
    comments    : [{
        person  : '',
        comment : '',
        posted_at   : {type: Date, default: Date.now}
    }],
    upvotes :   Number,
    posted_at   : {type: Date, default: Date.now }
});

//var post = new Post({
//    author: "javed.mota",
//    title: "mota der golpo 2",
//    body: "ami mota. ami chorbi. ami vuri, ami facha.ami mota. ami chorbi. ami vuri, ami facha."
//})
//
//post.save(function(err) {
//    if(err) {
//        console.log("failed");
//    }
//    else {
//        console.log("saved");
//    }
//})