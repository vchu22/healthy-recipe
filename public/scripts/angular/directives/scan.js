app.directive('scanpicture', function() { 
    return { 
      restrict: 'E', 
      scope: { 
        item: '='
      },
      templateUrl: 'scripts/angular/directives/scanpicture.html'
    }; 
  });