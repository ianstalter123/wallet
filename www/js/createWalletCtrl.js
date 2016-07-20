angular.module('wallet.controllers')
  .controller('createWalletCtrl', function($scope,
    FirebaseConfig,
    $rootScope,
    $state,
    $firebaseArray,
    $cordovaCamera,
    $ionicSlideBoxDelegate,
    $timeout,
    $ionicHistory,
    DB,
    User) {

    var ref = DB.child('wallets');

    /*================================================
    =           Dummy image for upload box            =
    ================================================*/
    DB.child('images').child('-K9Lh1_n2XZ5de49k1bz').child('image').once('value', function(snap) {
      $scope.loadImage = snap.val();
    });


    $scope.wallets = $firebaseArray(ref);
    $scope.item = {};


    /*================================================
    =           Create a wallet            =
    ================================================*/
    $scope.createWallet = function(bday, name, image) {
      console.log(bday);
      $scope.wallets.$add({
        image: $scope.loadimage,
        uid: User.uid,
        birthday: bday,
        name: name
      }).then(function(data) {

        $scope.item.image = '';
        $scope.loadimage = '';
        name = '';
        birthday = '';

        var onComplete = function(error) {
          if (error) {
            console.log('Synchronization failed');
          } else {
            console.log('Synchronization succeeded');
            $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true
            });
            $state.go('start');
          }
        };

        /*================================================
    =           Sets users wallet id            =
    ================================================*/
        DB
          .child('users')
          .child(User.uid)
          .child('settings')
          .child('walletid')
          .set(data.key(), onComplete);
      });
    };

    $scope.capturePicture = function($event, item) {
      console.log('I am going to use the camera');
      var savePicture = function(data) {
        //Upload the data to server/convert etc.
        $timeout(function() {
          $scope.item.image = 'data:image/jpeg;base64,' + data;
          $scope.loadimage = data;
        });
      };
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
      $cordovaCamera
        .getPicture(options)
        .then(function(imageData) {
          //need to add an image to the correct wallet here
          //how do I guarantee I'm selecting the CORRECT WALLET!
          savePicture(imageData);
        }, function(error) {
          console.error(error);
        });
    };
  });
