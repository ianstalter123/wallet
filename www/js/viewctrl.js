angular.module('wallet.controllers')
  .controller('viewCtrl', function($scope, $state, $stateParams, $firebaseArray,
      $firebaseObject, $cordovaInstagram, DB, $ionicViewSwitcher, $cordovaSocialSharing, $http, $rootScope, User) {
    console.log('test');
    //console.log($stateParams.image);

    /*=============================================
    =            Gets the wallet id from params            =
    =============================================*/



    $scope.wallet = $stateParams.wallet_id;

    /*====================================================================
    =            Checks to see if this wallet belongs to user            =
    ====================================================================*/




    User.walletRef.then(function() {
      console.log('wallet id', User.wallet.id);
      console.log('scope wallet', $scope.wallet);
      if ($scope.wallet === User.wallet.id) {
        $scope.myWallet = true;
      } else {
        $scope.myWallet = false;
      }

    })

    var walletRef = new Firebase('https://crackling-fire-8350.firebaseio.com/wallets/' + $scope.wallet + '/images');
    $scope.images = $firebaseArray(walletRef);
    $scope.image = $stateParams.image_id;
    $scope.images.$loaded()
      .then(function() {
        console.log($scope.images[$scope.image].$id);

        $scope.duplicate = function() {
          var myCopy = {
            imageUrl: $scope.images[$scope.image].imageUrl
          };

          DB.child('wallets')
            .child($stateParams.wallet_id)
            .child('images')
            .push(
              myCopy
          );
          $state.go('show', {
            'id': $stateParams.wallet_id
          })
        }

        $scope.remove = function() {

          DB.child('wallets')
            .child($stateParams.wallet_id)
            .child('images')
            .child($scope.images[$scope.image].$id)
            .remove();
          $state.go('show', {
            'id': $stateParams.wallet_id
          })
        }

        $scope.save = function(newSource) {
          $scope.source = newSource;

          DB.child('wallets')
            .child($stateParams.wallet_id)
            .child('images')
            .child($scope.images[$scope.image].$id)
            .update({
              oldImage: $scope.images[$scope
                .image]
                .imageUrl,
              imageUrl: newSource,
            });
          $state.go('show', {
            'id': $stateParams.wallet_id
          })
        }

        $scope.revert = function() {

          DB.child('wallets')
            .child($stateParams.wallet_id)
            .child('images')
            .child($scope.images[$scope.image].$id)
            .once('value', function(snap) {
              var original = snap.val()
                .oldImage;
              DB.child('wallets')
                .child($stateParams.wallet_id)
                .child('images')
                .child($scope.images[$scope.image].$id)
                .update({
                  imageUrl: original
                })
            })
          $state.go('show', {
            'id': $stateParams.wallet_id
          })
        }

        $scope.setSource = function(newSource) {
          $scope.source = newSource;
        }
        $scope.source = $scope.images[$scope
          .image]
          .imageUrl;
        $scope.fade = 'https://res.cloudinary.com/ianscloud/image/fetch/e_gradient_fade/' + $scope.images[
          $scope.image]
          .imageUrl;
        $scope.blur = 'https://res.cloudinary.com/ianscloud/image/fetch/e_oil_paint:70/' + $scope.images[$scope.image]
          .imageUrl;
        $scope.blackwhite = 'https://res.cloudinary.com/ianscloud/image/fetch/e_grayscale/' + $scope.images[
          $scope.image]
          .imageUrl;
        $scope.face = 'https://res.cloudinary.com/ianscloud/image/fetch/w_200,h_200,c_thumb,g_face,r_max/' + $scope
          .images[$scope.image]
          .imageUrl;


        console.log('source', $scope.source);
        var commentRef = new Firebase('https://crackling-fire-8350.firebaseio.com/wallets/' + $scope.wallet +
          '/images/' + $scope.images[$scope.image].$id + '/comments/');
        $scope.comments = $firebaseArray(commentRef);
      });
    $scope.index = $scope.image;
    $scope.share = function() {
      $cordovaInstagram.share($scope.images[$scope.index])
        .then(function() {}, function(err) {});
    };
    $scope.add = function(comment) {
      console.log($scope.comments);
      console.log(comment);
      $scope.comments.$add({
        'comment': comment,
        'user': $rootScope.user
      });
    };
    $scope.shareAnywhere = function() {
      $scope.images.$loaded()
        .then(function() {
          console.log($scope.images[$scope.image].image);
          $cordovaSocialSharing.share('My wallet Image!', 'My wallet Image!', 'data:image/png;base64,' + $scope.images[
            $scope.image].image, 'www.github.com/ianstalter123/wallet');
        });
    };
    $scope.swipeleftAction = function() {
      $ionicViewSwitcher.nextDirection('back');
      $state.go('main');
    };
  });
