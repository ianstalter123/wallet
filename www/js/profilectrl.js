app.controller('profileCtrl', function($state,
    $scope,
    $rootScope,
    $firebaseAuth,
    FirebaseConfig,
    $firebaseObject,
    HttpService,
    authService,
    DB) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = true;
        HttpService.showTemporaryLoading('Loading...');
    });

    $scope.viewFollower = function(walletId) {
        DB
            .child('wallets')
            .child(walletId)
            .child('uid')
            .on('value', function(idsnap) {
                console.log(idsnap.val());
                $state.go('info', {
                    'id': idsnap.val(),
                    'wid': walletId
                });
            })

    }

    $scope.$on('$ionicView.enter', function() {
        // code to run each time view is entered
        console.log('in profile controller');
        $scope.profile = '';

        $scope.id = $rootScope.id;

        DB.child('users')
            .child($rootScope.id)
            .on('value', function(data) {
                console.log(data.val());
                $scope.name = data.val().settings.name;
                $scope.phone = data.val().settings.phone;
                if (data.val().wallets) {
                    $scope.joined = data.val().wallets.wallets;
                    console.log('joined', $scope.joined);
                }
                $scope.walletId = data.val().settings.walletid;
                console.log($scope.walletId);
                var walRef = DB.child('wallets').child($scope.walletId);
                $scope.profile = $firebaseObject(walRef);
                console.log('profile', $scope.profile)
            })

    });
});
