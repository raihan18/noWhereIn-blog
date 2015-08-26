/**
 * Created by Raihan on 8/17/2015.
 */

var blog = angular.module("myBlog", []);

blog.controller("postBlogCtrl", function ($http) {
    var app = this;

    $http.get("http://localhost:8080/postmyblog").success(function (user) {
        console.log(user.local.email);
        app.usermail = user.local.email;
        app.userid = user._id;
    });
});
