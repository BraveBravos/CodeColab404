// var codeColab = angular.module('codeColab.main', [])
angular.module('codeColab.main', [])

.controller('codeCtrl', function ($scope, $http, $timeout) {
  $scope.statusText = 'Test.'
  $scope.submitEmail = function(email) {
    console.log('submitted: ',email)
    $scope.statusText = 'Sending now...'

    return $http({
      method: 'POST',
      url: '/api/submitEmail',
      data: {email: email}
    })
    .then(function(response) {
      //update text according to response status
      console.log('response: ',response)
      console.log('test: ',response.data.message==='User already in database.')
      console.log('test: ',$scope.statusText)
      if(response.data.message === 'User added to database.') {
        $timeout(function () {
          $scope.statusText = "Thanks, we've got your email.  We'll keep you posted."
          $scope.$apply()
        })
      } else if (response.data.message === 'User already in database.') {
        $timeout(function () {
          $scope.statusText = "We already have you on our mailing list - we'll keep you posted."
        })

      }
    })
  }




})












