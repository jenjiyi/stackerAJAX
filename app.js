$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
		//clear out results if previous search ran
		$('.results').html('');
		//get the value of the tag that user submitted into top answerers
		var aTags = $(this).find("input[name='answerers']").val();
		getInspired(aTags);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

// this function takes the topanswerers object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(topanswerers) {
	
	// clone our result template code
	var result = $('.templates .topanswerers').clone();
	
	// Set the answerers properties in result
	var answererElem = result.find('.answerers-name a');
	answererElem.attr('href', topanswerers.user.link);
	answererElem.text(topanswerers.user.display_name);
	answererElem.append("<br><img src='"+topanswerers.user.profile_image+"' alt='"+topanswerers.user.display_name+"' profile image'>");

	// set some properties related to reputation
	var profile = result.find('.profile');
	profile.html('<p>Profile URL: <a target="_blank" href=http://stackoverflow.com/users/' + topanswerers.user.user_id + ' >http://stackoverflow.com/users/' + topanswerers.user.user_id  + 
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + topanswerers.user.reputation + '</p>' +
 							'<p>Accept Rate: ' + topanswerers.user.accept_rate + '</p>'
	);

	return result;
};
// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var getInspired = function(aTags){
	console.log("ran get inspired ")
	//parameters for stackoverflow api request
		var request = {tag: aTags,
								site: 'stackoverflow',
								period: 'all_time'};
	//$.ajax{}
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + request.tag + "/top-answerers/" + request.period,
		data: request,
		dataType: "jsonp",
		type: "GET",
		})

	//.done
		.done(function(result){
		var searchResults = showSearchResults(request.tag, result.items.length);	
		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var topanswerers = showAnswerer(item);
			$('.results').append(topanswerers);
		});  
	})

	//.fail
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
}
