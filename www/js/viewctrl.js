app.controller('viewCtrl', function($scope,$state,$stateParams,$firebaseArray,$cordovaInstagram,$ionicViewSwitcher) {
  console.log('test');
    //console.log($stateParams.image);
    $scope.wallet = $stateParams.wallet_id; //getting fooVal
    $scope.image = $stateParams.image_id; //getting fooVal
    //..
    var walletRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/" +$scope.wallet+"/images");

    $scope.images = $firebaseArray(walletRef)
    $scope.index = $scope.image

    $scope.share = function() {
    $cordovaInstagram.share($scope.images[$scope.index]).then(function() {
    // Worked
    }, function(err) {
    // Didn't work
    });
   }

    $scope.swipeleftAction = function() {
      $ionicViewSwitcher.nextDirection('back');
        $state.go('main');
    }

  })
