app.controller('loginCtrl', function($scope,
    FirebaseConfig,
    $rootScope,
    $state,
    $stateParams,
    $firebaseArray,
    $firebaseObject,
    $ionicActionSheet,
    $cordovaCamera,
    $ionicSlideBoxDelegate,
    $firebaseAuth,
    authService,
    HttpService,
    $timeout,
    $ionicHistory,
    DB) {
    $scope.item = {};
    //console.log(authService.authData.uid);
    var ref = DB.child('wallets');
    $scope.wallets = $firebaseArray(ref);
    console.log(FirebaseConfig.base);
    $ionicSlideBoxDelegate.update();

   
    $scope.googleIn = function() {
        console.log('clicked google');
        var ref = new Firebase(FirebaseConfig.base);
        ref.authWithOAuthPopup('google', function(error, authData) {
            if (error) {
                alert('Login Failed!', error);
            } else {
                console.log('Authenticated successfully with payload:', authData);
                console.log('Authenticated user:', authData);
                $rootScope.loggedIn = true;
                $rootScope.user = authData.google.displayName;
                $rootScope.profileImageURL = authData.google.profileImageURL;
                $scope.current = authData.google.displayName;
                $state.go('start');
            }
        });
    };
    $scope.setSettings = function(userPath) {
        console.log('setting up user', userPath);
        var userRef = DB
            .child('users')
            .child(userPath)
            .child('settings');
        var userObj = {
            'email': $scope.email
        };
        userRef.set(userObj);
        $state.go('start');
    };
    $scope.signupEmail = function(email, password, phone, name) {
        console.log('here ' + email);
        DB.createUser({
            email: email,
            password: password
        }, function(error, userData) {
            if (error) {
                alert('Error creating user - please use an email:', error);
            } else {
                console.log('Successfully created user account with uid:', userData.uid);
                var userRef = DB.child('users')
                    .child(userData.uid)
                    .child('settings');
                var userObj = {
                    'email': email,
                    'phone': phone,
                    'name': name
                };
                console.log(userObj);
                userRef.set(userObj);
                var goWallet = function() {
                    $state.go('createWallet');
                };
                //things to improve on here
                //add more specific info related to user on login
                //for example add user name, profile
                //use two screens
                //first screen add info
                //second screen go to create wallet
                //after creating a wallet redirect to the wallets page
                $scope.loginEmail(email, password, goWallet);
                //$state.go create intial create wallet
                $rootScope.loggedIn = true;
                if (authData) {
                    console.log('Authenticated user:', authData);
                    $rootScope.user = authData.password.email;
                    $rootScope.id = authData.uid;
                }
            }
        });
    };
    $scope.loginEmail = function(email, password, callback) {
        $rootScope.profileImageURL = '';
        DB.authWithPassword({
            email: email,
            password: password
        }, function(error, authData) {
            if (error) {
                alert('Login Failed!', error);
            } else {
                HttpService.showTemporaryLoading('Loading...');
                console.log('Authenticated successfully with payload:', authData);
                $rootScope.loggedIn = true;
                var authData = DB.getAuth();
                if (authData) {
                    console.log('Authenticated user:', authData);
                    $rootScope.user = authData.password.email;
                    $rootScope.profileImageURL = authData.password.profileImageURL;
                    $rootScope.id = authData.uid;
                }
                if (callback) {
                    callback();
                } else {
                    $state.go('start');
                }
            }
        });
    };
    $scope.showUser = function() {
        var ref = new Firebase(FirebaseConfig.base);
        var authData = ref.getAuth();
        if (authData) {
            console.log('Authenticated user:', authData);
            $scope.current = authData.password.email;
        }
    };
 

});
