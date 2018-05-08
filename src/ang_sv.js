app.factory('ab', function ($http, $q, $timeout, $rootScope, $uibModal, $location, $filter, $log) {

    var factory = {};

    factory.reset_form = function (form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
    }

    factory.ajx = function (webm, dataparams) {
        return $http({
            method: "POST",
            url: webm,
            dataType: 'json',
            data: dataparams,
            headers: { "Content-Type": "application/json" }

        })
    };

    return factory;

});


//console log 
app.factory('c', function ($http, $q, $timeout, $rootScope, $uibModal, $location, $filter, $log) {

    var factory = function (form) {
        console.log(form);
    }

    return factory;

});
