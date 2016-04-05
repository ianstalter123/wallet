app.controller('profileCtrl', function($scope,$rootScope,$firebaseAuth,$firebaseObject) {
  console.log('test');
  var authRef = new Firebase("https://crackling-fire-8350.firebaseio.com");
  $scope.authObj = $firebaseAuth(authRef);
  var authData = $scope.authObj.$getAuth();
  console.log(authData.uid);

  var ref = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets")
  ref.orderByChild("uid").equalTo(authData.uid).on("child_added", function(snapshot) {
    $scope.key = snapshot.key();
    console.log($scope.key);
    var walRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/" +  snapshot.key())
    $scope.wallet = $firebaseObject(walRef);

    });
  })
