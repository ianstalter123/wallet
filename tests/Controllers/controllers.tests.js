describe('mainctrl', function(){
    var scope;

    // load the controller's module
    beforeEach(module('main.controller'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('mainCtrl', {$scope: scope});
    }));

    // tests start here
    it('scope.test should equal test(string)', function(){
        expect(scope.test).toEqual('test');
    });
});
