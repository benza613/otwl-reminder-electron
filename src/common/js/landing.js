app.controller('landing', function ($rootScope, $scope, ab, c, $q, $timeout) {
    $scope.close();

    $scope.landing = {
        banner: "Kindly wait while we authenticate your credentials...",
    };

    $scope.landing.circularProg = false;

    $scope.landing.init = function () {

        let rem_token = _settings.get('device_token');

        if (rem_token == undefined || rem_token == '') {
            $scope.masterc.switchHard('login');
        } else {
            $scope.landing.fnautologin();
        }
    };


    $scope.landing.fnautologin = () => {

        let macid = "";
        if (_os.networkInterfaces().Ethernet.filter((x) => x.family == "IPv4").length > 0) {
            macid = _os.networkInterfaces().Ethernet.filter((x) => x.family == "IPv4")[0].mac;
        }

        let hostname = _os.hostname();

        ab.httpPost(_globalApi + 'usr_signin_auto', {
                'macid': macid,
                'hostname': hostname,
                'auth_token': _settings.get('auth_token', ''),
            })
            .then(r => {
                console.log(r);

                if (r != null && r.data != null) {
                    //auto login valid
                    if (r.data.db_status == "true") {

                        $scope.$apply(function () {
                            $scope.masterc.switchHard('reminder');
                        });
                        
                    } else {
                        $scope.$apply(function () {
                            $scope.masterc.switchHard('login');
                        });
                    }
                }

            })
            .catch(error => {
                let myNotificationErr = new window.Notification('Error Occured', {
                    body: 'Could Not sync Data'
                });

                myNotificationErr.onclick = () => {
                    console.log('Notification clicked');
                };
                $scope.$apply(function () {
                    $scope.masterc.switchHard('login');
                });

            });
    };


    $scope.landing.init();


});