angular.module('wallet.controllers')
.controller('mainCtrl', function($ionicPopup,
  $timeout,
  $scope,
  $state,
  FirebaseConfig,
  $ionicActionSheet,
  $firebaseArray,
  $ionicViewSwitcher,
  $firebaseObject,
  $cordovaCamera,
  $ionicModal,
  $ionicLoading,
  $firebaseAuth,
  HttpService,
  $rootScope,
  $ionicListDelegate,
  DB
  ) {


  $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
    viewData.enableBack = true;
    HttpService.showTemporaryLoading('Loading...');
    $ionicListDelegate.closeOptionButtons();
  });

  var obj = $firebaseAuth(DB);
  var data = obj.$getAuth();
  $rootScope.id = data.uid;

  $scope.sayHello = function(e) {

    e.preventDefault();
    console.log('hello heart!');
  }

  //getting my wallet value
  DB
  .child('users')
  .child(data.uid)
  .child('settings')
  .child('walletid')
  .on('value', function(val) {
    $scope.myWalId = val.val();
    console.log('mywal', val.val());
  })

  $scope.itemButtons = [{
    text: 'Edit',
    type: 'Button',
    onTap: function(item) {
      alert('Edit Item');
    }
  }, {
    text: 'Share',
    type: 'Button',
    onTap: function(item) {
          //test this
          $scope.delete(item);
        }
      }];
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
        $scope.info = function(walletId) {
          DB
          .child('wallets')
          .child(walletId)
          .child('uid')
          .on('value',function(idsnap) {
            console.log(idsnap.val());
            $state.go('info', {'id': idsnap.val(),'wid':walletId});
          })

        }
        $scope.join = function(walletId) {
         $ionicListDelegate.closeOptionButtons()
         var obj = $firebaseAuth(DB);
         var data = obj.$getAuth();
         $rootScope.id = data.uid;
         console.log(walletId);

          //check if you are a member of wallet clicked
          DB
          .child('wallets')
          .child(walletId)
          .child('joined')
          .child(data.uid)
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
          .on('value', function(snap) {
            if (snap.val() === $rootScope.id || $scope.areMember) {
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
                  .child(walletId).
                  child('name');
                              //also sets the wallet joined with your id
                              DB.child('wallets')
                              .child(walletId)
                              .child('joined')
                              .child($rootScope.id)
                              .set('true');
                              //sets the wallet to your id

                              DB.child("users")
                              .child($rootScope.id)
                              .child("wallets")
                              .child('wallets')
                              .child(walletId)
                              .set('true');

                              nameRef.on('value', function(snap) {
                                DB.child("users")
                                .child($rootScope.id)
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
              if ($rootScope.id === data.$value) {
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
        $scope.edit = function(event) {
          $scope.id = event.target.id;

          var authData = ref.getAuth();
          if (authData) {
            console.log('Authenticated user:', authData);
            $scope.uid = authData.auth.uid;
          }
          var galRef = new Firebase(FirebaseConfig.base + '/wallets/' + $scope.id);
          $scope.wallet = $firebaseObject(galRef);
          $scope.wallet.$loaded().then(function() {
            $scope.oid = $scope.wallet.uid;
            console.log($scope.oid);
            if ($scope.oid === $scope.uid) {
              $state.go('edit', {
                'id': $scope.id
              });
            } else {
              console.log('incorrect user');
            }
          });
        };

        $scope.giveLove = function(event) {
          $scope.id = event.target.id;
          console.log($scope.id);
          DB.child('wallets')
          .child($scope.id)
          .child('likes')
          .once('value',function(snap) {
            console.log('value');
            if(snap.child($rootScope.id).exists()) {
              console.log('already liked');
            }
            else {
              console.log('liking');
              var like = {};           
              var myid = $rootScope.id;
              if(snap.child('count').exists()) {
                var count = snap.val().count;
              } else {
                var count = 0;

              }
              count = count + 1;

              like[myid] = 'true';
              like['count'] = count;
              DB.child('wallets').child($scope.id).child('likes').update(like);
            }
          })

        };
        $scope.view = function() {
          $scope.id = $('.selected').attr('id');
          $state.go('show', {
            'id': $scope.id
          });
        };

        var walletRef = DB.child('wallets');
        $scope.wallets = $firebaseArray(walletRef);

        var obj = $firebaseAuth(DB);
        var data = obj.$getAuth();
        console.log(data.uid);

        $scope.newWallet = function() {
          $scope.new = true;
          $scope.id = $rootScope.id;
          console.log($scope.id);
          DB.child('wallets')
          .orderByChild('uid')
          .equalTo($scope.id)
          .on('child_added', function(snapshot) {
            $scope.key = snapshot.key();
            $scope.wid = $scope.key;
              //console.log($scope.wid);
              //console.log('val:', snapshot.val())
              if (snapshot.val()) {
                console.log(snapshot.val());
                $scope.new = false;
                $ionicPopup.alert({
                  title: 'You already have a wallet',
                  template: 'Only 1 wallet allowed!'
                });
              }
            });
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
                  uid: $rootScope.id
                }).then(function(data) {
                  var authData = ref.getAuth();
                  if (authData) {
                    console.log('Authenticated user:', authData);
                    $scope.uid = authData.auth.uid;
                    DB
                    .child('users')
                    .child($scope.uid)
                    .child('walletid')
                    .set(data.key())
                  }



                      //alert("Image has been uploaded");
                      //console.log(data.key());
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
