var app = angular.module('otwlApp', ['ngAnimate', 'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.bootstrap', 'ngMaterial', 'ngMessages', 'ngAria', 'material.svgAssetsCache']);

// to Disable Caching
app.config(['$httpProvider', '$compileProvider', '$mdThemingProvider', function ($httpProvider, $compileProvider, $mdThemingProvider) {


    $compileProvider.debugInfoEnabled(false);

    //add .dark() in the end for theming

    $mdThemingProvider.definePalette('mcgpalette0', {
        '50': 'e0edf3',
        '100': 'b3d1e0',
        '200': '80b3cc',
        '300': '4d94b8',
        '400': '267da8',
        '500': '006699',
        '600': '005e91',
        '700': '005386',
        '800': '00497c',
        '900': '00386b',
        'A100': '9ac6ff',
        'A200': '67aaff',
        'A400': '348dff',
        'A700': '1a7fff',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            'A100',
            'A200'
        ],
        'contrastLightColors': [
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
            'A400',
            'A700'
        ]
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('mcgpalette0')
        .accentPalette('red');



    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Sat, 01 Jan 2000 00:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get.Pragma = 'no-cache';
    //EOF disable IE ajax request caching

    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

}]);


app.directive('loadingScreen01', function () {
    return {
        restrict: 'E',

        template: function (elem, attr) {

            return `<div id="showwait" ng-show="mainapp.showWait" class="loading_screen_showwait" style="text-align: center">
            <h2 style="color:#006699">
                Ocean Transworld Reminder 
            </h2>
            <h4>
                Kindly wait while we authenticate your credentials...
            </h4>
            <div class="col-sm-12">
                <md-progress-linear md-mode="indeterminate" ng-disabled="!mainapp.showWait"></md-progress-linear>
            </div>
        </div>`;
        }
    };
});

app.directive('checkNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

app.directive('jaccessibleForm', function ($timeout) {
    return {
        restrict: 'A',

        link: function (scope, elem) {

            elem.on('submit', function () {
                $timeout(function () {
                    $('input.ng-invalid').first().focus();

                });
            });
        }
    };
});

app.filter('trustedHtml', function ($sce) {
    return function (value) {
        return $sce.trustAsHtml(value);
    };
});