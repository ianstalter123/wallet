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
	DB) {

	var ref = DB.child('wallets');
	$scope.wallets = $firebaseArray(ref);
	$scope.item = {};

	$scope.createWallet = function(bday, name, image) {
		console.log(bday);
		$scope.wallets.$add({
			image: $scope.loadimage,
			uid: $rootScope.id,
			birthday: bday,
			name: name
		}).then(function(data) {
            //alert("Image has been uploaded");
            //console.log(data.key());
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
            		$state.go('main');
            	}
            };

            DB
            .child('users')
            .child($rootScope.id)
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