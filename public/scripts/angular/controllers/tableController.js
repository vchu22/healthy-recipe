app.controller('tableController', function($scope,$http, $rootScope, componentBridge){
  $scope.ingrNutr = [];
  $scope.untouched = true;
  $scope.loading = false;
  $scope.remove = function(ele){
    var i = ele.$index;
    recalcTotals($scope.ingrNutr[i],-1);
    $scope.ingrNutr.splice(i,1);
  }
  var recalcTotals = function(obj,sign){ // the sign parameter indicate which operation to perform
    $scope.totals.serving_weight_grams += obj.serving_weight_grams*sign;
    $scope.totals.nf_calories += obj.nf_calories*sign;
    $scope.totals.nf_cholesterol += obj.nf_cholesterol*sign;
    $scope.totals.nf_protein += obj.nf_protein*sign;
    $scope.totals.nf_total_fat += obj.nf_total_fat*sign;
    $scope.totals.nf_potassium += obj.nf_potassium*sign;
    $scope.totals.nf_sodium += obj.nf_sodium*sign;
    $scope.totals.nf_sugars += obj.nf_sugars*sign;
  }
  $scope.onchange = function($index,orig,target){
    recalcTotals(orig,-1); // subtract the unchanged values from total
    var ratio = $scope.ingrNutr[$index].ratio;
    if (target == 'q'){
      var gram = $scope.ingrNutr[$index].serving_qty * ratio.gramsPerQty;
      $scope.ingrNutr[$index].serving_weight_grams = gram;
    } else if (target == 'g'){
      var qty = $scope.ingrNutr[$index].serving_weight_grams / ratio.gramsPerQty;
      $scope.ingrNutr[$index].serving_qty = qty;
    }
    $scope.ingrNutr[$index].nf_calories = $scope.ingrNutr[$index].serving_weight_grams * ratio.caloriesPerGram;
    $scope.ingrNutr[$index].nf_cholesterol = $scope.ingrNutr[$index].serving_weight_grams * ratio.cholesterolPerGram;
    $scope.ingrNutr[$index].nf_protein = $scope.ingrNutr[$index].serving_weight_grams * ratio.proteinPerGram;
    $scope.ingrNutr[$index].nf_total_fat = $scope.ingrNutr[$index].serving_weight_grams * ratio.fatPerGram;
    $scope.ingrNutr[$index].nf_potassium = $scope.ingrNutr[$index].serving_weight_grams * ratio.potassiumPerGram;
    $scope.ingrNutr[$index].nf_sodium = $scope.ingrNutr[$index].serving_weight_grams * ratio.sodiumPerGram;
    $scope.ingrNutr[$index].nf_sugars = $scope.ingrNutr[$index].serving_weight_grams * ratio.sugarPerGram;
    recalcTotals($scope.ingrNutr[$index], 1); // add the new values to total
  };
  $rootScope.$on("loadingTable", function(){
    $scope.loading = true;
  });
  $rootScope.$on("listIngredients", function(){
    var queryStr = componentBridge.getIngredients();
    getNutrition(queryStr);
  });
  function getNutrition(line){
    $scope.ingrNutr = [];
    $scope.totals = {
      serving_weight_grams:0,
      nf_calories:0,
      nf_cholesterol:0,
      nf_protein:0,
      nf_total_fat:0,
      nf_potassium:0,
      nf_sodium:0,
      nf_sugars:0
    };
    var data = {
      query: line,
      timezone: "US/Eastern"
    }
    var config = {
      headers : {
        'Content-Type': "application/json",
        'x-app-id': ntId,
        'x-app-key': ntKey
      }
    };
    $http.post('https://trackapi.nutritionix.com/v2/natural/nutrients', data, config)
          .then(function(response){
            var ings = response.data.foods;
            for (var i=0; i<ings.length; i++){
              $scope.ingrNutr.push(ings[i]);
              // save the ratio for future calculations
              $scope.ingrNutr[i].ratio = {
                'gramsPerQty':ings[i].serving_weight_grams/ings[i].serving_qty,
                'caloriesPerGram':ings[i].nf_calories/ings[i].serving_weight_grams,
                'cholesterolPerGram':ings[i].nf_cholesterol/ings[i].serving_weight_grams,
                'proteinPerGram':ings[i].nf_protein/ings[i].serving_weight_grams,
                'fatPerGram':ings[i].nf_total_fat/ings[i].serving_weight_grams,
                'potassiumPerGram':ings[i].nf_sodium/ings[i].serving_weight_grams,
                'sodiumPerGram':ings[i].nf_sodium/ings[i].serving_weight_grams,
                'sugarPerGram':ings[i].nf_sugars/ings[i].serving_weight_grams
              };
              recalcTotals($scope.ingrNutr[i],1);
            }
          }).then(()=>{$scope.loading = false;$scope.untouched = false;});
  }
});
