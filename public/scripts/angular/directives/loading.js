app.directive('loading', function($rootScope) { 
    return { 
      restrict: 'E',
      scope: {
        color: '='
      },
      templateUrl: 'scripts/angular/directives/loading.html',
      link: function(element,scope,attrs){
        $('#'+attrs.id).find('.spinner > div').css('background-color',attrs.color);
      }
    };
  });