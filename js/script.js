function loadData(){
   var $body = $('body');
   var $wikiElem = $('#wikipedia-links');
   var $wikiHeader = $('#wikipedia-header');
   var $nytHeaderElem = $('#nytimes-header');
   var $nytElem = $('#nytimes-articles');
   var $greeting = $('#greeting');
   
   $wikiElem.text("");
   $nytElem.text("");
   
   var streetStr = $('#street').val();
   var cityStr = $('#city').val();
   var address = streetStr + ', ' + cityStr;
   
   $greeting.text('So, you want to live at ' + address + '?');
   
   var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

   var bodyBack = document.getElementsByTagName("BODY")[0];
   
   bodyBack.style.backgroundImage = "url('" + streetviewUrl + "')";
   bodyBack.style.backgroundRepeat = "no-repeat";
   bodyBack.style.backgroundSize = "cover";
   
   $.ajax({
      'type': 'GET',
      'url': 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
      data:{
         'q': cityStr,
         'response-format': "jsonp",
         'api-key': '4985d80ad9234d0ea918b29c236b8b58',
         'callback': 'svc_search_v2_articlesearch'
         },
         success: function(data){
            $nytHeaderElem.text('New York Times Articles about ' + cityStr);
			console.log(data);
            articles = data.response.docs;
				
				for (var i = 0; i < 5; i++) 
				{
					var article = articles[i];
					$nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+ '<p>' + article.snippet + '</p>'+ '</li>');             
				}
		}
	});
	
   var url = "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&format=json"+"&search="+cityStr;

	
      $.ajax({
         url: url,
        data: 'query',
        dataType: 'json',
        type: 'POST',
        headers: { 'Api-User-Agent': 'Example/1.0' },
        origin: 'https://jsfiddle.net/',


        success: function (data) {
            console.log(data);
            var links = data[1];
            for (var i = 0; i < links.length; i++) 
				{
					articleStr = links[i];
					var url = 'http://en.wikipedia.org/wiki/' + articleStr;
					$wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
					
				}
                        
                    }});
}
