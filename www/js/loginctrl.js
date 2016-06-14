angular.module('wallet.controllers')
    .controller('loginCtrl', function($scope,
        FirebaseConfig,
        $rootScope,
        $state,
        $firebaseArray,
        $ionicSlideBoxDelegate,
        HttpService,
        $ionicHistory,
        DB,
        User) {
        $scope.item = {};
        //console.log(authService.authData.uid);
        var ref = DB.child('wallets');
        $scope.wallets = $firebaseArray(ref);
        //console.log(FirebaseConfig.base);
        $ionicSlideBoxDelegate.update();


        $scope.googleIn = function() {
            console.log('clicked google');
            var ref = new Firebase(FirebaseConfig.base);
            ref.authWithOAuthPopup('google', function(error, authData) {
                if (error) {
                    alert('Login Failed!', error);
                } else {
                    console.log('Authenticated successfully with payload:', authData);
                    //console.log('Authenticated user:', authData);
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
            return DB.createUser({
                email: email,
                password: password
            }, function(error, userData) {
                if (error) {
                    alert('Error:', error);
                } else {
                    //console.log('Successfully created user account with uid:', userData.uid);

                    var userObj = {
                        'email': email,
                        'phone': phone,
                        'name': name
                    };
                    var goWallet = function() {
                        console.log('going to create');
                        $state.go('createWallet');
                    };

                    var onComplete = function(error) {
                        if (error) {
                            console.log('Synchronization failed');
                        } else {
                            console.log('Synchronization succeeded');
                            $scope.loginEmail(email, password, goWallet);
                        }
                    };

                    DB.child('users')
                        .child(userData.uid)
                        .child('settings')
                        .set(userObj, onComplete);

                }
            })
        };
        $scope.loginEmail = function(email, password, callback) {

            DB.authWithPassword({
                email: email,
                password: password
            }, function(error, authData) {
                if (error) {
                    alert('Login Failed!', error);
                } else {
                    HttpService.showTemporaryLoading('Loading...');
                    console.log('Authenticated successfully with payload');

                    if (callback) {
                        callback();
                    } else {
                        $state.go('start');
                    }
                }
            });
        };

    });
