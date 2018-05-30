app.controller('login', function ($rootScope, $scope, ab, c, $timeout) {


    $scope.vm = {
        formData: {
            username: '',
            password: '',
        }
    };

    $scope.vm.submit = () => {

        //$scope.masterc.switchHard('landing', 'login-in-progress');

        let macid = "";
        if (_os.networkInterfaces().Ethernet.filter((x) => x.family == "IPv4").length > 0) {
            macid = _os.networkInterfaces().Ethernet.filter((x) => x.family == "IPv4")[0].mac;
        }

        let hostname = _os.hostname();

        ab.httpPost(_globalApiDev + 'usr_signin', {
                'uname': $scope.vm.formData.username,
                'upass': $scope.vm.formData.password,
                'macid': macid,
                'hostname': hostname,
                'device_token': _settings.get('device_token', ''),
            })
            .then(r => {
                console.log(r);

                if (r != null && r.data != null) {

                    if (r.data.db_status == "true") {
                        _settings.set('auth_token', r.data.auth_token);
                        $timeout(()=>{
                            $scope.masterc.switchHard('reminder', '1');

                        },1000);

                    }
                }

            })
            .catch(error => {
                console.log(error);
                alert('hi');
                $scope.masterc.toShow = "login";

            });
    };


});