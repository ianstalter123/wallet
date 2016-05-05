app.factory('authService', function (Firebase, $firebaseAuth, $rootScope, FirebaseConfig) {
  var ref = new Firebase(FirebaseConfig.base);
  var obj = $firebaseAuth(ref);
  var data = obj.$getAuth();
  if (data && data.hasOwnProperty('google')) {
    $rootScope.loggedIn = true;
    console.log(data);
    $rootScope.current = data.google.displayName;
    $rootScope.user = data.google.displayName;
    $rootScope.profileImageURL = data.google.profileImageURL;
    $rootScope.id = data.id;
  } else if (data) {
    $rootScope.loggedIn = true;
    $rootScope.current = data.password.email;
    $rootScope.user = data.password.email;
    $rootScope.profileImageURL = data.password.profileImageURL;
    $rootScope.id = data.uid;
  } else {
    $rootScope.loggedIn = false;
  }
  return {
    authData: data,
    loggedIn: 'false'
  };
}).service('HttpService', [
  '$http',
  '$ionicLoading',
  '$ionicPopup',
  function ($http, $ionicLoading, $ionicPopup) {
    this.showTemporaryLoading = function (message) {
      var msg = message ? message : 'Waiting...';
      $ionicLoading.show({
        template: msg,
        duration: 600
      });
    };
    this.busyState = false;
    // Show/hide Loading videw according to the app state(busy/not busy)
    this.setBusy = function (state, message, duration) {
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
    this.getFullURL = function (query) {
      return this.server.baseURL + query;
    };
    // Connection failed
    this.postFail = function (yescb, nocb) {
      this.alertPopup('Connection Error', 'Unable to connect to the server. Please try again later.');
    };
    // Common Confirm popup
    this.confirmPopup = function (title, message, yescb, nocb) {
      var confirmPopup = $ionicPopup.confirm({
        title: '<h4>' + title + '</h4>',
        template: '<div style="text-align: center; color:#333">' + message + '</div>'
      });
      confirmPopup.then(function (res) {
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
    this.alertPopup = function (title, message) {
      return $ionicPopup.alert({
        title: '<h4>' + title + '</h4>',
        okType: '',
        cssClass: 'alert-popup',
        template: '<div style="text-align: center; color:#333">' + message + '</div>'
      });
    };
  }
]);