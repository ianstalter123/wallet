angular.module('wallet.controllers')
    .controller('startCtrl', function(
        $scope,
        FirebaseConfig,
        $rootScope,
        $state,
        $firebaseAuth,
        HttpService,
        $ionicSideMenuDelegate,
        DB,
        User
    ) {
        $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
            if (User.auth) {
                $scope.loggedIn = true;
                $scope.name = User.name;
                $scope.profileImageURL = User.profile_image;
            } else {
                $scope.loggedIn = false;
            }
        });
        console.log('bam');
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.goProfile = function() {
            $state.go('profile');
        };

        $scope.chat = function() {
            if (User.auth) {
                $state.go('chat');
            } else {
                HttpService.alertPopup('ERROR', 'Not logged in');
            }
        };
        $scope.main = function() {
            if (User.auth) {
                $state.go('main');
            } else {
                HttpService.alertPopup('ERROR', 'Not logged in');
            }
        };

        $scope.logOut = function() {
            DB.unauth();
        };
    });
