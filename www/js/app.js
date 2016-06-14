// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('wallet', [
  'ionic',
  'wallet.config',
  'wallet.controllers',
  'wallet.services',
  'ngCordova',
  'firebase'
])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('start', {
      controller: 'startCtrl',
      url: '/',
      templateUrl: 'templates/start.html'
    })
      .state('main', {
        controller: 'mainCtrl',
        url: '/main',
        templateUrl: 'templates/main.html'
      })
      .state('show', {
        url: '/show/:id',
        templateUrl: 'templates/show.html',
        controller: 'showCtrl'
      })
      .state('edit', {
        url: '/edit/:id',
        templateUrl: 'templates/edit.html',
        controller: 'editCtrl'
      })
      .state('view', {
        url: '/view/:wallet_id/:image_id',
        templateUrl: 'templates/view.html',
        controller: 'viewCtrl'
      })
      .state('signup', {
        url: '/signup.html',
        templateUrl: 'templates/signup.html',
        controller: 'loginCtrl'
      })
      .state('createWallet', {
        url: '/createWallet.html',
        templateUrl: 'templates/createWallet.html',
        controller: 'createWalletCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })
      .state('profile', {
        cache: false,
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      })
      .state('info', {
        url: '/info/:id/:wid',
        templateUrl: 'templates/info.html',
        controller: 'infoCtrl'
      })
      .state('chat', {
        url: '/chat',
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      })
      .state('upgrades', {
        url: '/upgrades',
        templateUrl: 'templates/upgrades.html',
        controller: 'upgradesCtrl'
      })
      .state('stream', {
        url: '/stream',
        templateUrl: 'templates/stream.html',
        controller: 'streamCtrl'
      })
  })
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
