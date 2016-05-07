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
    DB) {

    $scope.item = {};
    //console.log(authService.authData.uid);
    var ref = DB.child('wallets');
    $scope.wallets = $firebaseArray(ref);
    console.log(FirebaseConfig.base);
    $ionicSlideBoxDelegate.update();
    $scope.goProfile = function() {
        $state.go('profile');
    };
    $scope.chat = function() {
        if ($rootScope.loggedIn === false) {
            HttpService.alertPopup('ERROR', 'Not logged in');
        } else {
            $state.go('chat');
        }
    };
    $scope.main = function() {
        if ($rootScope.loggedIn === false) {
            HttpService.alertPopup('ERROR', 'Not logged in');
        } else {
            $state.go('main');
        }
    };
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
        var userObj = { 'email': $scope.email };
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
                var userRef =  DB.child('users')
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
    $scope.capturePicture = function($event, item) {
        console.log('I am going to use the camera');
        var savePicture = function(data) {
            //Upload the data to server/convert etc.
            $timeout(function() {
                $scope.item.image = 'data:image/jpeg;base64,' + data;
                $scope.loadimage = data;
            });
        };
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            //need to add an image to the correct wallet here
            //how do I guarantee I'm selecting the CORRECT WALLET!
            savePicture(imageData);
        }, function(error) {
            console.error(error);
        });
    };
    $scope.createWallet = function(bday, name, image) {
        console.log(bday);

        $scope.wallets.$add({
            image: $scope.loadimage,
            uid: $rootScope.id,
            birthday: bday,
            name: name
        }).then(function(data) {
            //alert("Image has been uploaded");
            //console.log(data.key());
            $scope.item.image = '';
            $scope.loadimage = '';
            name = '';
            birthday = '';
            $state.go('main');
        });
    };
    $scope.logOut = function() {
        var ref = new Firebase(FirebaseConfig.base);
        ref.unauth();
        $rootScope.user = '';
        $rootScope.loggedIn = false;
        $rootScope.current = '';
        $rootScope.profileImageURL = '';
        $rootScope.id = '';
        $rootScope.wallet = '';
    };
});
