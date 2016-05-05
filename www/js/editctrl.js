app.controller('editCtrl', function($scope, $state, $stateParams, $firebaseArray, $firebaseObject, $ionicActionSheet, $cordovaCamera) {

    $scope.update = function(name, birthday) {
        //console.log(birthday);
        //console.log(name);
        galRef.update({
            name: name,
            birthday: birthday
        });
    }

    $scope.id = $stateParams.id; //getting fooVal
    var galRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/" + $scope.id);
    console.log(galRef.child('name'))
    $scope.wallet = $firebaseObject(galRef);
    console.log('in edit!');
    $scope.wallet.$loaded().then(function() {
        $scope.name = $scope.wallet.name;
        $scope.image = $scope.wallet.image;
        $scope.birthday = new Date($scope.wallet.birthday);
    });
})
