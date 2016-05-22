.factory('User', function(DB, $state, HttpService, $timeout) {

    var baseRef = DB;
    var user = {};

    console.log("User service initialized");

    function authCallback(auth) {
      if (auth) {
        console.log("Authenticated", auth);
        var email = auth[auth.provider].email;
        var name;

        if (auth.provider == 'password') {
          name = email.replace(/@.*/, '');
        } else {
          name = auth[auth.provider].displayName;
        }

        user.profile_image = auth[auth.provider].profileImageURL;
        user.auth = auth;
        user.uid = auth.uid;
        user.email = email;
        user.name = name;
        user.apiDB = baseRef;

        console.log('setting value listener');


        user.userPath = 'users/' + auth.uid;

        var settingsRef = baseRef.child('users')
          .child(auth.uid)
          .child('settings');
        var settings = null;

        var updateSettings = function(snap) {
          user.settings = snap;
        };

        //user.verified = false;


        var changeState = function(snap) {
          console.log(snap.val());


          userVerifiedPromise.then(function() {
            if (snap.exists()) {
              console.log("updating settings snapshot");
              updateSettings(snap);
              console.log(user.settings);

              $state.go('app.myitems');
            } else {
              if (!snap.exists()) {
                $state.go('signup');
                //TODO: @ian  Create the user object pick data from the google object to set
              } else if (!user.verified) {
                $state.go('verify');
              } else {
                $state.go('createHome');
              }
            }
          });
        };

        user.promise = settingsRef.once('value')
          .then(changeState);

        settingsRef.on('value', updateSettings);

      } else {
        //Unauthenticated
        console.log("Unauthenticated");


        delete user.auth;
        delete user.uid;
        delete user.email;
        delete user.name;
        delete user.userPath;
        delete user.profile_image;


        if (!$state.is('login')) {
          console.log('going to login state');
          $state.go('login');
        }
      }
    }

    baseRef.onAuth(authCallback);

    return user;

  })
