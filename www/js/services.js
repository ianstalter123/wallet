angular.module('wallet.services', [])

/*================================================
    =            Get DB setup            =
    ================================================*/
.factory('DB', function(Firebase, $firebaseAuth, $rootScope, FirebaseConfig) {
  return new Firebase(FirebaseConfig.base);
})

/*================================================
    =            User service           =
    ================================================*/

.factory('User', function(DB, $state, HttpService, $timeout) {



  var baseRef = DB;
  var user = {};

  console.log("User service initialized");

  function authCallback(auth) {
    if (auth) {

      /*================================================
    =  If logged in gets a ref for the user's wallet  =
    ================================================*/
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

      /*================================================
    =            sets the users variables            =
    ================================================*/

      user.profile_image = auth[auth.provider].profileImageURL;
      user.auth = auth;
      user.uid = auth.uid;
      user.email = email;
      user.name = name;
      user.wallet = {};
      user.joined = {};
      var mine = [];
      var wallets = [];
      var walletRef = DB.child('wallets');

      /*================================================
    =  Orders the wallets, appending users wallet to top =
    ================================================*/
      walletRef.once("value")
        .then(function(snapshot) {
          //console.log('data1:', snapshot.val());
          angular.forEach(snapshot.val(), function(wallet, key) {
            if (wallet.uid !== user.uid) {
              var betterWallet = {};
              betterWallet = wallet;
              betterWallet.$id = key;
              wallets.push(betterWallet);
            } else if (wallet.uid === user.uid) {
              //console.log('match',wallet.uid);
              mine.push(wallet);
              mine[mine.length - 1].$id = key;
            }
          });
          for (var i = 0; i < mine.length; i++) {
            wallets.unshift(mine[i]);
          }

          //console.log('ordered wallets', wallets);
          user.wallets = wallets;
        })

      user.userPath = 'users/' + auth.uid;

      var settingsRef = baseRef.child('users')
        .child(auth.uid)
        .child('settings');

      var walletRef = baseRef.child('users')
        .child(auth.uid)
        .child('wallet');

      /*================================================
    =  Gets the values for the users wallet settings  =
    ================================================*/
      settingsRef.once('value')
        .then(function(snap) {
          if (snap.child('walletid')
            .exists()) {
            console.log('walletid', snap.val());
            user.wallet.id = snap.val()
              .walletid;
            DB.child('wallets')
              .child(user.wallet.id)
              .once('value', function(walsnap) {
                user.wallet.food = walsnap.val()
                  .food;
                user.wallet.activity = walsnap.val()
                  .activity;
                user.wallet.birthday = walsnap.val()
                  .birthday;
                user.wallet.imageUrl = walsnap.val()
                  .imageUrl;
                user.wallet.name = walsnap.val()
                  .name;
              })
          }
        })

      var settings = null;

      /*================================================
    =  Function to goto start or signup if users loggedin  =
    ================================================*/

      var changeState = function(snap) {

        if (snap.exists()) {
          console.log("updating settings snapshot");

          $state.go('app.start');
          DB.unauth();
        } else {
          $state.go('signup');
          //TODO: @ian  Create the user object pick data from the google object to set

        }
      }

      user.promise = settingsRef.once('value')

      /*================================================
    =            ref to ensure wallets are loaded      =
    ================================================*/
      user.walletRef = walletRef.once('value');


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
      delete user.wallets;
      delete user.joined;

      if (!$state.is('login')) {
        console.log('going to login state');
        $state.go('login');
      }
    }
  }

  /*================================================
    = When logged in the main user loop called     =
    ================================================*/

  baseRef.onAuth(authCallback);

  return user;

})

/*================================================
    =            Service for popups            =
    ================================================*/

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
