app.controller('profileCtrl', function($scope,$rootScope,$firebaseAuth,FirebaseConfig,$firebaseObject,authService) {

  var authData = authService.authData;

  var ref = new Firebase(FirebaseConfig.base + "/wallets")
  ref.orderByChild("uid").equalTo(authData.uid).on("child_added", function(snapshot) {
    $scope.key = snapshot.key();
    console.log($scope.key);
    var walRef = new Firebase(FirebaseConfig.base + "/wallets/" +  snapshot.key())

    $scope.wallet = $firebaseObject(walRef);

    });
  })
