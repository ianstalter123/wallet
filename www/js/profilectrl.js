app.controller('profileCtrl', function($state,
    $q,
    $scope,
    $rootScope,
    $firebaseAuth,
    FirebaseConfig,
    $firebaseObject,
    authService)
     {
    $scope.$on('$ionicView.enter', function() {
        // code to run each time view is entered
        console.log('in profile controller');
        $scope.profile = '';
        var ref = new Firebase(FirebaseConfig.base + '/wallets');
        var ref2 = new Firebase(FirebaseConfig.base + '/users/' + $rootScope.id);
        ref2 = $firebaseObject(ref2);
        $scope.id = $rootScope.id;
        ref2.$loaded(function(data) {
            $scope.name = data.settings.name;
            $scope.phone = data.settings.phone;
        });
        ref.orderByChild('uid').equalTo($scope.id).on('child_added', function(snapshot) {
            $scope.key = snapshot.key();
            $scope.wid = $scope.key;
            console.log($scope.wid);
            console.log('val:', snapshot.val());
            var walRef = new Firebase(FirebaseConfig.base + '/wallets/' + snapshot.key());
            $scope.profile = $firebaseObject(walRef); //console.log($scope.profile)
        });
    });
});
