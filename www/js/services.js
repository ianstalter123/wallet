app.factory('authService', function (Firebase,$firebaseAuth) {
 var ref = new Firebase("https://crackling-fire-8350.firebaseio.com");
 var obj = $firebaseAuth(ref);
 var data = obj.$getAuth();
 return {
  authData : data,
  loggedIn: 'false'
};
})
