(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItemsDirective() {
  var ddo = {
     templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      noresults: '<',
      onRemove: '&'
    },
     controller: FoundItemsDirectiveController,
     controllerAs: 'narrow',
     bindToController: true
  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var narrow = this;

  narrow.removeItem = function (itemIndex) {
    narrow.found.splice(itemIndex.index, 1);
  };
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
	var narrow = this;
	var service = MenuSearchService;

	narrow.getMatchedMenuItems = function(searchTerm){
		if ((typeof searchTerm) == 'undefined') {
			 narrow.noresults = true;
			 searchTerm = searchTerm ?? '';
		} 

		var found = service.getMatchedMenuItems();
		found.then(function (response) {
	    // process result and only keep items that match
	    var result_arr = response.data.menu_items
	    var foundItems = [];
	    if (searchTerm != ''){
	    	for (var i=0; i < result_arr.length; i++){
		    	if (result_arr[i].name.toUpperCase().includes(searchTerm.toUpperCase())) {
		    		foundItems.push(result_arr[i]);
		    	}
		    }
		  }
	    // return processed items
	    if (foundItems.length == 0){
	    	narrow.noresults = true;
	    } else {
	    	narrow.noresults = false; 	
	    }
	    narrow.found = foundItems;
	    
	  })
	  .catch(function (error) {
	    console.log("Something went terribly wrong.");
	  });
	}



};

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function() {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    })
  };
}

})();

