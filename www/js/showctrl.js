angular.module('wallet.controllers')
  .controller('showCtrl', function($scope, $ionicPopup, FirebaseConfig,
    $firebaseAuth, $state, $rootScope, $stateParams, $firebaseArray,
    $firebaseObject, $ionicActionSheet, $cordovaCamera, DB) {
    //$scope.id = $stateParams.id;
    var ref = new Firebase(FirebaseConfig.base);
    var obj = $firebaseAuth(ref);
    var data = obj.$getAuth();
    $rootScope.id = data.uid;
    $scope.addImage = function() {
      var delRef = new Firebase('https://crackling-fire-8350.firebaseio.com/wallets/' + $stateParams.id + '/uid');
      var del = $firebaseObject(delRef);
      del.$loaded(function(data) {
        if (data.$value === $rootScope.id) {
          var canEdit = true;
          console.log('can edit!');
          $ionicActionSheet.show({
            buttons: [{
              text: 'Camera'
            }, {
              text: 'Gallery'
            }],
            titleText: 'Add Photo',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
              if (index === 0) {
                $scope.upload();
              }
              if (index === 1) {
                $scope.gallery();
              }
              return true;
            }
          });
        } else {
          $ionicPopup.alert({
            title: 'You haven\'t joined this wallet!',
            template: 'Join first.'
          });
        }
      });
    };
    $scope.id = $stateParams.id;
    //getting fooVal
    var galRef = new Firebase('https://crackling-fire-8350.firebaseio.com/wallets/' + $scope.id + '/images');
    //console.log(galRef.$ref().key())
    $scope.images = $firebaseArray(galRef);
    $scope.upload = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options)
        .then(function(imageData) {
          var reqRef = DB.child('api')
            .child('imageUploads')
            .child('request')
            .push(imageData);
          var respRef = DB.child('api')
            .child('imageUploads')
            .child('response')
            .child(reqRef.key);
          var responseHandler = function(respSnap) {
            if (respSnap.exists()) {
              respRef.off('value', responseHandler);
              var response = respSnap.val();
              console.log(response);
              DB.child('wallets')
                .child($stateParams.id)
                .child('images')
                .push(response);
            }
          };
          respRef.on('value', responseHandler);
          // $scope.images.$add({ image: imageData }).then(function () {
          //   alert('Image has been uploaded');
          // });
        }, function(error) {
          console.error(error);
        });
    };
    $scope.gallery = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options)
        .then(function(imageData) {
          console.log('imageData', imageData);
          var reqRef = DB.child('api')
            .child('imageUploads')
            .child('request')
            .push(imageData);
          var respRef = DB.child('api')
            .child('imageUploads')
            .child('response')
            .child(reqRef.key());
          var responseHandler = function(respSnap) {
            if (respSnap.exists()) {
              respRef.off('value', responseHandler);
              var response = respSnap.val();
              console.log(response);
              DB.child('wallets')
                .child($stateParams.id)
                .child('images')
                .push(response);
              // deferred.resolve(response);
            }
          };
          respRef.on('value', responseHandler);
          // $scope.images.$add({ image: imageData }).then(function () {
          //   alert('Image has been uploaded');
          // });
        }, function(error) {
          console.error(error);
        })
    }
  });
