app.controller('login', function ($rootScope, $scope, $http, $uibModal, ab, c, uiGridConstants, $timeout,) {

console.log('login')
$scope.vm = {
    formData: {
      email: '',
         password: ''
    }
};

$scope.vm.submit=()=>{
alert('submit')
}


});