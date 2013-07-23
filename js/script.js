// Yo dawg, if not be using dem cookies ya gonna have a bad time
document.cookie = "TemporaryTestCookie=yes;";
if(document.cookie.indexOf("TemporaryTestCookie=") == -1) {
alert("Cookies are not enabled. Please enable them and reload the page.");
// Fo real doe, turn em on
$('body').append('Cookies are not enabled. Please enable them and reload the page.');
}

// were ya here befo'? Nah? well now ya have been.
var firstVisit = false;
allEvents = null;


// Using Zepto, it tryin' to be jQuery but it ain't as fat
Zepto(function($){
	firstVisit = localStorage.getItem('firstVisit');
	
	
	eventCache = localStorage.getItem('eventCache');
	localVersion = localStorage.getItem('localVersion');
	if (localVersion === null) {localStorage.setItem('localVersion', 0);}

	if (eventCache == null || (localVersion < dataVersion)) {
		localStorage.setItem('localVersion', dataVersion);
		console.log("No cache or old cache of events...pulling events from JSON.");
		// Yo homie, we need to pull new data in from an updated JSON file.
	} else {
		allEvents = JSON.parse(eventCache);
		// Pull dat ish from da cache and use it instead of loading the file again. Offline mode FTW.
	}
});

// HIDE YO KIDS, HIDE YO WIFE, HIDE YO ADDRESS BAR
function hideAddressBar() {
  if(!window.location.hash)
  {
      if(document.height < window.outerHeight)
      {
          document.body.style.height = (window.outerHeight + 50) + 'px';
      }

      setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
  }
}

window.addEventListener("load", function(){ if(!window.pageYOffset){ hideAddressBar(); } } );
window.addEventListener("orientationchange", hideAddressBar );


// Dis be cray, we take some big a** numbas and turn dat into a MAP
function initializeMap(coordinates) {
	var lat = coordinates[0];
	var lng = coordinates[1];
	
	if (lat != 'void') {
		$('#map').html('<a href="http://maps.google.com/?q=' + lat + ',' + lng + '"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=18&size=596x360&key=AIzaSyBOHWYmTdh0jXf_Ss8iYltBzl1N4ZW4aDc&sensor=false&markers=color=0xBE102E|' + lat + ',' + lng + '" /></a>');
	} else {
		$('#map').remove();
	}
}

// Returns the value of the 'date' URL paramater
function getURLDate() {
	if (getUrlVars()['date'] == undefined) {
		console.log("Captain, we have a problem. We need a date to load data for that day.")
		// Rather this should return the first day if no date is found. 
		// This would be when they go to cmuorientation.com for the first time.
		// Also we want to make sure that it isn't a static page 
		// i.e. cmuorientation.com/?page=static_page_name **won't exist for first pass**
	} 
    return getUrlVars()["date"];
}

// Returns the day of the week of a date
function getDayOfDate(date) {
	// *** This needs way overhauled. 
	// *** Shouldn't really need it actually. Use date obj. from event and get day.
	switch(date) {
		case 18:
			return "Thursday";
		case 19:
			return "Friday";
		case 20:
			return "Saturday";
		case 21:
			return "Sunday";
		default:
			return "Thursday";
	}
}

// It be like da current date right here
function getDate() {
	var d = new Date();
	return d.getDate();
}


// MAIN EVENT LIST PAGE
function getEvents() {
	var requestedDay = parseInt(getURLDate());
	
	// This line will be replaced because we will be dealing with a real date object.
	var dayOfWeek = getDayOfDate(requestedDay);
	
	// We need to make sure we make these buttons the same way as they are being toggled.
	$('#' + requestedDay + 'btn').toggleClass('active');

	// See this *items* var below? yeah? well its about get RULL serious up in here.
	var items = [];
	var laterTodayDividerShown = false;

	// If today is the day they want to see events for
	if (requestedDay == (new Date().getDate())) {
		// then we will show the section divider for what is going on right now.
		items.push("<section class='divider'>Happening Now</section>");
	} else { 
		items.push("<section class='divider'>Happening " + dayOfWeek + "</section>");
	}
 	items.push("<ul>");


 	// Burg, trust me, you don't want to read the next ~70 lines. But really, you don't need to. 
 	// Just know this. We take allEvents and iterate over them to make the list view.
	var numEvents = allEvents.length;
	for (var i=0; i<numEvents; i++) {
		// Check if the event is for the requested day
		if (parseInt(new Date(allEvents[i].startTime).getDate()) == requestedDay) {
			// Check if the event is for today and that it hasn't already occurred
			if (requestedDay == (new Date().getDate())) { 
				if (new Date(allEvents[i].endTime) >= (new Date())) {
					// Show the "Happening Later Today" divider if needed
					if (new Date(allEvents[i].startTime) >= (new Date())) {
						if (laterTodayDividerShown == false) {
							items.push("<section class='divider'>Happening Later</section>");
							laterTodayDividerShown = true;
						}
					}
					items.push("<a href='detail.html?event=" + allEvents[i]['id'] + "'><li>");
			  		items.push("<div class='info'><h3>" + allEvents[i]['name'] + "</h3>");
			  		if (allEvents[i]['location'] != null) {
			  			items.push("<h4 class='location'>" + allEvents[i]['location'] + "</h4>");
			  		} else {
			  			items.push("<h4 class='location'>See Details</h4>");
			  		}
			  		items.push("<h4 class='time'>" + formatDate(new Date(allEvents[i]['startTime']))); 
			  		if (allEvents[i]['endTime'] != "") {
			  			items.push(' - ' + formatDate(new Date(allEvents[i]['endTime'])) );
			  		}
			  		items.push("</h4></div>");
					items.push("<div class='detailArrow'><img src='img/disclosure.png' height='22px' width='22px' /></div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​");
					if (allEvents[i]['important'] == true) {
						items.push("<div class='importantIcon'><img src='img/important.png' height='22px' width='22px' /></div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​");
					}
					if (allEvents[i]['ticketRequired'] == true) {
						items.push("<div class='importantIcon'><img src='img/ticket.png' height='22px' width='22px' /></div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​");
					}
					items.push("</li></a>");
				}
			} else {
				items.push("<a href='detail.html?event=" + allEvents[i]['objectId'] + "'><li>");
		  		items.push("<div class='info'><h3>" + allEvents[i]['Name'] + "</h3>");
		  		if (allEvents[i]['locationName'] != null) {
		  			items.push("<h4 class='location'>" + allEvents[i]['locationName'] + "</h4>");
		  		} else {
		  			items.push("<h4 class='location'>See Details</h4>");
		  		}
		  		items.push("<h4 class='time'>" + formatDate(new Date(allEvents[i]['startTime']))); 
		  		if (allEvents[i]['endTime'] != "") {
		  			items.push(' - ' + formatDate(new Date(allEvents[i]['endTime'])) );
		  		}
		  		items.push("</h4></div>");
				items.push("<div class='detailArrow'><img src='img/disclosure.png' height='22px' width='22px' /></div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​");
				if (allEvents[i]['important'] == true) {
					items.push("<div class='importantIcon'><img src='img/important.png' height='22px' width='22px' /></div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​");
				}
				if (allEvents[i]['ticketRequired'] == true) {
					items.push("<div class='importantIcon'><img src='img/ticket.png' height='22px' width='22px' /></div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​");
				}
				items.push("</li></a>");
			}
		}
	}

	items.push("</ul>");
	$('#schedule').html(items.join(''));
	hideAddressBar();
}

// EVENT DETAIL PAGE
function getEventDetail() {
	eventID = getUrlVars()["event"];
	data = null;

	for (var i=0;i<allEvents.length;i++) {
		if (data == null && allEvents[i]['id'] == eventID.toString()) {
			data = allEvents[i];
			break;
		}
	}

	var items = [];
		
	items.push("<li id='first'>" + data['name'] + "</li>");
	items.push("<li>" + data['location'] + "</li>");
	items.push("<li>" + formatDate(new Date(data['startTime'])));

	if (data['endTime'] != "") {
	 	items.push(' - ' + formatDate(new Date(data['endTime'])));	
	}

	items.push('</li>');
	if (data['prereg']) {
		items.push("<li><img src='img/ticket.png' width='25' height='25' style='width:25px;height:25px;border-radius:none;-webkit-box-shadow:none;margin-right:10px;' /> Ticket or pre-registration required for this event.</li>");
	}

	items.push("<li id='last'>" + data['description'] + "</li>");
	$('#info').append(items.join(''));
	initializeMap([data['latitude'], data['longitude']]);
}

// grabs GET vars call by getUrlVars()['objectName']
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Converts 24 hour time to 12 hour
function formatDate(date) {
	date = date.toString();
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh-12;
        dd = "PM";
    }
    else {
    	h = hh;
    }
    if (h == 0) {
        h = 12;
    }
    m = m<10?"0"+m:m;
    s = s<10?"0"+s:s;

    var pattern = new RegExp("0?"+hh+":"+m+":"+s);
    var replacement = h+":"+m;
    replacement += " "+dd;    

    d = date.replace(pattern,replacement);
    return d.slice(15,24);
}

var liveApp = true;

// So this requires some server to cache the latest tweet, which is what our Django install is doing.
// We can probably use this for this years orientationapp but I would like to find a way of doing this
// that doesn't require my server.
function getLatestTweet() {
	var tweet = [];	
			
	$.getJSON('http://cmuorientation.com/twitter/',
		function(data) {
			tweet.push("<p>"+replaceURLWithHTMLLinks(data[0]['text'].toString())+"</p>");
			tweet.push('<a href="http://www.twitter.com/cmucarnival"><img width="136" height="20" src="img/twitter.png" /></a>');
			
			!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
						
			$('#twitterTweet').append(tweet.join(''));
	});
				
}
function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    stepOne = text.replace(exp,"<a href='$1'>$1</a>"); 
    return stepOne.replace(/@[\d\D]+\b/g, '<a href="http://www.twitter.com/$&">$&</a>');
}
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
// KTHXBAI