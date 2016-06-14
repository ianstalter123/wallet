angular.module('wallet.controllers')
    .controller('editCtrl', function($scope,
        DB,
        $state,
        $ionicActionSheet,
        User) {


        $scope.name = User.wallet.name;
        $scope.image = User.wallet.image;
        $scope.food = User.wallet.food;
        $scope.activity = User.wallet.activity;
        $scope.birthday = new Date(User.wallet.birthday);

        $scope.update = function(name, birthday, food, activity) {

            DB.child('wallets').child(User.wallet.id).update({
                name: name,
                birthday: birthday,
                food: food,
                activity: activity
            });
        };

    });
