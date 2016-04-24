app.controller('profileCtrl', function($state,$q,$scope,$rootScope,$firebaseAuth,FirebaseConfig,$firebaseObject,authService) {

  $scope.$on('$ionicView.enter', function() {
        // code to run each time view is entered
    console.log('in profile controller');

    $scope.profile = '';

  var ref = new Firebase(FirebaseConfig.base + "/wallets")
  $scope.id = $rootScope.id;
  ref.orderByChild("uid").equalTo($scope.id).on("child_added", function(snapshot) {
    $scope.key = snapshot.key();
    $scope.wid = $scope.key;
    console.log($scope.wid);
    console.log('val:', snapshot.val())
    var walRef = new Firebase(FirebaseConfig.base + "/wallets/" +  snapshot.key())

    $scope.profile = $firebaseObject(walRef);

    //console.log($scope.profile)

  });
  });
});

