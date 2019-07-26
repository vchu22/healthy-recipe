app.factory('componentBridge', function () {
    var pageTitle = '', pageURL = '', origURL = '';
    var ingredients='';

    return {
        getPageTitle: function () {
            return pageTitle;
        },
        setPageTitle: function (title) {
            pageTitle = title;
        },
        getPageURL: function () {
            return pageURL;
        },
        setPageURL: function (url) {
            origURL = url;
            var arr = url.split("://");
            var protocol = arr[0];
            var link = encodeURIComponent(arr[1]);
            var fulldomain = document.location.origin;
            var newurl = `${fulldomain}/fetch/${protocol}/${link}`;
            pageURL = newurl;
        },
        getOrigURL: function () {
            return origURL;
        },
        setIngredients: function(ings){
            ingredients = ings;
        },
        getIngredients: function(){
            return ingredients;
        }
    };
});
