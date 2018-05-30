app.factory('ab', function ($http, $q, $timeout, $rootScope, $uibModal, $location, $filter, $log) {

    var factory = {};

    factory.reset_form = function (form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
    };

    factory.ajx = function (webm, dataparams) {
        return $http({
            method: "POST",
            url: webm,
            dataType: 'json',
            data: dataparams,
            headers: { "Content-Type": "application/json" }

        });
    };

    factory.httpPost = (webm, dataparams) => {
        const params = new URLSearchParams();
        for (var key in dataparams) {
            if (dataparams.hasOwnProperty(key)) {
                console.log(key + " -> " + dataparams[key]);
                params.append(key, dataparams[key]);
            }
        }

        return axios({
            method: 'post',
            url: webm,
            data: params,
            config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        });

    };

    return factory;

});


//console log 
app.factory('c', function ($http, $q, $timeout, $rootScope, $uibModal, $location, $filter, $log) {

    var factory = function (form) {
        console.log(form);
    };

    return factory;

});
