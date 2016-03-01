angular.module('appRoutes', [])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider

    // home page
    .state('home', {
      url: '/home',
      templateUrl: '../views/home.html',
      controller: 'FeedController'
    })

}]);