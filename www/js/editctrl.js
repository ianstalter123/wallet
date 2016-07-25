angular.module('wallet.controllers')
  .controller('editCtrl', function($scope,
    DB,
    $state,
    $ionicActionSheet,
    User) {


    $scope.name = User.wallet.name;
    $scope.imageUrl = User.wallet.imageUrl;
    $scope.food = User.wallet.food;
    $scope.activity = User.wallet.activity;
    $scope.birthday = new Date(User.wallet.birthday);
    $scope.source = $scope.imageUrl;
    $scope.setSource = function(newSource) {
      $scope.source = newSource;
    // DB.child('wallets')
    //   .child(User.wallet.id)
    //   .update({
    //     oldImage: $scope.imageUrl,
    //     imageUrl: newSource,
    //   });
    }

    $scope.fade = 'https://res.cloudinary.com/ianscloud/image/fetch/e_gradient_fade/' + $scope.imageUrl;
    $scope.blur = 'https://res.cloudinary.com/ianscloud/image/fetch/e_oil_paint:70/' + $scope.imageUrl;
    $scope.blackwhite = 'https://res.cloudinary.com/ianscloud/image/fetch/e_grayscale/' + $scope.imageUrl;
    $scope.face = 'https://res.cloudinary.com/ianscloud/image/fetch/w_200,h_200,c_thumb,g_face,r_max/' + $scope.imageUrl;

    $scope.update = function(name, birthday, food, activity) {

      DB.child('wallets')
        .child(User.wallet.id)
        .update({
          name: name,
          birthday: birthday,
          food: food,
          activity: activity
        });
    };

  });
