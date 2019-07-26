app.controller('searchController', function($scope, $http, $rootScope, componentBridge){
    $scope.searchTerm = "Salad"
    $scope.apis = [ {id:0,"name":"Food2Fork",url:'https://cors-anywhere.herokuapp.com/https://food2fork.com/api/search'},
                    {id:1,"name":"RecipePuppy",url:'https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/'}];
    $scope.selected = {id:0};
    $scope.search = function(){
      $scope.loading = true;
      var config = {
        params: ($scope.selected.id?{q: $scope.searchTerm}:{key: f2f, q: $scope.searchTerm})
      };
      $http.get($scope.apis[$scope.selected.id].url, config)
            .then((response)=>{
                $scope.recipes = ($scope.selected.id?response.data.results:response.data.recipes) //$scope.selected.id is either 1 or 0
            }).then(()=>{$scope.loading = false;});
      $scope.showRecipesList = true;
    };
    $scope.viewRecipe = function(title, url){
      componentBridge.setPageTitle(title);
      componentBridge.setPageURL(url);
      $rootScope.$emit("openLink", {});
      $("#pageModal").css("display","block");
    }
    $scope.listIngredients = function(item){
      $rootScope.$emit("loadingTable", {});
      var ingredients = '';
      let gotIngredients;
      if (!$scope.selected.id){  // id=0 returns false
        gotIngredients = $http.get('https://cors-anywhere.herokuapp.com/https://food2fork.com/api/get',
                {params:{key: f2f, rId: item.recipe_id}})
              .then(function(response){
                var ings = response.data.recipe.ingredients;
                ingredients = ings.join('; ');
              })
      } else if ($scope.selected.id){ // id=1 returns true
        gotIngredients = new Promise((resolve)=>{
          var index = $scope.recipes.findIndex(ele => {return ele.title == item.title})
          ingredients = $scope.recipes[index].ingredients
          resolve()
        })
      }
      gotIngredients.then(function(){
        componentBridge.setIngredients(ingredients);
        $rootScope.$emit("listIngredients", {});
      })
    }
  });
