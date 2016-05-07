app.controller('editCtrl', function ($scope,DB, $state, $stateParams, $firebaseArray, $firebaseObject, $ionicActionSheet, $cordovaCamera) {
  $scope.update = function (name, birthday,food,activity) {
    //console.log(birthday);
    //console.log(name);
    DB.child('wallets').child($scope.id).update({
      name: name,
      birthday: birthday,
      food: food,
      activity: activity
    });
  };
  $scope.id = $stateParams.id;
  //getting fooVal
  var wallet = DB.child('wallets').child($scope.id);

  wallet.on('value',function (valSnap) {
    console.log(valSnap.val());
    $scope.name = valSnap.val().name;
    $scope.image = valSnap.val().image;
    $scope.food = valSnap.val().food;
    $scope.activity = valSnap.val().activity;
    $scope.birthday = new Date(valSnap.val().birthday);
  });
});
