angular.module('wallet.controllers')
  .controller('profileCtrl', function($state,
    $scope,
    $rootScope,
    $firebaseAuth,
    FirebaseConfig,
    $firebaseObject,
    HttpService,
    DB,
    User,
    $timeout) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      console.log('prepping');
      viewData.enableBack = true;
      HttpService.showTemporaryLoading('Loading...');
      /*================================================
    =           Gets user settings            =
    ================================================*/
      User.promise.then(function() {
        $scope.walletId = User.wallet.id;
        $scope.imageUrl = User.wallet.imageUrl;
        $scope.name = User.wallet.name;

      })
    });

    DB.child('users')
      .child(User.uid)
      .child('wallets')
      .once('value')
      .then(function(snap) {
        if (snap.child('wallets')
          .exists()) {
          $timeout(function() {
            $scope.joined = snap.val()
              .wallets;
          })
        }
      })

    $scope.viewFollower = function(walletId) {
      DB
        .child('wallets')
        .child(walletId)
        .child('uid')
        .on('value', function(idsnap) {
          console.log(idsnap.val());
          $state.go('info', {
            'id': idsnap.val(),
            'wid': walletId
          });
        })
    }
  });
