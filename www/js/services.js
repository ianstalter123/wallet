app.factory('authService', function (Firebase,$firebaseAuth,$rootScope,FirebaseConfig) {
 var ref = new Firebase(FirebaseConfig.base);
 var obj = $firebaseAuth(ref);
 var data = obj.$getAuth();

 function checkAuth() {
  if (data && data.hasOwnProperty("google")) {
    $rootScope.loggedIn = true;
    console.log(data);
    $rootScope.current = data.google.displayName;
    $rootScope.user = data.google.displayName;
    $rootScope.profileImageURL = data.google.profileImageURL;
  } else if (data) {
    $rootScope.loggedIn = true;
    $rootScope.current = data.password.email;
    $rootScope.user = data.password.email;
    $rootScope.profileImageURL = data.password.profileImageURL;
    console.log(data);
  }
  else {
    $rootScope.loggedIn = false;
  }
}

checkAuth();

return {
  authData : data,
  loggedIn: 'false'
};
})
