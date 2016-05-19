app.controller('startCtrl', function($scope,
    FirebaseConfig,
    $rootScope,
    $state,
    $firebaseAuth,
    HttpService,
    DB) {

    $scope.goProfile = function() {
        $state.go('profile');
    };

    $scope.chat = function() {
        if ($rootScope.loggedIn === false) {
            HttpService.alertPopup('ERROR', 'Not logged in');
        } else {
            $state.go('chat');
        }
    };
    $scope.main = function() {
        if ($rootScope.loggedIn === false) {
            HttpService.alertPopup('ERROR', 'Not logged in');
        } else {
            $state.go('main');
        }
    };

    $scope.logOut = function() {
        var ref = new Firebase(FirebaseConfig.base);
        ref.unauth();
        $rootScope.user = '';
        $rootScope.loggedIn = false;
        $rootScope.current = '';
        $rootScope.profileImageURL = '';
        $rootScope.id = '';
        $rootScope.wallet = '';
    };
});