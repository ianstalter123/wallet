angular.module('wallet.controllers')
.controller('infoCtrl', function($state,
    $q,
    $scope,
    $rootScope,
    $firebaseAuth,
    FirebaseConfig,
    $firebaseObject,
    HttpService,
    $stateParams,
     DB) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = true;
        HttpService.showTemporaryLoading('Loading...');

    });
    $scope.$on('$ionicView.enter', function() {
        // code to run each time view is entered
        console.log('in info controller');
        console.log($stateParams);

        var ref = DB.child('wallets');
        var userRef =
        DB.child('users')
        .child($stateParams.id);

        var walRef = DB.child('wallets')
        .child($stateParams.wid)
        $scope.profile = $firebaseObject(walRef); //console.log($scope

        userRef.on('value', function(datasnap) {
            $scope.name = datasnap.val().settings.name;
            if(datasnap.val().wallets.wallets) {
            $scope.joined = datasnap.val().wallets.wallets;
        }
        });

    });
});
