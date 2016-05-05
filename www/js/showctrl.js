app.controller('showCtrl',
    function($scope,
        $ionicPopup,
        FirebaseConfig,
        $firebaseAuth,
        authService,
        $state,
        $rootScope,
        $stateParams,
        $firebaseArray,
        $firebaseObject,
        $ionicActionSheet,
        $cordovaCamera) {
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
                        buttons: [
                            { text: 'Camera' },
                            { text: 'Gallery' },
                        ],
                        titleText: 'Create Baby Wallet',
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
                    })
                } else {
                    $ionicPopup.alert({
                        title: "You haven't joined this wallet!",
                        template: 'Join first.'
                    });
                }
            })
        }
        $scope.id = $stateParams.id; //getting fooVal
        var galRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/" + $scope.id + "/images");
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
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.images.$add({ image: imageData }).then(function() {
                    alert("Image has been uploaded");
                });
            }, function(error) {
                console.error(error);
            });
        }
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
            $cordovaCamera.getPicture(options).then(function(imageData) {
                //need to add an image to the correct wallet here
                //how do I guarantee I'm selecting the CORRECT WALLET!
                $scope.images.$add({ image: imageData }).then(function() {
                    alert("Image has been uploaded");
                });
            }, function(error) {
                console.error(error);
            });
        }
    })
