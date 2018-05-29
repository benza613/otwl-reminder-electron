
app.controller('login', function ($rootScope, $scope, $http, $uibModal, ab, c, uiGridConstants, $timeout, ) {


    $scope.vm = {
        formData: {
            email: '',
            password: ''
        }
    };

    $scope.vm.submit = () => {

        // const params = new URLSearchParams();
        // params.append('auth_token', 'F068B6AF-BC7E-45E7-A18C-A47B6C8A4E7B');



        // axios({
        //     method: 'post',
        //     url: 'http://otwlfrt4.azurewebsites.net/api/ocean/sp_MA_GetJobs',
        //     data: params,
        //     config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        // })

        ab.httpPost('http://otwlfrt4.azurewebsites.net/api/ocean/sp_MA_GetJobs', {
            'auth_token': 'F068B6AF-BC7E-45E7-A18C-A47B6C8A4E7B'
        })
            .then(response => {
                console.log(response)
                console.log('ben')

            })
            .catch(error => {
                console.log(error);
            });
    }


});