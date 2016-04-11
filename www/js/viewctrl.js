app.controller('viewCtrl', function($scope,$state,$stateParams,$firebaseArray,$firebaseObject,$cordovaInstagram,$ionicViewSwitcher,$cordovaSocialSharing,$rootScope) {
  console.log('test');
    //console.log($stateParams.image);

    $scope.wallet = $stateParams.wallet_id;

    var walletRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/" +$scope.wallet+"/images");

    $scope.images = $firebaseArray(walletRef);

    $scope.image = $stateParams.image_id;

    $scope.images.$loaded().then(function() {
      console.log($scope.images[$scope.image].$id);
      var commentRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/" +$scope.wallet+"/images/" + $scope.images[$scope.image].$id + "/comments/");
      $scope.comments = $firebaseArray(commentRef);
    });



    $scope.index = $scope.image



    $scope.share = function() {
      $cordovaInstagram.share($scope.images[$scope.index]).then(function() {
    // Worked
  }, function(err) {
    // Didn't work
  });
    }

    $scope.add = function(comment) {
      console.log($scope.comments);
      console.log(comment);
      $scope.comments.$add({'comment': comment, 'user': $rootScope.user })
    }



    $scope.shareAnywhere = function() {
      $scope.images.$loaded().then(function() {
        console.log($scope.images[$scope.image].image);
        $cordovaSocialSharing.share("My wallet Image!", "My wallet Image!", "data:image/png;base64," + $scope.images[$scope.image].image, "www.github.com/ianstalter123/wallet");
      });
    }

    // $scope.shareViaTwitter = function(message, image, link) {
    //   $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
    //     $cordovaSocialSharing.shareViaTwitter(message, image, link);
    //   }, function(error) {
    //     alert("Cannot share on Twitter");
    //   });
    // }

    $scope.swipeleftAction = function() {
      $ionicViewSwitcher.nextDirection('back');
      $state.go('main');
    }

  })
