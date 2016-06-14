angular.module('wallet.controllers')
  .controller('mainCtrl', function($ionicPopup,
    $timeout,
    $scope,
    $state,
    FirebaseConfig,
    User,
    $ionicActionSheet,
    $firebaseArray,
    $ionicViewSwitcher,
    $firebaseObject,
    $cordovaCamera,
    $ionicModal,
    $ionicLoading,
    $ionicHistory,
    $firebaseAuth,
    HttpService,
    $rootScope,
    $ionicListDelegate,
    DB
  ) {


    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      $ionicHistory.clearHistory();
      viewData.enableBack = true;
      HttpService.showTemporaryLoading('Loading...');
      $ionicListDelegate.closeOptionButtons();

      $scope.myWalId = User.wallet.id;
      $scope.wallets = User.wallets;


    });

    $scope.showDetails = function() {
      $ionicActionSheet.show({
        buttons: [{
          text: 'New Wallet'
        }],
        titleText: 'Create Baby Wallet',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          if (index === 0) {
            $scope.newWallet();
          }
          return true;
        }
      });
    };

    $scope.giveLove = function(event) {
      console.log('giving love');
      $scope.loveid = event.target.id;
      console.log($scope.loveid);
      DB.child('wallets')
        .child($scope.loveid)
        .child('likes')
        .once('value', function(snap) {
          console.log('value');
          if (snap.child(User.uid).exists()) {
            console.log('already liked');
          } else {
            console.log('liking');
            var like = {};
            if (snap.child('count').exists()) {
              var count = snap.val().count;
            } else {
              var count = 0;
            }
            count = count + 1;
            console.log('new count', count);

            like[User.uid] = 'true';
            like['count'] = count;
            DB.child('wallets').child($scope.loveid).child('likes').update(like);
            //do same thing on the local copy
            for (var i = 0; i < $scope.wallets.length; i++) {
              if ($scope.wallets[i].$id === $scope.loveid) {
                $scope.wallets[i].likes = like;
              }
            }
          }
        })

    };

    $scope.info = function(walletId) {
      console.log('info time');
      DB
        .child('wallets')
        .child(walletId)
        .child('uid')
        .on('value', function(idsnap) {
          console.log(idsnap.val());
          $state.go('info', {
            'id': idsnap.val(),
            'wid': walletId
          });
        })

    }

    $scope.join = function(walletId) {
      $ionicListDelegate.closeOptionButtons()
      User.uid = User.uid;
      console.log(walletId);

      //check if you are a member of wallet clicked
      DB
        .child('wallets')
        .child(walletId)
        .child('joined')
        .child(User.uid)
        .once("value", function(snapshot) {
          $scope.areMember = snapshot.exists();
          console.log('exists: ', $scope.areMember);
        })


      //checks to see if your user id is equal to the wallet id
      //else asks if you want to join
      DB
        .child('wallets')
        .child(walletId)
        .child('uid')
        .once('value', function(snap) {
          if (snap.val() === User.uid || $scope.areMember) {
            $ionicPopup.alert({
              title: 'Already a member',
              template: 'You are already a part of this wallet'
            });
          } else {
            var confirmPopup = $ionicPopup.confirm({
              title: 'Want to join?',
              template: 'Send a request to the wallet owner'
            });
            confirmPopup.then(function(res) {
              if (res) {
                var nameRef = DB.child('wallets')
                  .child(walletId)
                  .child('name');
                //also sets the wallet joined with your id
                DB.child('wallets')
                  .child(walletId)
                  .child('joined')
                  .child(User.uid)
                  .set('true');
                //sets the wallet to your id
                //combine these 2 below?
                DB.child("users")
                  .child(User.uid)
                  .child("wallets")
                  .child('wallets')
                  .child(walletId)
                  .set('true');

                //so we have the wallet ids of joined wallets
                //next question is, how do we actually
                //add a listener for each one of the wallets ?

                nameRef.on('value', function(snap) {
                  DB.child("users")
                    .child(User.uid)
                    .child("wallets")
                    .child('wallets')
                    .child(walletId)
                    .child('name')
                    .set(snap.val());
                })

                $ionicPopup.alert({
                  title: 'Sent',
                  template: 'Request sent'
                });
              } else {}
            });
          }
        });
    };

    $scope.delete = function(event) {
      //console.log(event);
      var delRef = new Firebase(FirebaseConfig.base + '/wallets/' + event + '/uid');
      var del = $firebaseObject(delRef);
      del.$loaded(function(data) {
        //console.log(data.$value);
        if (User.uid === data.$value) {
          var delMe = new Firebase(FirebaseConfig.base + '/wallets/' + event);
          var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Are you sure you want to delete your wallet?'
          });
          confirmPopup.then(function(res) {
            if (res) {
              delMe.remove();
              $ionicPopup.alert({
                title: 'Removed',
                template: 'Wallet removed'
              });
            } else {
              $ionicPopup.alert({
                title: 'Not Removed',
                template: 'Wallet not removed'
              });
            }
          });
        } else {
          $ionicPopup.alert({
            title: 'Not your wallet',
            template: 'Not your wallet'
          });
        }
      });
    };


    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
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
        $scope.$on('modal.hidden', function() {});
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {});
      };





      $scope.view = function() {
        $scope.thisId = $('.selected').attr('id');
        $state.go('show', {
          'id': $scope.thisId
        });
      };

      $scope.newWallet = function() {
        $scope.new = true;
        //console.log($scope.id);

        if (User.wallet.id !== undefined) {
          console.log(snapshot.val());
          $scope.new = false;
          $ionicPopup.alert({
            title: 'You already have a wallet',
            template: 'Only 1 wallet allowed!'
          });
        }

        if ($scope.new === true) {
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
          //title:title -> below image should also load a title for wallet data
          //check if there is not already a wallet
          $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.wallets.$add({
              image: imageData,
              uid: User.uid
            }).then(function(data) {

              DB
                .child('users')
                .child(User.uid)
                .child('walletid')
                .set(data.key())


              $scope.new = false;
              $timeout(function() {
                $state.go('edit', {
                  id: data.key()
                });
              }, 1000);
            });
          }, function(error) {
            console.error(error);
          });
        }
      };
      $scope.upload = function() {
        //scope.upload needs to determine the :id of current wallet
        //and upload images to that wallet. bam.
        // get the wallet id from the URL params.
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
          $scope.images.$add({
            image: imageData
          }).then(function() {
            alert('Image has been uploaded');
          });
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
            $scope.images.$add({
              image: imageData
            }).then(function() {});
          }, function(error) {
            console.error(error);
          });
      };
    })
  })
