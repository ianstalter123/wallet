app.controller('viewCtrl', function($scope,$state,$stateParams,$firebaseArray,$cordovaInstagram,$ionicViewSwitcher,$cordovaSocialSharing) {
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


    $scope.shareAnywhere = function() {
      $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
    }

    $scope.shareViaTwitter = function(message, image, link) {
      $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
        $cordovaSocialSharing.shareViaTwitter(message, image, link);
      }, function(error) {
        alert("Cannot share on Twitter");
      });
    }

    $scope.swipeleftAction = function() {
      $ionicViewSwitcher.nextDirection('back');
      $state.go('main');
    }

  })
