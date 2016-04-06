app.controller('chatCtrl', function($scope,$rootScope,$firebaseAuth,$firebaseArray) {
  console.log('test');
  var authRef = new Firebase("https://crackling-fire-8350.firebaseio.com");
  $scope.authObj = $firebaseAuth(authRef);
  var authData = $scope.authObj.$getAuth();

  var messageRef = new Firebase("https://crackling-fire-8350.firebaseio.com/messages/");
  $scope.messages = $firebaseArray(messageRef);

    $scope.add = function(message) {
      console.log($scope.messages);
      console.log(message);
      $scope.messages.$add({'message': message, 'user': $rootScope.user })
      $scope.message = '';
    }

  })
