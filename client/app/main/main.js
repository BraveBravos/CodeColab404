// var codeColab = angular.module('codeColab.main', [])
angular.module('codeColab.main', [])

.controller('codeCtrl', function ($scope, $http) {
  $scope.statusText = ''
  $scope.submitEmail = function(email) {
    $scope.statusText = 'Sending now...'

    return $http({
      method: 'POST',
      url: '/api/submitEmail',
      email: email
    })
    .then(function(response) {
      //update text according to response status
      if(response.message === 'User added to database.') {
        $scope.statusText = "Thanks, we'll keep you posted."
      } else if (response.message === 'User already in database.') {
        $scope.statusText = "We already have you on our mailing list - we'll keep you posted."
      }
    })
  }




})












