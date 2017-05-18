var $body = $('body');
var $wikiElem = $('#wikipedia-links');
var $wikiHeader = $('#wikipedia-header');
var $nytHeaderElem = $('#nytimes-header');
var $nytElem = $('#nytimes-articles');
var $greeting = $('#greeting');
var $error1 = $('#error1'); 


$(document).ready(function() {
	$wikiElem.text("");
	$nytElem.text("");
});

function loadData(){
	var streetStr = $('#street').val();
	var cityStr = $('#city').val();
	var address = streetStr + ', ' + cityStr;
	
	if(streetStr.length == 0 || cityStr.length == 0){
		$error1.text("Fields cannot be empty");
	}
	else
	{
		$greeting.text('So, you want to live at ' + address + '?');
		getGoogleData(address);
		getData(cityStr);
	}
}

function getGoogleData(adress){
	var link = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&key=AIzaSyDpFmKn0ixCuDZQ2m8wLrp0Az0TWZlgyr4&location=' + adress + '';
	$body.css("background-image", "url('"+ link +"')");
}

var fetchData = function(query, dataUrl){
	return $.ajax({
		url: dataUrl,
		data: query,
		dataType: 'json',
	});
}

function getData(city){
var getWiki = fetchData(
	{
		'search':city,
		'origin':'*',
		'action':'opensearch',
		'format':'json',
	}, 'https://en.wikipedia.org/w/api.php'),
	getNYT = fetchData(
	{
		'q': city,
		'api-key': '4985d80ad9234d0ea918b29c236b8b58',
	}, 'https://api.nytimes.com/svc/search/v2/articlesearch.json');	
	
	$.when(getWiki,getNYT).done(function(wikiData,nytData){
		var temp = wikiData[0];
		temp = temp[1];
		for (var i = 0; i < temp.length; i++) 
		{
			articleStr = temp[i];
			var url = 'http://en.wikipedia.org/wiki/' + articleStr;
			$wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
		}
		
		temp = nytData[0];
		temp = temp.response.docs;
		$nytHeaderElem.text('New York Times Articles about ' + city);
		for (var i = 0; i < 5; i++) 
		{
			var article = temp[i];
			$nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+ '<p>' + article.snippet + '</p>'+ '</li>');             
		}
	});
	
	$.when(getWiki).fail(function(Data){
		$error1.text("wikipedia connection error");
	});
	$.when(getNYT).fail(function(Data){
		$error1.text("New York Times connection error");
	});
}	
