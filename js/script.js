var $body = $('body');
   var $wikiElem = $('#wikipedia-links');
   var $wikiHeader = $('#wikipedia-header');
   var $nytHeaderElem = $('#nytimes-header');
   var $nytElem = $('#nytimes-articles');
   var $greeting = $('#greeting');
   var $error1 = $('#error1'); 

$( document ).ready(function() {
   $wikiElem.text("");
   $nytElem.text("");
    });
	
function loadData(){
   var streetStr = $('#street').val();
   var cityStr = $('#city').val();
   var address = streetStr + ', ' + cityStr;
   $greeting.text('So, you want to live at ' + address + '?');
   var temp = getData(streetStr, cityStr);
   if(temp.errorValue == true){
	   console.log(temp.errorMessage);
      $error1.text("Fields cannot be empty");
   }
   
   
   
}

function getData(streetField, cityField){
		if(streetField.length == 0 || cityField.length == 0)
		{
			return {
				errorValue: true,
				errorMessage: "Pola nie mogą być puste"
			};
		}
		else
		{

			$body.css("background-image", "url('"+ getGoogleData(streetField+', '+cityField)+"')");
			$body.css("background-repeat", "no-repeat");
			$body.css("background-size", "cover");
			
			getWikiData(cityField);
			getNyTData(cityField);

			return{
				errorValue: false,
			};
			
		}
	
}

function getGoogleData(adress){
	return 'https://maps.googleapis.com/maps/api/streetview?size=600x400&key=AIzaSyDpFmKn0ixCuDZQ2m8wLrp0Az0TWZlgyr4&location=' + adress + '';
	
}
function getWikiData(city){
	var url = "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&format=json"+"&search="+city;
	
		
         $.ajax({
            url: url,
           data: 'query',
           dataType: 'json',
           type: 'POST',
           headers: { 'Api-User-Agent': 'Example/1.0' },
           origin: 'https://jsfiddle.net/',


           success: function (data) {  
                links = data[1];
				wikiCallback(false, links);
		   },
			error: function(data){
				wikiCallback(true,data);
			}
            });
			
}

function getNyTData(city){
	
	$.ajax({
         'type': 'GET',
         'url': 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
         data:{
            'q': city,
            'response-format': "jsonp",
            'api-key': '4985d80ad9234d0ea918b29c236b8b58',
            'callback': 'svc_search_v2_articlesearch'
            },
            success: function(data){
               nytCallback(false, data.response.docs, city);
            },
			error: function(data){
				nytCallback(true,data);
			}
			
       });
	   
}
function wikiCallback(error,data, city){
	if(error == true){
       $error1.text("wikipedia connection error");
	}
	else{
		
               for (var i = 0; i < data.length; i++) 
                   {
                       articleStr = data[i];
                       var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                       $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');

                   }
               

                   
	}
}

function nytCallback(error,data){
	if(error == true){
       $error1.text("New York Times connection error");
	}
	else{
		$nytHeaderElem.text('New York Times Articles about ' + city);
		for (var i = 0; i < 5; i++) 
                   {
                       var article = data[i];
                       $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+ '<p>' + article.snippet + '</p>'+ '</li>');             
                   }
	}
}
