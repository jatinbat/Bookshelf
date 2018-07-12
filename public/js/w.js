var x=document.querySelector("button");
x.style.margin="0 auto"; 

var cycle = 0;
var allBackgrounds = [
"http://eskipaper.com/images/book-wallpaper-6.jpg",
"http://celebwallpapers.net/wp-content/uploads/2017/12/books-wallpaper-desktop-book-hd-wallpapers-of-books-wallpaper.jpg",
//"https://wallpaperstudio10.com/static/wpdb/wallpapers/1920x1080/172205.jpg",
"https://www.wallpaperflare.com/static/188/439/753/redhead-reading-books-introvert-wallpaper.jpg",
//"https://livewallpaper.info/wp-content/uploads/2016/11/books-wallpaper-HD-Download3.jpg"
]
 
setInterval(function() {
	if (cycle < 3) {
		document.body.style.backgroundImage = "url('" + allBackgrounds[cycle] + "')";
		cycle += 1;
	} else { 
		cycle = 0;
	}
}, 1500);
