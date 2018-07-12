var mongoose=require('mongoose');
var Bookshelf=require("./models/bookshelf");
var Comment=require("./models/comment");
var data=[
{
title:"Think And Grow Rich",
image:"https://images-na.ssl-images-amazon.com/images/I/517n0Q3oWmL._SX331_BO1,204,203,200_.jpg",
description:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
},
{
title:"Think And Grow Rich",
image:"https://images-na.ssl-images-amazon.com/images/I/517n0Q3oWmL._SX331_BO1,204,203,200_.jpg",
description:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
},
{
title:"Think And Grow Rich",
image:"https://images-na.ssl-images-amazon.com/images/I/517n0Q3oWmL._SX331_BO1,204,203,200_.jpg",
description:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
}
]


function seedDB(){
Bookshelf.remove({},function(err){
	if(err){
console.log(err);
	}else{
console.log("Removed from database");
data.forEach(function(seed){
	Bookshelf.create(seed,function(err,bookshelf){ //ye wala bookshelf niche use hua hai push karne k liye
		if(err){
        console.log(err);
		}else{
        console.log("Add hogya bhai")
        Comment.create(
         {
         	text:"thats a realy nice book",
            author:"Homer"
         },function(err,comment){
         	if(err){
            console.log(err);
         	}else{
               bookshelf.comments.push(comment);//isme bookshelf wo hai jo upar create hua 
               bookshelf.save();
               console.log("Comment is added");
         	}
         }
        	)
		}
	});
});

}
});	
}





module.exports=seedDB;