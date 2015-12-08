// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
.factory('gservice', function($rootScope, $http){

	// Initialize Variables
	// -------------------------------------------------------------
	// Service our factory will return
	var googleMapService = {},
	map;

	// Array of locations obtained from API calls
	var locations = [];
	var lastMarker;
	var currentSelectedMarker;
	// Selected Location (initialize to center of America)
	var selectedLat = -9.7213276;
	var selectedLong = -36.4111439;
	googleMapService.clickLat  = 0;
	googleMapService.clickLong = 0;
	googleMapService.address = undefined;
	// Functions
	// --------------------------------------------------------------
	// Refresh the Map with new data. Function will take new latitude and longitude coordinates.
	googleMapService.refresh = function(latitude, longitude){
		// Clears the holding array of locations
		locations = [];

		// Set the selected lat and long equal to the ones provided on the refresh() call
		selectedLat = latitude;
		selectedLong = longitude;

		// Perform an AJAX call to get all of the records in the db.
		$http.get('/api/users').success(function(response){

			// Convert the results into Google Map Format
			locations = convertToMapPoints(response);

			// Then initialize the map.
			initialize(latitude, longitude);
		}).error(function(){});
	};

	// Private Inner Functions
	// --------------------------------------------------------------
	// Convert a JSON of users into map points
	var convertToMapPoints = function(response){

		// Clear the locations holder
		var locations = [];

		// Loop through all of the JSON entries provided in the response
		for(var i= 0; i < response.length; i++) {
			var user = response[i];

			// Create popup windows for each record
			var  contentString =
			'<p><b>Username</b>: ' + user.username +
			'<br><b>Education</b>: ' + user.education +
			'<br><b>Gender</b>: ' + user.gender +
			'</p>';

			// Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
			locations.push({
				latlon: new google.maps.LatLng(user.location[1], user.location[0]),
				message: new google.maps.InfoWindow({
					content: contentString,
					maxWidth: 320
				}),
				username: user.username,
				gender: user.gender,
				education: user.education,
			});
		}
		// location is now an array populated with records in Google Maps format
		return locations;
	};

	// Initializes the map
	var initialize = function(latitude, longitude) {

		// Uses the selected lat, long as starting point
		var myLatLng = {lat: selectedLat, lng: selectedLong};

		// If map has not been created already...
		if (!map) {
			// Create a new map and place in the index.html page
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: 9,
				minZoom: 7,
				mapTypeControl: false,
				streetViewControl: false,
				zoomControl: false,
				center: myLatLng
			});
		}

		// Loop through each location in the array and place a marker
		locations.forEach(function(n, i) {
			var marker = new google.maps.Marker({
				position: n.latlon,
				map: map,
				title: n.username,
				icon: 'https://www.google.com/maps/vt/icon/name=assets/icons/spotlight/spotlight_poi-1-small.png&color=ff000000?scale=1',
			});

			// For each marker created, add a listener that checks for clicks
			google.maps.event.addListener(marker, 'click', function(e) {
				// When clicked, open the selected marker's message
				if(currentSelectedMarker) {
					currentSelectedMarker.message.close();
				}
				//lastMsg = n;
				currentSelectedMarker = n;
				n.message.open(map, marker);
			});
		});

		// Function for moving to a selected location
		map.panTo(new google.maps.LatLng(latitude, longitude));
		//selectLocation();
	};

	googleMapService.selectLocation = function() {
		google.maps.event.addListener(map, 'click', function(e) {
			map.panTo(e.latLng);
			googleMapService.clickLat = e.latLng.lat();
			googleMapService.clickLong = e.latLng.lng();
			getCityName(e.latLng);
			$('#modal1').openModal();
			google.maps.event.clearListeners(map, 'click');
			$("#locationLabel").addClass("active");
		});
	};

	var getCityName = function(latlng) {
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					//formatted address
					googleMapService.address = results[0].formatted_address;
					$rootScope.$broadcast("clicked");
					console.log(googleMapService.address);
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		});
	};

	// Refresh the page upon window load. Use the initial latitude and longitude
	google.maps.event.addDomListener(window, 'load',
	googleMapService.refresh(selectedLat, selectedLong));

	return googleMapService;
});
