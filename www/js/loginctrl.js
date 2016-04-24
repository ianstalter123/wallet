app.controller('loginCtrl', function($scope,FirebaseConfig,$rootScope, $state, $stateParams,$firebaseArray,$firebaseObject,$ionicActionSheet,$cordovaCamera,$ionicSlideBoxDelegate,$firebaseAuth, authService,HttpService) {

  //console.log(authService.authData.uid);
  var ref = new Firebase(FirebaseConfig.base + "/wallets/");
  $scope.wallets = $firebaseArray(ref);

  console.log(FirebaseConfig.base);

  $ionicSlideBoxDelegate.update();

  $scope.goProfile = function() {
    $state.go('profile');
  }

  $scope.chat = function() {
    if($rootScope.loggedIn === false){
      HttpService.alertPopup("ERROR", "Not logged in");
    } else {
      $state.go('chat')
    }
  }
  $scope.main = function() {
    if($rootScope.loggedIn === false){
      HttpService.alertPopup("ERROR", "Not logged in");
    } else {
      $state.go('main')
    }
  }

  $scope.googleIn = function() {
    console.log('clicked google');
    var ref = new Firebase(FirebaseConfig.base);
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

    var ref = new Firebase(FirebaseConfig.base);

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
        var ref = new Firebase(FirebaseConfig.base);
        var authData = ref.getAuth();
        if (authData) {
          console.log("Authenticated user:", authData);
          $rootScope.user = authData.password.email;
          $rootScope.id = authData.uid;
        }
        $state.go('start');
      }
    });

  };

  $scope.loginEmail = function(email,password){
    $rootScope.profileImageURL = "";
    var ref = new Firebase(FirebaseConfig.base);

    ref.authWithPassword({
      email    : email,
      password : password
    }, function(error, authData) {
      if (error) {
        alert("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $rootScope.loggedIn = true;
        var ref = new Firebase(FirebaseConfig.base);
        var authData = ref.getAuth();
        if (authData) {
          console.log("Authenticated user:", authData);
          $rootScope.user = authData.password.email;
          $rootScope.profileImageURL = authData.password.profileImageURL;
          $rootScope.id = authData.uid;

        }
        $state.go('start');
      }
    });
  };

  $scope.showUser = function() {
    var ref = new Firebase(FirebaseConfig.base);
    var authData = ref.getAuth();
    if (authData) {
      console.log("Authenticated user:", authData);
      $scope.current = authData.password.email;
    }

  }

  $scope.logOut = function() {
    var ref = new Firebase(FirebaseConfig.base);

    ref.unauth();
    $rootScope.user = '';
    $rootScope.loggedIn = false;
    $rootScope.current = '';
    $rootScope.profileImageURL = '';
    $rootScope.id = '';
    $rootScope.wallet = '';
  }


});
