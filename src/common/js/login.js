app.controller('login', function ($rootScope, $scope, ab, c, $timeout) {


    $scope.vm = {
        formData: {
            username: '',
            password: '',
        }
    };


    $scope.vm.submit = () => {

        $rootScope.mainapp.showWait = true;
        let macid = "";

        var networkdevcs = _os.networkInterfaces();

        for (var nw in networkdevcs) {
            if (networkdevcs[nw].filter((x) => x.family == "IPv4").length > 0) {

                for (let idx_nws = 0; idx_nws < networkdevcs[nw].length; idx_nws++) {
                    if (networkdevcs[nw][idx_nws].mac != undefined) {

                        macid = networkdevcs[nw][idx_nws].mac;

                    }
                }

                break;
            }
        }


        let hostname = _os.hostname();

        ab.httpPost(_globalApi + 'usr_signin', {
                'uname': $scope.vm.formData.username,
                'upass': $scope.vm.formData.password,
                'macid': macid,
                'hostname': hostname,
                'device_token': _settings.get('device_token', ''),
            })
            .then(r => {
                console.log(r);

                if (r != null && r.data != null) {
                    $scope.$apply(function () {
                        $rootScope.mainapp.showWait = false;
                    });
                    if (r.data.db_status == "true") {
                        _settings.set('auth_token', r.data.auth_token);

                        $scope.$apply(function () {
                            $scope.masterc.switchHard('reminder');
                        });
                    }
                }

            })
            .catch(error => {
                alert('Error Occured');
                $scope.$apply(function () {
                    $rootScope.mainapp.showWait = false;
                });

            });
    };

    $scope.vm.init = () => {
        $rootScope.mainapp.showWait = false;


    };

    $scope.vm.init();
});