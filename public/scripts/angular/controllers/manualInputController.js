app.controller('manualInputController', function($scope, $http, $rootScope, componentBridge){
    $scope.manualInputStr = '';
    $scope.listIngredients = function(){
      var strArr = $scope.manualInputStr.split('\n');
      $scope.manualInputStr = strArr.join('; ');
      componentBridge.setIngredients($scope.manualInputStr);
      $rootScope.$emit("listIngredients", {});
    }
  });