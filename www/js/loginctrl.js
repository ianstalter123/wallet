app.controller('loginCtrl', function($scope,$rootScope, $state, $stateParams,$firebaseArray,$firebaseObject,$ionicActionSheet,$cordovaCamera,$ionicSlideBoxDelegate,$firebaseAuth) {

  var ref = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/");
  $scope.wallets = $firebaseArray(ref);

   var authRef = new Firebase("https://crackling-fire-8350.firebaseio.com");
   $scope.authObj = $firebaseAuth(authRef);
  var authData = $scope.authObj.$getAuth();
  if (authData) {
    $rootScope.loggedIn = true;
    // $scope.current = authData.google.displayName;
    // $rootScope.user = authData.google.displayName;
  } else {
    $rootScope.loggedIn = false;
  }

  // if(!$scope.current || $rootScope.user) {
  //   $rootScope.loggedIn = false;
  //   $rootScope.user = "";
  // }

  $ionicSlideBoxDelegate.update();

  $scope.googleIn = function() {
    console.log('clicked google');
    var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        alert("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        console.log("Authenticated user:", authData);

        $rootScope.loggedIn = true;
        $rootScope.user = authData.google.displayName;
        $rootScope.profileImageURL = authData.google.profileImageURL;
        $scope.current = authData.google.displayName;
        $state.go('start');
      }
    });
  }

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
        alert("Error creating user - please use an email:", error);
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
    $rootScope.profileImageURL = "";
    var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");

    ref.authWithPassword({
      email    : email,
      password : password
    }, function(error, authData) {
      if (error) {
        alert("Login Failed!", error);
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
