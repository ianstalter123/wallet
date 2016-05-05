angular.module('main.controller', [])

app.controller("mainCtrl", function($ionicPopup,
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
            $rootScope) {

            $scope.test = "hello";
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

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
                // $scope.modal.show();
                // console.log('inside the then')
            });

            // $scope.swipeleftAction = function() {
            //   $ionicViewSwitcher.nextDirection('back');
            //   $state.go('start');
            // }

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

            $scope.join = function(event) {
                var ref = new Firebase(FirebaseConfig.base);
                var obj = $firebaseAuth(ref);
                var data = obj.$getAuth();
                $rootScope.id = data.uid;
                console.log(event);
                var delRef = new Firebase('https://crackling-fire-8350.firebaseio.com/wallets/' + event + '/uid');
                var del = $firebaseObject(delRef);
                del.$loaded(function(data) {
                  console.log(data.$value);
                  console.log($rootScope.id);
                        if (data.$value === $rootScope.id) {
                            $ionicPopup.alert({
                                title: 'Already yours',
                                template: "You can't join your own wallet!!!"
                            })
                        } else {

                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Want to join?',
                                template: 'Send a request to the wallet owner'
                            });

                            confirmPopup.then(function(res) {
                                if (res) {

                                    $ionicPopup.alert({
                                        title: 'Sent',
                                        template: 'Request sent'
                                    });
                                } else {

                                }
                            });
                        }
                    })
                }



                $scope.delete = function(event) {

                    //console.log(event);

                    var delRef = new Firebase('https://crackling-fire-8350.firebaseio.com/wallets/' + event + '/uid');
                    var del = $firebaseObject(delRef);

                    del.$loaded(function(data) {
                        //console.log(data.$value);

                        if ($rootScope.id === data.$value) {
                            var delMe = new Firebase('https://crackling-fire-8350.firebaseio.com/wallets/' + event);
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
                    })

                }

                $scope.showDetails = function() {
                    $ionicActionSheet.show({
                        buttons: [
                            { text: 'New Wallet' },
                        ],
                        titleText: 'Create Baby Wallet',
                        cancelText: 'Cancel',
                        buttonClicked: function(index) {
                            if (index === 0) {
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
                        if ($scope.oid === $scope.uid) {
                            $state.go('edit', { "id": $scope.id });
                        } else {
                            console.log('incorrect user');
                        }

                    });






                }

                $scope.view = function() {
                    $scope.id = $('.selected').attr('id');
                    $state.go('show', { "id": $scope.id });
                }

                // $scope.selectMe = function(e) {
                //   //console.log($scope.previous);
                //   $($scope.previous).removeClass('selected');
                //   e.preventDefault();
                //   //console.log(e.target)
                //   if(!$(e.target).hasClass('selected')) {
                //     e.target.className += ' selected'

                //   } else {
                //     e.target.className = ''
                //   }
                //   //$state.go('show')
                //   console.log('hello');
                //   $scope.previous = e.target;
                // }

                var walletRef = new Firebase("https://crackling-fire-8350.firebaseio.com/wallets");
                $scope.wallets = $firebaseArray(walletRef)

                $scope.wallets.$loaded(
                    function(data) {

                        $ionicLoading.hide();

                    }
                );


                $scope.newWallet = function() {
                    $scope.new = true;
                    // need to conditionally create a wallet only if the user doesn't have
                    // a wallet
                    var ref = new Firebase(FirebaseConfig.base + "/wallets")
                    $scope.id = $rootScope.id;
                    console.log($scope.id);
                    ref.orderByChild("uid").equalTo($scope.id).on("child_added", function(snapshot) {
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
                            $scope.wallets.$add({ image: imageData, uid: $rootScope.id }).then(function(data) {
                                //alert("Image has been uploaded");
                                //console.log(data.key());
                                $scope.new = false;
                                $timeout(
                                    function() {
                                        $state.go('edit', { id: data.key() });
                                    }, 1000);

                            });
                        }, function(error) {
                            console.error(error);
                        });
                    }
                }

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
                        $scope.images.$add({ image: imageData }).then(function() {
                            //alert("Image has been uploaded");
                        });
                    }, function(error) {
                        console.error(error);
                    });
                }

            });
