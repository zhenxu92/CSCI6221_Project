import angular from 'angular'
import 'angular-ui-router'

angular.module('olympics', ["ui.router"])
    .config(($stateProvider, $urlRouterProvider) => {
        $urlRouterProvider.otherwise("/index");
        $stateProvider
//            .state('sports', {
//                url: '/sports',
//                templateUrl: 'sports/sports-nav.html',
//                resolve: {
//                    sportsService: function ($http) {
//                        return $http.get('/sports');
//                    }
//
//                },
//                controller: function (sportsService) {
//                    this.sports = sportsService.data;
//
//                },
//                controllerAs: 'sportsCtrl'
//            })
            .state('index', {
                url: '/index',
                templateUrl: 'sports/sports-nav.html',
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
//            .state('sports.medals', {
//                url: '/:sportName',
//                templateUrl: 'sports/sports-medals.html',
//                resolve: {
//                    sportService: function ($http, $stateParams) {
//                        return $http.get(`/sports/${$stateParams.sportName}`);
//                    }
//
//                },
//                controller: function (sportService, $location) {
//
//                    this.sport = sportService.data;
//                    this.isActive=function(sport){
//                        let pathRegexp=/sports\/(\w+)/;
//                        let match=pathRegexp.exec($location.path());
//                        if(match === null || match.length === 0) return false;
//                        let selectedSportName=match[1];
//                        return sport === selectedSportName;
//                    };
//
//                },
//                controllerAs: 'sportCtrl'
//            })
//            .state('sports.new', {
//                url: "/:sportName/medal/new",
//                templateUrl: 'sports/new-medal.html',
//                controller: function ($stateParams, $state, $http) {
//                    this.sportName = $stateParams.sportName;
//                    this.saveMedal = function (medal) {
//                        $http({
//                            method: 'POST', url: `/sports/${$stateParams.sportName}/medals`
//                            , data: { medal }
//                        }).then(function () {
//                            $state.go('sports.medals', { sportName: $stateParams.sportName });
//
//                        })
//
//                    }
//                },
//                controllerAs: 'newMedalCtrl'
//            }) 
});
        

