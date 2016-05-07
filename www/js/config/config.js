angular.module('wallet.config', [])
.constant('FirebaseConfig',
{ 'base': 'https://crackling-fire-8350.firebaseio.com',
   'paths': {
      'users': 'users',
      'wallets': 'wallets'
    }
 });
