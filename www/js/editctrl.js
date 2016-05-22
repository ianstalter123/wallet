angular.module('wallet.controllers')
    .controller('editCtrl', function($scope,
        DB,
        $state,
        $stateParams,
        $ionicActionSheet) {

        $scope.update = function(name, birthday, food, activity) {

            DB.child('wallets').child($scope.id).update({
                name: name,
                birthday: birthday,
                food: food,
                activity: activity
            });
        };
        $scope.id = $stateParams.id;

        var wallet = DB.child('wallets').child($scope.id);

        wallet.once('value', function(valSnap) {

            $scope.name = valSnap.val().name;
            $scope.image = valSnap.val().image;
            $scope.food = valSnap.val().food;
            $scope.activity = valSnap.val().activity;
            $scope.birthday = new Date(valSnap.val().birthday);
        });
    });
