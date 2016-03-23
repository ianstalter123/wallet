app.controller("mainCtrl", function($scope,$state,$ionicActionSheet,$firebaseArray,$ionicViewSwitcher,$firebaseObject,$cordovaCamera,$ionicModal) {
  //$scope.previous;
  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    // $scope.modal.show();
    // console.log('inside the then')
  });

  $scope.swipeleftAction = function() {
    $ionicViewSwitcher.nextDirection('back');
      $state.go('start');
  }

  $scope.open = function() {

    $scope.modal.show();

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
  }

  $scope.showDetails = function() {
    $ionicActionSheet.show({
      buttons: [
        { text: 'New Wallet' },
      ],
      titleText: 'Create Baby Wallet',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        if(index === 0) {
          $scope.newWallet();
        }
        return true;
      }
    })
  }

  $scope.edit = function(event) {
    $scope.id = event.target.id;


      var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");
      var authData = ref.getAuth();
      if (authData) {
        console.log("Authenticated user:", authData);
        $scope.uid = authData.auth.uid;
      }

      var galRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets/" + $scope.id);
      $scope.wallet = $firebaseObject(galRef);
      $scope.wallet.$loaded().then(function() {
        $scope.oid = $scope.wallet.uid;
        console.log($scope.oid);
        if($scope.oid === $scope.uid) {
          $state.go('edit', { "id": $scope.id});
        }
        else {
          console.log('incorrect user');
        }

      });






  }

  $scope.view = function() {
    $scope.id = $('.selected').attr('id');
    $state.go('show', { "id": $scope.id});
  }

  $scope.selectMe = function(e) {
    //console.log($scope.previous);
    $($scope.previous).removeClass('selected');
    e.preventDefault();
    //console.log(e.target)
    if(!$(e.target).hasClass('selected')) {
      e.target.className += ' selected'

    } else {
      e.target.className = ''
    }
    //$state.go('show')
    console.log('hello');
    $scope.previous = e.target;
  }

  var walletRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets");
  $scope.wallets = $firebaseArray(walletRef)

  $scope.newWallet = function() {

    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };

    //title:title -> below image should also load a title for wallet data

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.wallets.$add({image: imageData}).then(function() {
        alert("Image has been uploaded");
      });
    }, function(error) {
      console.error(error);
    });

  }

  $scope.upload = function() {
    //scope.upload needs to determine the :id of current wallet
    //and upload images to that wallet. bam.
    // get the wallet id from the URL params.
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.images.$add({image: imageData}).then(function() {
        alert("Image has been uploaded");
      });
    }, function(error) {
      console.error(error);
    });
  }
  $scope.gallery = function() {
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.images.$add({image: imageData}).then(function() {
        alert("Image has been uploaded");
      });
    }, function(error) {
      console.error(error);
    });
  }

});
