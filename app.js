//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

require("dotenv").config();

const homeStartingContent = "This is the BlogWebsite, where you can read and write a blog. For writng a blog just add '/compose' to the url of the website ans press enter.";
const aboutContent = "This website is made for sharing intresting things with friends. Just for Fun.";
const contactContent = "contact me at nobodysfav123@gmail.com.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




mongoose.connect(process.env.MONGO_URI);
const postSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);




app.get("/", function(req, res){

  Post.find({}, function(err, posts){

    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });

  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  
  });
app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
