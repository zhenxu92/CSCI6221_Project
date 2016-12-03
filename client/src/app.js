import angular from 'angular'
import 'angular-ui-router'

angular.module('olympics', ["ui.router"])
    .config(($stateProvider, $urlRouterProvider) => {
        $urlRouterProvider.otherwise("/index");
        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: 'sports/slideshow.html',
                resolve: {
                    sportsService: function ($http) {
                        return $http.get('/people');
                    }
                },
                controller: function (sportsService) {
                    this.sports = sportsService.data;
                },
                controllerAs: 'sportsCtrl'
            })
            .state('people', {
                url: '/people',
                templateUrl:'sports/sports-medals.html',
                resolve: {
                    sportsService: function ($http) {
                        return $http.get('/people');
                    }
                },
                controller: function (sportsService) {
                    this.sports = sportsService.data;
                },
                controllerAs: 'sportsCtrl'
            })
            .state('organization', {
                url:'/organization',
                templateUrl:'sports/organization.html',
                resolve: {
                    sportsService: function ($http) {
                        return $http.get('/organizations');
                    }
                },
                controller: function (sportsService) {
                    this.sports = sportsService.data;
                },
                controllerAs: 'sportsCtrl'
            })
            .state('fact', {
                url:'/fact',
                templateUrl:'sports/fact.html',
            })
            .state('listOfOrgs', {
                url:'/listOfOrgs',
                templateUrl:'sports/listOfOrgs.html',
                resolve: {
                    sportsService: function ($http) {
                        return $http.get('/organizations');
                    }
                },
                controller: function (sportsService) {
                    this.sports = sportsService.data;
                },
                controllerAs: 'sportsCtrl'
            })
            .state('listOfPeople', {
                url: '/listOfPeople',
                templateUrl:'sports/listOfPeople.html',
                resolve: {
                    sportsService: function ($http) {
                        return $http.get('/people');
                    }
                },
                controller: function (sportsService) {
                    this.sports = sportsService.data;
                },
                controllerAs: 'sportsCtrl'
            })
            .state('orgApply', {
                url:'/orgApply',
                templateUrl:'sports/orgApply.html',
                resolve: {
                    sportsService: function ($http) {
                        return $http.get('/organizations');
                    }
                },
                controller: function (sportsService) {
                    this.sports = sportsService.data;
                },
                controllerAs: 'sportsCtrl'
            })
            .state('peopleApply', {
                url: '/peopleApply',
                templateUrl:'sports/peopleApply.html',
                resolve: {
                    sportsService: function ($http) {
                        return $http.get('/people');
                    }
                },
                controller: function (sportsService) {
                    this.sports = sportsService.data;
                },
                controllerAs: 'sportsCtrl'
            })

});
        

