app.controller('loginCtrl', function($scope,$rootScope, $state, $stateParams,$firebaseArray,$firebaseObject,$ionicActionSheet,$cordovaCamera) {
$rootScope.loggedIn = false;

$rootScope.user = "";

$scope.signupEmail = function(email,password){

  $scope.email = '';
  $scope.password = '';

  var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");

  console.log('here ' + email);
  ref.createUser({
    email    : email,
    password : password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $scope.loginEmail(email,password);
      $rootScope.loggedIn = true;
      var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");
      var authData = ref.getAuth();
      if (authData) {
        console.log("Authenticated user:", authData);
        $rootScope.user = authData.password.email;
      }
      $state.go('start');
    }
  });

};

$scope.loginEmail = function(email,password){

  var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");

  ref.authWithPassword({
    email    : email,
    password : password
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      $rootScope.loggedIn = true;
      var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");
      var authData = ref.getAuth();
      if (authData) {
        console.log("Authenticated user:", authData);
        $rootScope.user = authData.password.email;
      }
      $state.go('start');
    }
  });
};

$scope.showUser = function() {
  var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");
  var authData = ref.getAuth();
  if (authData) {
    console.log("Authenticated user:", authData);
    $scope.current = authData.password.email;
  }

}

$scope.logOut = function() {
  var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");

  ref.unauth();
  $rootScope.user = '';
  $rootScope.loggedIn = false;
}


});
