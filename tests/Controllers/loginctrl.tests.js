describe('Wallet App', function() {
    var scope;
    var myRoot;
    var controller;
    beforeEach(function() {
        module('wallet.controllers');
        module('wallet.services');
        module("firebase");
    });
    beforeEach(module(function($provide) {
        $provide.value('FirebaseConfig', {
            'base': 'https://dev456.firebaseio.com/'
        });
    }));
    beforeEach(module(function($provide) {
        stateMock = jasmine.createSpyObj('$state spy', ['go', 'is']);
        $provide.value('$state', stateMock);
    }));
    beforeEach(module(function($provide) {
        $provide.value('HttpService');
    }));
    beforeEach(module(function($provide) {
        BoxMock = jasmine.createSpyObj('$ionicSlideBoxDelegate spy', ['update']);
        $provide.value('$ionicSlideBoxDelegate', BoxMock);
    }));
    beforeEach(module(function($provide) {
        HttpMock = jasmine.createSpyObj('HttpService spy', ["showTemporaryLoading"]);
        $provide.value('HttpService', HttpMock);
    }));
    describe('Login Ctrl', function() {
        beforeEach(inject(function($rootScope, $controller, $q, _$timeout_, _User_, DB) {
            DB = DB;
            User = _User_;
            scope = $rootScope.$new();
            myRoot = $rootScope;
            stateMock = jasmine.createSpyObj('$state spy', ['go']);
            controller = $controller('loginCtrl', {
                '$scope': scope,
                $state: stateMock,
                FirebaseConfig: { 'base': 'https://dev456.firebaseio.com/' },
                HttpService: HttpMock,
                DB: new Firebase('https://dev456.firebaseio.com/'),
                $ionicSlideBoxDelegate: BoxMock,
                $ionicHistory: {},
            });
        }));
        beforeEach(function() {});
        it('let there be scope', function() {
            expect(scope).toBeDefined();
        });
        it('you can login by email', function(done, $rootScope) {
            function authHandler(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log(User.email);
                    console.log('logged in');
                    expect(User.email).toEqual('test@test.com');
                    //expect(stateMock.go).toHaveBeenCalledWith('start');

                    DB.unauth();
                    done()
                }
            }
            var DB = new Firebase("https://dev456.firebaseio.com/");
            scope.loginEmail('test@test.com', '123456',authHandler);

            done()
        });
        xit('will redirect to create wallet after signup', function(done, $rootScope) {

            var rand = Math.random() * 10;
            var DB = new Firebase("https://dev456.firebaseio.com/");
            scope.signupEmail('ian@iane' + rand.toFixed(0) + '.com', '123456');
            expect(stateMock.go).toHaveBeenCalledWith('createWallet');
            done();
        });

    });
});
