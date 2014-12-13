angular.module('website', ['ngRoute']).

config(function($routeProvider) {
    $routeProvider.
    when('/event/:id', {
        templateUrl: 'partials/events.html',
        controller: 'EventsCtrl'
    }).
    when('/event/preso/:id/:presoid', {
        templateUrl: 'partials/speakers.html',
        controller: 'SpeakerCtrl'
    }).
    when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
})
    .controller('EventsCtrl', function($scope, $q, getDataJson, $route) {
        $scope.title = '.....';
        $scope.body = '';

        var currentPostId = $route.current.params.id;
        $scope.basePresoPath = "#/event/preso/" + currentPostId + "";
        
        var promisedata = $q.all([getDataJson.getD()]);
        promisedata.then(
            function(data) {
                var events = data[0].data;
                var presentations = events.events[currentPostId].presentations;
                $scope.title = events.events[currentPostId].name;
                $scope.presentations = presentations;
            },
            function(error) {
                // report something
            },
            function(progress) {
                // report progress
            });
    })
    .controller('SpeakerCtrl', function($scope, $sce, $http, $q, getDataJson, $route) {
        $scope.title = 'Presentation';

        var currentPostId = $route.current.params.id;
        var currentPresotId = $route.current.params.presoid;

        var promisedata = $q.all([getDataJson.getD()]);

        promisedata.then(
            function(data) {
                var events = data[0].data;

                var speakerpreso = events.events[currentPostId].presentations[currentPresotId];
                $scope.speakerpreso = speakerpreso;

                $http.get(speakerpreso.content).
                success(function(data, status, headers, config) {
                    $scope.readme = $sce.trustAsHtml(marked(data));
                }).
                error(function(data, status, headers, config) {});

            },
            function(error) {
                // report something
            },
            function(progress) {
                // report progress
            });

    })
    .controller('HomeCtrl', function($scope, $q, getDataJson) {
        $scope.title = 'GDG Sri Lanka';
        $scope.body = 'View all the presentations done at GDG events';


        var promisedata = $q.all([getDataJson.getD()]);

        promisedata.then(
            function(data) {
                var events = data[0].data;
                $scope.events = events.events;
            },
            function(error) {
                // report something
            },
            function(progress) {
                // report progress
            });
    })
    .factory('getDataJson', function($http, $q) {
        return {

            getD: function() {
                var deferred = $q.defer();
                $http.get('data.json').
                success(function(data, status, headers, config) {
                    deferred.resolve({
                        data: data
                    });
                }).
                error(function(data, status, headers, config) {});
                return deferred.promise;
            }
        }
    });