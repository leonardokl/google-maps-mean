// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Functions
    // ----------------------------------------------------------------------------
	$rootScope.$on("clicked", function(){

		// Run the gservice functions associated with identifying coordinates
		$scope.$apply(function(){
			lat = parseFloat(gservice.clickLat).toFixed(3);
			long = parseFloat(gservice.clickLong).toFixed(3);
			$scope.formData.location = gservice.address;
		});
	});
    // Creates a new user based on the form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            education: $scope.formData.education,
            campus: $scope.formData.campus,
            //location: [$scope.formData.longitude, $scope.formData.latitude]
			address: $scope.formData.location,
			location: [long, lat]
        };

        // Saves the user data to the db
        $http.post('/api/users', userData)
            .success(function (data) {
                // Once complete, clear the form (except location)
                cleanForm();
				gservice.refresh(lat, long);
				$('#modal1').closeModal();
				Materialize.toast('User created!', 4000);
            })
            .error(function (data) {
				Materialize.toast('There is something wrong : (', 4000);
                console.error('Error: ' + data);
            });
    };

	$scope.selectLocation = function() {
		$('#modal1').closeModal();
		Materialize.toast('Select the location', 4000);
		gservice.selectLocation();
	}

	var cleanForm = function() {
		$scope.formData.username = "";
		$scope.formData.gender = "";
		$scope.formData.campus = "";
		$scope.formData.education = "";
		$scope.formData.location = "";
		$("#usernameLabel").removeClass();
		$("#username").removeClass();
		$("#campusLabel").removeClass();
		$("#campus").removeClass();
		$("#educationLabel").removeClass();
		$("#education").removeClass();
		$("#locationLabel").removeClass();
		$("#usernameLabel").removeClass();
	};
});
