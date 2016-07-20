angular.module('wallet.controllers')
  .controller('streamCtrl', function($state,
    $q,
    $scope,
    $rootScope,
    $firebaseAuth,
    FirebaseConfig,
    $firebaseObject,
    HttpService,
    $stateParams,
    DB,
    User,
    $timeout) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {

      /*================================================
    =    Gets all joined wallets and listens for images =
    ================================================*/
      $scope.streamImages = [];
      DB.child("users")
        .child(User.uid)
        .child("wallets")
        .child('wallets')
        .once('value', function(val) {
          console.log('streams', val.val());
          $scope.streams = val.val();
          angular.forEach($scope.streams, function(value, key) {
            //console.log(key);
            var thisRef = DB.child('wallets').child(key).child('images');
            thisRef.on('child_added', function(snap) {
              //console.log(snap.key())
              $scope.streamImages.push(snap.val().image);
            });
          });
        });

    });
  });
