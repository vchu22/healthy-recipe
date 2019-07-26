app.directive('recipe', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      item: '=' 
    },
    templateUrl: 'scripts/angular/directives/recipe.html'
  }; 
});