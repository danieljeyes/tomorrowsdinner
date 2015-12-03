// ------------- menu section ------------------//

var app = angular.module('menuStore', ['uiGmapgoogle-maps', 'ngRoute', 'toastr', 'compareTo', 'angular.filter', 'ngFileUpload', 'Firestitch.angular-counter']);

app.controller('sessionController', ['$scope', '$log', '$timeout', '$http', function ($scope, $log, $timeout, $http) {

      $scope.email = "";
      $scope.pwd = "";
      $scope.loggedIn = false;
      $scope.loggingIn = false;
      $scope.topbar = false;

      $scope.showLogin = function () {
          $scope.loggingIn = true;
      };

      $scope.logout = function () {
          // do your logout logic
          $scope.user = null;
          $scope.loggedIn = false;
  				window.location = '/logout';
      };

      $scope.login = function () {
          // do your login logic
          $scope.loggingIn = false;
          $scope.loggedIn = true;
      };

  $scope.checkSession = function () {
    $scope.headerpadding = '0px';

    // lets see if the user is logged in
    $http.get('/user/me').success(function(data){
        $scope.headerpadding = '50px'
        $scope.isUserLoggedIn = true;
        $scope.userID = data;
        $log.info($scope.userID);
        $scope.navCheck();
       }).error(function(data, status) {
         $scope.userLevel = 'public';
         $scope.isUserLoggedIn = false;
         $scope.navCheck();
       }).then(function(data){
       })
       //enable the top bar on the website
  }
     $scope.navCheck = function () {
   // lets see if we have a user session

     if($scope.isUserLoggedIn === true) {
       $http.get('/user/'+ $scope.userID + '/role/cook/').success(function(data){
             if(data.roles[0]) {
               $scope.userLevel = 'cook';
               $scope.topbar = true;
               $scope.loggedinUser = data;
               $log.info($scope.loggedinUser.lname);
             } else {
               $scope.userLevel = 'registered';
               $scope.topbar = true;
               $scope.loggedinUser = data;
               $log.info($scope.loggedinUser.lname);
             }
     	   })
     } else {
       $scope.userLevel = 'public';
     }
   }

}]);

app.controller('uploadCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = '';

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              if (!file.$error) {
                Upload.upload({
                    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                    data: {
                      username: $scope.username,
                      file: file
                    }
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' +
                                evt.config.data.file.name + '\n' + $scope.log;
                }).success(function (data, status, headers, config) {
                    $timeout(function() {
                        $scope.log = 'file: ' + config.data.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                    });
                });
              }
            }
        }
    };
}]);

app.controller('editProfile', ['$scope', '$log', '$timeout', '$http', 'toastr', function ($scope, $log, $timeout, $http, toastr) {

    $scope.collectUserInfo = function(user){

      $log.info('user: '+ user);

       // I didnt finsih below this
       $http.get('/user/'+ user).success(function(data){
          $scope.userFormData = data;
           $log.info(data);
         });

       };

       $scope.updateUserInfo = function(updateUserInfo){

          // lets put the data on the server...

          // we have the latest data now
          $scope.userMaster = angular.copy(updateUserInfo);

          // lets setup the post structure
          $scope.reqStructure = "/user/" + $scope.userMaster.id;

          // lets update the database
          // Submit request to Sails.
          $http.put($scope.reqStructure, $scope.userMaster)
          .success(function onSuccess(sailsResponse){
            toastr.success('Your record has been saved!', 'sucessfull');
          })
          .error(function(data, status) {

            if(status == 400) {
                $log.info('400 recieved');
                toastr.error('Not all required fields have been filled out. Please check and try again.', 'Error');
            } else {
             $log.info('Repos error', status, data);
             // Handle known error type(s).
             toastr.error('Unknown', 'Error');
           }
          })
          .finally(function eitherWay(){
           // do nothing
          })

      };

          $scope.editMenuSave = function(formData) {
            // we have the latest data now
            $scope.menuMaster = angular.copy(formData);

            if($scope.menuMaster.id) {
              $scope.reqStructure = "/menu/update/" + $scope.menuMaster.id;
            } else {
              // we should do the create function
              $scope.reqStructure = "/menu/";
            }
            // lets update the database
            // Submit request to Sails.
            $http.post($scope.reqStructure, $scope.menuMaster)
            .success(function onSuccess(sailsResponse){
              toastr.success('Your record has been saved!', 'sucessfull');
            })
            .error(function(data, status) {
               $log.info('Repos error', status, data);
               // Handle known error type(s).
             toastr.error('Unknown', 'Error');
            })
            .finally(function eitherWay(){
             // do nothing
            })


          }


}]);





app.directive('igLogin', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
'  <div class="modal fade" id="loginModal" tabindex="-1" + role = "dialog" aria-labelledby = "myModalLabel" aria-hidden = "true" ng-controller="LoginController"> ' +
'    <div class = "modal-dialog" > ' +
'      <form ng-submit="submitLoginForm()"> ' +
'        <div class = "modal-content" > ' +
'          <div class = "modal-header" > ' +
'            <button type="button" class = "close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()" > Cancel </button>' +
'              <h3>Login to your account</h3 > ' +
'          </div>' +
'          <div class="modal-body">' +
'            <table border="0"><tr><td>Email: </td><td><input ng-model="loginForm.email" type="text" placeholder="Email" name="email" class="form-control"></td></tr> ' +
'            <tr><td>Password: </td><td><input ng-model="loginForm.password" type="password" placeholder="Password" name="password" class="form-control"></td></tr>' +
'            <tr><td colspan="2"><button type="submit" class="btn btn-success"><span ng-show="!loginForm.loading">Sign in</span><span ng-show="loginForm.loading" class="fa fa-spinner"></span><span ng-show="loginForm.loading">Signing in...</span></button></td></tr></table> ' +
'						 <input type="hidden" name="_csrf" value="<%= _csrf %>" />'+
'          </div>' +
'        </div > ' +
'      </form>' +
'    </div > ' +
'  </div>' +
'</div > ',
        controller: function ($scope) {

            $scope.submit = function() {
                $scope.login();
		        $("#loginModal").modal('hide');
            };

            $scope.cancel = function() {
                $scope.loggingIn = false;
		        $("#loginModal").modal('hide');
            };

            $scope.$watch('loggingIn', function() {
                if ($scope.loggingIn) {
		            $("#loginModal").modal('show');
                };
           });
        }
    };
});

app.controller('navigationController', ['$scope', '$http', 'toastr', '$log', '$filter', function($scope, $http, toastr, $log, $filter){
	//$log.info(req.session.passport.user);



}]);

app.controller('LoginController', ['$scope', '$http', 'toastr', '$log', function($scope, $http, toastr, $log){

	// set-up loginForm loading state
	$scope.loginForm = {
		loading: false
	}

	$scope.submitLoginForm = function (){

    // Set the loading state (i.e. show loading spinner)
    $scope.loginForm.loading = true;

    // Submit request to Sails.
    $http.post('/auth/local', {
      identifier: $scope.loginForm.email,
      password: $scope.loginForm.password
    })
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      window.location = '/cook/dashboard';
    })
    .catch(function onError(sailsResponse) {

			$log.info(sailsResponse);

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 403) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('Invalid email/password combination.', 'Error', {
          closeButton: true
        });
        return;
      }

				toastr.error('An unexpected error occurred, please try again.', 'Error', {
					closeButton: true
				});
				return;

    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    });
  };
}]);

// --------- Cook controller ---------- //

app.controller('cookController', ['$scope', '$http', 'toastr', '$log',  function($scope, $http, toastr, $log){
  $scope.someValue = 0;
	// set-up loading state
	$scope.dashboardNav = {
		listMyMenus: true
	};

	$scope.product = {};

	$scope.menuPreview = function (menuRef){

		window.open("/menus/" + menuRef);

	};

	$scope.collectUserMenus = function(){

		 // I didnt finsih below this
		 $http.get('/menu/').success(function(data){
				 $scope.products = data;
				 $log.info(data);
			 });

		 };

		 $scope.editMenu = function(id){

			 $scope.dashboardNav = {
		 		editMyMenu: true
		 	}

			if(id == null) {
					// check if its a create menu
					$scope.data = {};

			} else {
				// otherwise, we will collect the menu to edit

				// Lets get the details of the chosen menu and return to the form
				$http.get('/menu/?id=' + id).success(function(data){
						// set the initial data from DB to the product attribute
						$scope.product = data;
					});

			}
	 };

	 $scope.editMenuSave = function(formData) {
		 // we have the latest data now
		 $scope.menuMaster = angular.copy(formData);

		 if($scope.menuMaster.id) {
			 $scope.reqStructure = "/menu/update/" + $scope.menuMaster.id;
		 } else {
			 // we should do the create function
			 $scope.reqStructure = "/menu/";
		 }
		 // lets update the database
		 // Submit request to Sails.
		 $http.post($scope.reqStructure, $scope.menuMaster)
		 .success(function onSuccess(sailsResponse){
			 toastr.success('Your record has been saved!', 'sucessfull');
		 })
		 .error(function(data, status) {
		 		$log.info('Repos error', status, data);
		 		// Handle known error type(s).
		 	toastr.error('Unknown', 'Error');
		 })
		 .finally(function eitherWay(){
		 	// do nothing
		 })


	 }

	 $scope.addIng = function() {
		 if(!$scope.product.ingrediants) {
			 $scope.product.ingrediants = [];
			 $scope.product.ingrediants.push($scope.input);
			 $scope.input = '';
		 } else {
			 $scope.product.ingrediants.push($scope.input);
			 $scope.input = '';
		 }
    };

		// remove an item
	 $scope.removeIng = function(index) {
		   $scope.product.ingrediants.splice(index, 1);
	 };

	 $scope.addImg = function() {
		 if(!$scope.product.images) {
			 $scope.product.images = [];
			 $scope.product.images.push($scope.imginput);
			 $scope.imginput = '';
		 } else {
			 $scope.product.images.push($scope.imginput);
			 $scope.imginput = '';
		 }
		 };

		// remove an item
	 $scope.removeImg = function(index) {
			 $scope.product.images.splice(index, 1);
	 };

	 $scope.addCat = function() {
		 		// lets check if the catagory is blank...
				if(!$scope.product.category) {
					$scope.product.category = [];
					$scope.product.category.push($scope.catinput);
					$scope.catinput = '';
				} else {
					$scope.product.category.push($scope.catinput);
					$scope.catinput = '';
				}
		 };

		// remove an item
	 $scope.removeCat = function(index) {
			 $scope.product.category.splice(index, 1);
	 };

}]);

// --------- signup controller ---------- //

app.controller('SignupController', ['$scope', '$http', 'toastr', '$log', function($scope, $http, toastr, $log){

	// set-up loading state
	$scope.signupForm = {
		loading: false
	}

	$scope.submitSignupForm = function(group){

		// Set the loading state (i.e. show loading spinner)
		$scope.signupForm.loading = true;

		if(group === 'cook')
		{
			var groups = ["cook"];
		}else{
			var groups = ["user"];
		}

		$scope.signupForm.groups = groups;

		// Submit request to Sails.
		$http.post('/user/create', {
			fname: $scope.signupForm.fname,
			lname: $scope.signupForm.lname,
			email: $scope.signupForm.email,
			city: $scope.signupForm.city,
      password: $scope.signupForm.password
		})
		.success(function onSuccess(sailsResponse){
			//if(group == 'cook') {
				window.location = '/cook/dashboard';
			//} else {
				//window.location = '/consumer/dashboard';
			//}
		})
		.error(function(data, status) {
        $log.info('Repos error', status, data);
        // Handle known error type(s).
		      // If using sails-disk adpater -- Handle Duplicate Key
		      //var emailAddressAlreadyInUse = status == 409;
				// lets check if the email has already been taken
				if(data.invalidAttributes.username) {
						var emailAddressAlreadyInUse = true;
					}
		if (emailAddressAlreadyInUse) {
			toastr.error('That email address has already been taken, please try again.', 'Error');
			return;
		}
    })
		.finally(function eitherWay(){
			$scope.signupForm.loading = false;
		})
	}

	$scope.submitLoginForm = function (){

    // Set the loading state (i.e. show loading spinner)
    $scope.loginForm.loading = true;

    // Submit request to Sails.
    $http.post('/auth/local', {
      email: $scope.loginForm.email,
      password: $scope.loginForm.password
    })
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      window.location = '/cook/dashboard';
    })
    .catch(function onError(sailsResponse) {

			$log.info(sailsResponse);

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('Invalid email/password combination.', 'Error', {
          closeButton: true
        });
        return;
      }

				toastr.error('An unexpected error occurred, please try again.', 'Error', {
					closeButton: true
				});
				return;

    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    });
  };
}]);

app.controller('PaymentController', ['$scope', '$http', 'toastr', '$log', function($scope, $http, toastr, $log){

		$scope.paymentClientToken = $http.get('/payment/clientToken').success(function(response){
			$scope.paymentClientToken = response.clientToken;
		}).error(function(data, status) {
			//$log.info('Repos error', status, data);
			$scope.error = true;
		});
}]);

// Menu Controller
app.controller('menuController',['$http', '$scope', '$log', '$location', function($http, $scope, $log, $location ){

    //set products to blank
  $scope.products = [];
  $scope.menuModal = false;
  $scope.productDetails = {};
  $scope.showToday = true;
  $scope.showTomorow = false;
  $log.info('im here');


  // function for collecting menus to display to the UI
  // When refers to the filter, incase its today or tomorow
  $scope.collectMenus = function(when){
    $log.info(when);
    // lets check if its tomorow and do something
    if(when === 'tomorow') {
      // need to change to tomorows date
      var myDate = new Date();
      var nextDay = new Date(myDate);
      nextDay.setDate(myDate.getDate()+1);
      $scope.todaysDate = nextDay;

      // lets collect the products for tomrowo
      $scope.products = menus;
      $log.info(menus);


      // lets finally setup the UI header to know which div to choose
      $scope.whichday = 'tomorow';

      // lets check if its today and do something
  } else if (when === 'today'){

        // lets change the date to today
        var myDate = new Date();
        $scope.todaysDate = myDate;

        // lets get data for today from the DB
        $http.get('/menu/public').success(function(data){
          $scope.products = data;
        });

        // lets finally setup the UI header to know which div to choose
        $scope.whichday = "today";
    } else {
      // lets get data
      $http.get('/menu/public').success(function(data){
        $scope.products = data;
        $log.info(data);
      });
    }

  };

  $scope.buyProduct = function(price) {
    $scope.purchaseModal=true;
  };

  // Search the DB for a specific menu item
  $scope.viewMenu = function(menuRef){

		$log.info(menuRef);

    //lets search based on ID. ID is passed as menu ref from the client or other controller
    $http.get('/menu?id=' + menuRef ).success(function(data){
      // lets set our data ready for the UI
        $scope.productDetails = data;

        // lets get the GEO location from google
        // lets also define the map
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + data.owner.city + '&key=AIzaSyCJLCY1Hf8Z7Majrjfu_AYlMF_zqOAB-p0').success(function(geoData){
          $log.info(geoData.results[0].geometry.location);
          $scope.map = { center: { latitude: geoData.results[0].geometry.location.lat, longitude: geoData.results[0].geometry.location.lng }, zoom: 15 };
          $log.info($scope.map);

          $scope.options = {scrollwheel: false};
          $scope.circles = [
              {
                  id: 1,
                  center: {
                      latitude: geoData.results[0].geometry.location.lat,
                      longitude: geoData.results[0].geometry.location.lng,
                  },
                  radius: 100,
                  stroke: {
                      color: '#08B21F',
                      weight: 2,
                      opacity: 1
                  },
                  fill: {
                      color: '#08B21F',
                      opacity: 0.5
                  },
                  geodesic: true, // optional: defaults to false
                  draggable: false, // optional: defaults to false
                  clickable: true, // optional: defaults to true
                  editable: true, // optional: defaults to false
                  visible: true, // optional: defaults to true
                  control: {}
                }];
        });

    }).error(function(data, status) {
        //$log.info('Repos error', status, data);
        $scope.error = true;
    });
    // lets tell the modal to load
    $scope.menuModal = true;
  };

  // lets setup the default date for the UI to choose
  //$scope.collectMenus('today');



}]);



// ------------- About Section --------------//
var app2 = angular.module('aboutMod', []);

app2.controller('aboutController',['$http', '$scope', '$log', function($http, $scope, $log){
  // Int. Array
  aboutTimeline = [];

  // function for collecting menus
  $scope.getAboutTimeline = function(){

    $http.get('/abouttimeline/').success(function(data){
      $scope.products = data;
      $log.info($scope.products);
    });

  };

}]);





// --------------- static data for testing --------------------//

var menus = [
  {
    id:  '1',
    name:  'Menu 1',
    category: 'Thai',
    images: [
        "images/meals/meal_1.jpg",
        "images/meals/meal_1.jpg",
        "images/meals/meal_1.jpg"
      ],
      price: "10.00"
    },
    {
      id:  '2',
      name:  'Menu 2',
      category: 'Italian',
      images: [
          "images/meals/meal_2.jpg",
          "images/meals/meal_2.jpg",
          "images/meals/meal_2.jpg"
        ],
        price: "10.00"
      },
      {
        id:  '3',
        name:  'Menu 3',
        category: 'Hearty',
        images: [
            "images/meals/meal_3.jpg",
            "images/meals/meal_3.jpg",
            "images/meals/meal_3.jpg"
          ],
          price: "11.00"
        },
        {
          id:  '4',
          name:  'Menu 4',
          category: 'Fish',
          images: [
              "images/meals/meal_4.jpg",
              "images/meals/meal_4.jpg",
              "images/meals/meal_4.jpg"
            ],
            price: "11.00"
          },{
            id:  '5',
            name:  'Menu 5',
            category: 'Meat',
            images: [
                "images/meals/meal_5.jpg",
                "images/meals/meal_5.jpg",
                "images/meals/meal_5.jpg"
              ],
            },
            {
              id:  '6',
              name:  'Menu 6',
              category: 'Thai',
              images: [
                  "images/meals/meal_6.jpg",
                  "images/meals/meal_6.jpg",
                  "images/meals/meal_6.jpg"
                ],
              }];
