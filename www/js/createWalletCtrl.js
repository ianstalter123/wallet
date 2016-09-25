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
      User,
      HttpService,
      ionicDatePicker,
      $filter,
      ImageClient) {

      var ref = DB.child('wallets');

      /*================================================
    =           Dummy image for upload box            =
    ================================================*/
      DB.child('images')
        .child('-K9Lh1_n2XZ5de49k1bz')
        .child('image')
        .once('value', function(snap) {
          $scope.loadImage = snap.val();
        });


      $scope.wallets = $firebaseArray(ref);
      $scope.item = {};

      /*====================================================
    =            Date callback for datepicker            =
    ====================================================*/


      $scope.selectedDate = '';

      $scope.$watch('selectedDate', function(newValue) {
        $scope.selectedDate = $filter('date')(newValue, 'medium');
      });

      var ipObj1 = {
        callback: function(val) { //Mandatory
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
          $scope.selectedDate = new Date(val);
          console.log('date', $scope.selectedDate);
        }
      };
      $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker(ipObj1);
      };


      /*================================================
    =           Sets new wallet object  (push)         =
    ================================================*/
      $scope.createWallet = function(bday, name, image) {
        console.log(bday);
        $scope.wallets.$add({
          imageUrl: $scope.loadimage,
          uid: User.uid,
          birthday: $scope.selectedDate,
          name: name
        })
          .then(function(data) {

            $scope.item.imageUrl = '';
            $scope.loadimage = '';
            name = '';
            $scope.selectedDate = '';

            /*=============================================================
    =            On complete unauth and prompts login            =
     =============================================================*/




            var onComplete = function(error) {
              if (error) {
                console.log('Synchronization failed');
              } else {
                console.log('Synchronization succeeded');
                $ionicHistory.nextViewOptions({
                  disableAnimate: true,
                  disableBack: true
                });
                DB.unauth();
                HttpService.alertPopup('sign in', 'sign in with your new account to start adding images');
                $state.go('login');
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

      /*==================================================================
=            Function to save picture locally and to FB            =
==================================================================*/



      $scope.capturePicture = function($event, item) {
        console.log('I am going to use the camera');
        var savePicture = function(data) {
          //Upload the data to server/convert etc.
          $timeout(function() {
            $scope.item.imageUrl = data.imageUrl;
            $scope.loadimage = data.imageUrl;
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
        $cordovaCamera.getPicture(options)


      .then(function(imageData) {
          ImageClient.createImage(imageData)
            .then(function(response) {
              savePicture(response);
            })

        };
        });
