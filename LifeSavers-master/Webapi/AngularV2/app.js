'use strict';

angular.module('LifeSaver', ['ngRoute']).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/',
        {
            controller: 'dashboardController',
            controllerAs: 'dashbaordController',
            templateUrl: 'Views/dashboard.html'
        })
        .otherwise({ redirectTo: '/' });
}]);
