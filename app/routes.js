/**
 * Created by Raihan on 8/14/2015.
 */
// app/routes.js
var Post = require("./models/posts");
var User = require("./models/user");
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            user :  req.user
        }); // load the index.ejs file
    });

    // test purpose!
    app.get('/getallblogs', function(req, res) {
        Post.find(function(err, posts) {
            res.send(posts);
        });
    });
//////////////////////////////////////MY BLOG PAGE & DATA SERVING FUNCTIONS/////////////////////////////////////////////
    app.get('/myblog', isLoggedIn, function(req, res) {
//        var user = req.user.local.email;
//        res.send(user);
        res.render('myblog.ejs',{
            user : req.user.local.email // get the user out of session and pass to template
        });
    });

    app.post("/postmyblog", function(req, res){
        var author = req.body.author;
        var title = req.body.title;
        var postbody = req.body.postbody;
        var blog = new Post({
            author:author,
            title:title,
            body:postbody
        });
        blog.save(function(err){
            res.send();
        });
    });

    app.get('/getmyblogs/:userid', function(req, res) {
        var userid = req.params.userid;
        Post.find({author:userid},function(err, posts) {
            res.send(posts);
        });
    });
    // data from the database
    app.get('/getmyprofile', function(req, res) {
        res.send(req.user);
    })
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////POST DETAILS FUNCTION////////////////////////////////////////////////////////////
    app.get('/post/user/:id', function(req, res){
        var post_id = req.params.id;
        var user = req.user;
        Post.findOne({_id:post_id}, function(err, post) {
            res.render('postdetails.ejs',{
                user : user,
                postone : post // get the user out of session and pass to template
            });
        });
    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////POST COMMENT FUNCTION/////////////////////////////////////////////////////////////
    app.post('/postcomment', function(req, res) {
        var postidentity = req.body.identity;
        var person = req.body.person;
        var commented = req.body.commenting;
        var comment = {
            person  :   person,
            comment :   commented
        };
        console.log(postidentity);
        console.log(person);
        console.log(comment);
        Post.findOneAndUpdate(
            {_id:postidentity},
            {$push  :{comments:comment}},
            {safe   : true, upsert  : true},
            function(err, post){
                res.send();
            }
        )
    })

    app.get('/post/getcomments/:id', function(req, res) {
        var id = req.params.id;
        Post.findOne({_id:id}, function(err, post) {
            res.send(post.comments);
        });
    })
//    app.post('/postcomment', function(req,res) {
//        var postidentity = req.body.identity;
//        var person = req.body.person;
//        var comment = req.body.commenting;
//        Post.findOne({_id:postidentity}, function(err, post){
//            console.log('found!');
//            var comment=  {
//                person  :   person,
//                comment :   comment
//            }
//            post.comments.push({person:person, comment:comment});
//            console.log('pushed comment');
//            post.save(function(err) {
//                res.send(post);
//            })
//        })
//        console.log('done');
//    })
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////USER BLOG/////////////////////////////////////////////////////////////////////////
//    app.get('/userblog', function(req, res) {
//        res.render('userblog.ejs');
//    })

    app.get('/userprofile/:userid', function(req, res) {
        var userid = req.params.userid;
        var user = req.user;
        Post.find({author : userid}, function(err, posts) {
//            res.send(posts);
            res.render('userblog.ejs', {
                user  : user,
                userid: userid,
                posts:posts
            });
        })
//            res.send(user);
    })

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // =====================================
    // LOGIN ===============================
    // ====================================
    // =
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            user:req.user, message: req.flash('loginMessage')
        });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { user:req.user, message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // About Section =====================
    // =====================================
    app.get('/about', function(req, res) {
        res.render('about.ejs', {
            user    :   req.user
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}