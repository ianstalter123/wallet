angular.module('wallet.services')

/*=============================================
    =    Client for approving receipts            =
    =============================================*/

.service('ImageClient', function($q) {

  /*=============================================
    =                  =
    =          Returns a response from server     =
    =============================================*/
  var ic = {

    createImage: function(image) {
      console.log('in the image client',
        receiptId);
      var uploadImagePath = 'api/imageUploads';
      var deferred = $q.defer();

      var request = {
        image: image,
      };

      console.log('request', request);

      var imageUploadRef = DB
        .child(uploadImagePath)
        .child('request')
        .push(request);

      var responseRef = DB
        .child(uploadImagePath)
        .child('response')
        .child(imageUploadRef.key());

      var responseHandler = function(responseSnap) {
        if (responseSnap.exists()) {
          var response = responseSnap.val();
          console.log('response', response);
          if (response.error()) {
            deferred.reject(response.error())
          } else {
            deferred.resolve(response);
          }
        }
      }
      responseRef.on('value', responseHandler);
      return deferred.promise;
    }
  };
  return ic;

});
