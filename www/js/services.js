angular.module('wallet.services', [])

.factory('DB', function(Firebase, $firebaseAuth, $rootScope, FirebaseConfig) {
    return new Firebase(FirebaseConfig.base);
})

.factory('User', function(DB, $state, HttpService, $timeout) {

    var baseRef = DB;
    var user = {};

    console.log("User service initialized");

    function authCallback(auth) {
        if (auth) {

            var walletRef = baseRef.child('users')
                .child(auth.uid)
                .child('settings')
                .child('walletid');

            walletRef.once('value', function(snap) {
                // could add the redirect to wallet
                // also add the create user in here?
                console.log('has wallet', snap.exists());
            })

            console.log("Authenticated");
            var email = auth[auth.provider].email;
            var name;

            if (auth.provider == 'password') {
                name = email.replace(/@.*/, '');
            } else {
                name = auth[auth.provider].displayName;
            }

            user.profile_image = auth[auth.provider].profileImageURL;
            user.auth = auth;
            user.uid = auth.uid;
            user.email = email;
            user.name = name;
            user.wallet = {};
            user.joined = {};


            user.userPath = 'users/' + auth.uid;

            var settingsRef = baseRef.child('users')
                .child(auth.uid)
                .child('settings');

            var walletRef = baseRef.child('users')
                .child(auth.uid)
                .child('wallet');

            baseRef.child('users')
                .child(auth.uid)
                .child('wallets')
                .once('value')
                .then(function(valsnap) {
                    if (valsnap.exists()) {
                        user.joined = valsnap.val().wallets;
                    }
                })

            settingsRef.once('value').then(function(snap) {
              if(snap.child('walletid').exists()) {
                user.wallet.id = snap.val().walletid;
                DB.child('wallets').child(user.wallet.id)
                    .once('value', function(walsnap) {
                        user.wallet.image = walsnap.val().image;
                        user.wallet.name = walsnap.val().name;
                        console.log(user.wallet.name);
                    })
                  }
            })


            var settings = null;

            var changeState = function(snap) {

            };

            user.promise = settingsRef.once('value')

        } else {
            //Unauthenticated
            console.log("Unauthenticated");


            delete user.auth;
            delete user.uid;
            delete user.email;
            delete user.name;
            delete user.userPath;
            delete user.profile_image;
            delete user.wallet;
            delete user.joined;



            if (!$state.is('login')) {
                console.log('going to login state');
                $state.go('login');
            }
        }
    }

    baseRef.onAuth(authCallback);

    return user;

})


.service('HttpService', [
    '$http',
    '$ionicLoading',
    '$ionicPopup',
    function($http, $ionicLoading, $ionicPopup) {
        this.showTemporaryLoading = function(message) {
            var msg = message ? message : 'Waiting...';
            $ionicLoading.show({
                template: msg,
                duration: 600
            });
        };
        this.busyState = false;
        // Show/hide Loading videw according to the app state(busy/not busy)
        this.setBusy = function(state, message, duration) {
            if (state == this.busyState)
                return;
            if (!duration) {
                duration = 10000;
            }
            var me = this;
            if (state) {
                this.busyState = true;
                if (me.busyState === true) {
                    if (message)
                        $ionicLoading.show({
                            template: message,
                            duration: duration
                        });
                    else
                        $ionicLoading.show({
                            template: 'Waiting...',
                            duration: duration
                        });
                }
            } else {
                this.busyState = false;
                $ionicLoading.hide();
            }
        };
        // Return full url
        this.getFullURL = function(query) {
            return this.server.baseURL + query;
        };
        // Connection failed
        this.postFail = function(yescb, nocb) {
            this.alertPopup('Connection Error', 'Unable to connect to the server. Please try again later.');
        };
        // Common Confirm popup
        this.confirmPopup = function(title, message, yescb, nocb) {
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4>' + title + '</h4>',
                template: '<div style="text-align: center; color:#333">' + message + '</div>'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    if (angular.isFunction(yescb))
                        yescb();
                } else {
                    if (angular.isFunction(nocb))
                        nocb();
                }
            });
        };
        // Common Alert popup
        this.alertPopup = function(title, message) {
            return $ionicPopup.alert({
                title: '<h4>' + title + '</h4>',
                okType: '',
                cssClass: 'alert-popup',
                template: '<div style="text-align: center; color:#333">' + message + '</div>'
            });
        };
    }
]);
