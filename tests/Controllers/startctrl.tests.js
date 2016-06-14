describe('Wallet App', function () {
    var scope;
    var myRoot;
    var controller;
    beforeEach(function () {
        module('wallet.controllers');
        module('wallet.services');
        module("firebase");
    });

    beforeEach(module(function ($provide) {

        $provide.value('FirebaseConfig', {
            'base': 'https://dev456.firebaseio.com/'
        });

    }));
    beforeEach(module(function ($provide) {
        stateMock = jasmine.createSpyObj('$state spy', ['go','is']);
        $provide.value('$state', stateMock);
    }));

    beforeEach(module(function ($provide) {
        $provide.value('HttpService');
    }));


    describe('Start Ctrl', function () {
        beforeEach(inject(function ($rootScope, $controller, $q, _$timeout_,_User_,DB) {
            DB = DB;
            User = _User_;
            scope = $rootScope.$new();
            myRoot = $rootScope;
            stateMock = jasmine.createSpyObj('$state spy', ['go']);
            controller = $controller('startCtrl', {
                '$scope': scope,
                $state: stateMock,
                FirebaseConfig: {'base':'https://dev456.firebaseio.com/'},
                HttpService: {},
                DB: new Firebase('https://dev456.firebaseio.com/')
            });
        }));

        beforeEach(function() {

        });

        xit('let there be scope', function (done,$rootScope) {
         function authHandler(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
               console.log(User.email);
               console.log('logged in');
               done()
                 }
             }
         var DB = new Firebase("https://dev456.firebaseio.com/");
            DB.authWithPassword({
             email    : 'test@test.com',
                password : '123456'
             },authHandler);
             scope.$apply();

             expect(scope).toBeDefined();
             });
        xit('goes to profile', function () {
            scope.goProfile();
            expect(stateMock.go).toHaveBeenCalledWith('profile');
        });
        xit('goes to chat or warns', function () {
            scope.chat();
            expect(stateMock.go).toHaveBeenCalledWith('chat');
        });
        xit('goes to wallets or warns', function (done,$rootScope) {
            scope.main();
            expect(stateMock.go).toHaveBeenCalledWith('main');
            User.promise.then(function() {
                console.log(User.email);
                done();
            })

        });
        xit('logs you out', function (done,$rootScope) {
            scope.logOut();
            done()
            expect(stateMock.go).toHaveBeenCalledWith('login');
        });

    });
});
