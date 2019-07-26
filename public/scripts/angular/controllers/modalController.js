app.controller('modalController', function($scope, $rootScope, componentBridge){
    $scope.title = '';
    $scope.url = '';
    $rootScope.$on("openLink", function(){
      $scope.title = componentBridge.getPageTitle();
      $scope.url = componentBridge.getPageURL();
    });
    $scope.close = function(){
      $("#pageModal").css("display","none");
    };
    $scope.newTab = function(){
      window.open(componentBridge.getOrigURL(), '_blank');
    }
  });