
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.afterDelete(Parse.User, function(request) {
  query = new Parse.Query("Goal");
  query.equalTo("user", request.object);
  query.find({
    success: function(goals) {
      Parse.Object.destroyAll(goals, {
        success: function() {
        },
        error: function(error) {
          console.error("Error deleting related goals " + error.code + ": " + error.message);
        }
      });
    },
    error: function(error) {
      console.error("Error finding related goals " + error.code + ": " + error.message);
    }
  });

  query = new Parse.Query("Wish");
  query.equalTo("user", request.object);
  query.find({
    success: function(wishes) {
      Parse.Object.destroyAll(wishes, {
        success: function() {
        },
        error: function(error) {
          console.error("Error deleting related wishes " + error.code + ": " + error.message);
        }
      });
    },
    error: function(error) {
      console.error("Error finding related wishes " + error.code + ": " + error.message);
    }
  });

  query = new Parse.Query("Budget");
  query.equalTo("user", request.object);
  query.find({
    success: function(budgets) {
      Parse.Object.destroyAll(budgets, {
        success: function() {
        },
        error: function(error) {
          console.error("Error deleting related budgets " + error.code + ": " + error.message);
        }
      });
    },
    error: function(error) {
      console.error("Error finding related budgets " + error.code + ": " + error.message);
    }
  });
});

Parse.Cloud.afterDelete("Budget", function(request) {
  query = new Parse.Query("Expense");
  query.equalTo("budget", request.object);
  query.find({
    success: function(expenses) {
      Parse.Object.destroyAll(expenses, {
        success: function() {
        },
        error: function(error) {
          console.error("Error deleting related expenses " + error.code + ": " + error.message);
        }
      });
    },
    error: function(error) {
      console.error("Error finding related expenses " + error.code + ": " + error.message);
    }
  });
});

Parse.Cloud.beforeSave("Budget", function(request, response) {
	if(request.object.isNew()) {
		query = new Parse.Query("Budget");
	    query.equalTo("user", request.object.get("user"));
	    query.equalTo("monthValue", request.object.get("monthValue"));
	    query.find({
	    	success: function(results) {
	      		if(results.length > 0) {
	      			response.error("The selected month already exists");
	      		} else {
	      			response.success(request.object);
	      		}
	    	},
	    	error: function(error) {
	      		console.error("Error finding duplicates " + error.code + ": " + error.message);
	    	}
	  	});
	} else {
		query = new Parse.Query("Budget");
		query.notEqualTo("objectId", request.object.id);
	    query.equalTo("user", request.object.get("user"));
	    query.equalTo("monthValue", request.object.get("monthValue"));
	    query.find({
	    	success: function(results) {
	      		if(results.length > 0) {
	      			response.error("The selected month already exists");
	      		} else {
	      			response.success(request.object);
	      		}
	    	},
	    	error: function(error) {
	      		console.error("Error finding duplicates " + error.code + ": " + error.message);
	    	}
	  	});
	}
});
