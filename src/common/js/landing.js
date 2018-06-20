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

        isOnline({
            timeout: 5000,
        }).then(online => {
            _settings.set('net_status_otwl', online);

            if (!online) {

                let myNotificationErrsng = new window.Notification('Error ' + new Date().toDateString().replace(/ /gi, "-"), {
                    body: 'No Internet Connection -- > Displaying Data that is old'
                });
            }
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
        });

    };


    $scope.landing.init();


});