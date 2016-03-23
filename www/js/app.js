// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic',"ngCordova", "firebase"])

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('start', {
    controller: 'loginCtrl',
    url: '/',
    templateUrl: 'start.html'
  })

  $stateProvider.state('main', {
    controller: 'mainCtrl',
    url: '/main',
    templateUrl: 'main.html'
  })

  $stateProvider.state('show', {
    url: '/show/:id',
    templateUrl: 'show.html',
    controller: 'showCtrl',
  })

   $stateProvider.state('edit', {
    url: '/edit/:id',
    templateUrl: 'edit.html',
    controller: 'editCtrl',
  })

  $stateProvider.state('view', {
    url: '/view/:wallet_id/:image_id',
    templateUrl: 'view.html',
    controller: 'viewCtrl'
  })
  $stateProvider.state('signup', {
    url: '/signup.html',
    templateUrl: 'signup.html',
    controller: 'loginCtrl'
  })
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'loginCtrl'
  })
})



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
