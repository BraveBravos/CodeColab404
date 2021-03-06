'use strict';

angular.module('codeColab', [
	'codeColab.main',
  'ngRoute',
	])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
      templateUrl: '/app/main/main.html',
      authenticate: false
    })
    // .when ('/main', {
    //   templateUrl : '/app/main/main.html',
    //   controller: 'codeCtrl',
    //   authenticate: true
    // })
    // .when ('/about', {
    //   templateUrl : '/app/about/about.html',
    //   authenticate: false
    // })
    // .when ('/deploy', {
    //   templateUrl: '/app/deploy/deploy.html',
    //   controller: 'deployCtrl',
    //   authenticate: true
    // })
    // .when ('/tutorial', {
    //   templateUrl: '/app/tutorial.html',
    //   authenticate: false
    // })
		.otherwise({
			redirectTo: '/'
		})
}])

// .run(function($rootScope, $location, globalAuth){
//   $rootScope.$on('$routeChangeStart', function(event, next){
//     $rootScope.path = $location.path();

//     globalAuth.checkAuth().then(function(loggedIn){
//       if(!loggedIn && next.$$route.authenticate){
//         $location.path('/'); //not logged in and requires auth, redirect to homepage
//       } else if(loggedIn && $location.path() === '/'){
//         $location.path('main'); //if loggedin
//       }
//     });
//   });
// })

// .factory('globalAuth', function($http){
//   var checkAuth = function(){
//     return $http({
//       method: 'GET',
//       url: '/auth/check'
//     }).then(function(res){
//       return JSON.parse(res.data);
//     });
//   };

//   return {checkAuth: checkAuth};
// })






