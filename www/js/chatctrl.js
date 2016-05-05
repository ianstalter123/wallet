app.controller('chatCtrl', function ($timeout, $scope, $rootScope, $firebaseAuth, $firebaseArray) {
  console.log('test');
  var authRef = new Firebase('https://crackling-fire-8350.firebaseio.com');
  $scope.authObj = $firebaseAuth(authRef);
  var authData = $scope.authObj.$getAuth();
  $scope.message = ' ';
  var messageRef = new Firebase('https://crackling-fire-8350.firebaseio.com/messages/');
  $scope.adder = $firebaseArray(messageRef);
  $scope.messages = [];
  var query = messageRef.orderByChild('-timestamp').limitToLast(10);
  query.on('child_added', function (snap) {
    console.log(snap.val());
    $scope.messages.unshift(snap.val());
  });
  $scope.add = function (message) {
    //console.log($scope.messages);
    //console.log(message);
    $scope.adder.$add({
      'message': message,
      'user': $rootScope.user
    });
    $timeout(function () {
      $scope.message = null;
    }, 1000);
  };
});