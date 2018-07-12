var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var flash=require('connect-flash');
var LocalStrategy=require('passport-local')
var Bookshelf=require("./models/bookshelf");
var Comment=require("./models/comment");
var User=require('./models/user');
var seedDB=require("./seeds");
var methodOverride=require('method-override');



mongoose.connect("mongodb://dheer1206:dheer123@ds235411.mlab.com:35411/book_shelf" , () => {
	console.log("Db connected") ;
});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));//convention to use method.
app.use(flash());
//seedDB();
//passport configuration
app.use(require('express-session')({
secret: "Bleed until i own this dream",
resave:false,
saveUninitialized:false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.errorr=req.flash("errorr");
	res.locals.success=req.flash("success");
	next();//the current logged in user is made available to all the templates 
})

app.get("/",function(req,res){
	res.render("landing");
})


app.get("/books",function(req,res){
	//get all books from db
	Bookshelf.find({},function(err,allbooks){
		if(err){
			console.log(err);
		}else{
			res.render("bookshelf/index",{books:allbooks,currentUser:req.user});
		}
	})
	
})
app.post("/books",isLoggedIn,function(req,res){
	//get data from form and add to array and then redirect to collections.
	var title=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newBook={title:title,image:image,description:desc,author:author};
	//create a book and save to db
	Bookshelf.create(newBook,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/books");
		}
	})
	
})
app.get("/books/new",isLoggedIn,function(req,res){
	res.render("bookshelf/new");
})
app.get("/books/:id",function(req,res){
	//find book with provided id
	Bookshelf.findById(req.params.id).populate("comments").exec(function(err,foundBook){
		if(err){
         console.log(err);
		}else{
			console.log(foundBook);
         res.render("bookshelf/show",{book:foundBook});
		}

	})
})

/////=======edit route========================================================================
app.get("/books/:id/edit",checkOwnership,function(req,res){
	   //check if user is logeed in
	Bookshelf.findById(req.params.id,function(err,foundBook){
		 //check if user owns the book post
		    res.render('bookshelf/edit',{book:foundBook});		
	});
			
});


app.put("/books/:id",checkOwnership,function(req,res){
	Bookshelf.findByIdAndUpdate(req.params.id,req.body.book,function(err,updatedBook){
		if(err){
             res.redirect("/books");
		}else{
              res.redirect("/books/" + req.params.id);
		}
	})
})
//==================================================================================
//delete route

app.delete("/books/:id",checkOwnership,function(req,res){
	Bookshelf.findByIdAndRemove(req.params.id,function(err){
		if(err){
              res.redirect("/books");
		}else{
             res.redirect("/books");
		}
	})
})





app.get("/books/:id/comments/new",isLoggedIn,function(req,res){
	Bookshelf.findById(req.params.id,function(err,book){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{book:book});
		}
	})
	
})
app.post("/books/:id/comments",isLoggedIn,function(req,res){
	Bookshelf.findById(req.params.id,function(err,book){
		if(err){
			console.log(err);
			res.redirect("/books");
		}else{
           Comment.create(req.body.comment,function(err,comment){
           	if(err){
           		req.flash("errorr","Something Went Wrong !");
           		console.log(err);
           	}else{
           		//add username and id to comment
           		comment.author.id=req.user._id;
           		comment.author.username=req.user.username;
           		comment.save();
           		book.comments.push(comment);
           		book.save();
           		req.flash("success","Comment Added Successfully");
           		res.redirect("/books/" + book._id);
           	}
           })   
  
		}
	})
})
app.get("/books/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
		  res.render("comments/edit",{book_id:req.params.id,comment:foundComment})	
		}
	})
	//passing book to edit comment 
})
app.put("/books/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/books/" + req.params.id);
		}
	})

})

app.delete("/books/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
              res.redirect("back");
		}else{
			req.flash("success","Comment Deleted Successfully");
             res.redirect("/books/" + req.params.id);
		}
	})
})





app.get("/register",function(req,res){
	res.render("register");
})
app.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("errorr",err.message);
			return res.render("register");
		}
             passport.authenticate("local")(req,res,function(){
             	req.flash("success","Welcome to Bookshelf " + user.username);
             	res.redirect("/books");
             });
		
	});
});

app.get("/login",function(req,res){
	res.render("login");
})
app.post("/login",passport.authenticate("local",    //app.post("/login",middleware,callback)
{
	successRedirect:"/books",
	failureRedirect:"/login"
}),function(req,res){    
});
app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/books");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("errorr","You need to be Logged In to do that");
	res.redirect("/login");
}


function checkOwnership(req,res,next){
	if(req.isAuthenticated()){   //check if user is logeed in
	Bookshelf.findById(req.params.id,function(err,foundBook){
		if(err){
			req.flash("errorr","Not Found");
         res.redirect("back");
		}else{
			if(foundBook.author.id.equals(req.user.id)){ //check if user owns the book post
		    next();		
			}else{
				req.flash("errorr","You don't have permission to do that");
				res.redirect("back");
			}
	    		
		}
	})
	
}else{
	req.flash("errorr","You need to be Logged In to do that");
	res.redirect("back");//wil take user back to previous page
}
}


function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){   //check if user is logeed in
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
         res.redirect("back");
		}else{
			if(foundComment.author.id.equals(req.user.id)){ //check if user owns the book post
		    next();		
			}else{
				req.flash("errorr","You don't have permission to do that");
				res.redirect("back");
			}
	    		
		}
	})
	
}else{
	req.flash("errorr","You need to be Logged In to do that");
	res.redirect("back");//wil take user back to previous page
}
}

// ========================================================
let port = process.env.PORT || 9000 ;
app.listen(port,function(){
	console.log("BookShelf Server is Running");
})