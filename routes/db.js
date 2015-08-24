var uuid = require('node-uuid');
var MongoClient = require('mongodb').MongoClient
var async = require('async');

//DB STUFF
var dbname = "zzishdb";
var port = "27017"
var dburl = "mongodb://localhost:"+port;

var url = dburl + "/" + dbname;
// Use connect method to connect to the Server

exports.createDocument = function() {
	doc = {};
	doc.uuid = uuid.v4();
	doc._id = uuid.v4();
	doc.created = Date.now();
	doc.updated = doc.created;
	return doc;
}

exports.saveUpdatedDocument = function(name, document, callback) {
	document.updated = Date.now();
	exports.saveDocument(name,document,callback);
}

exports.saveDocument = function(name, document, callback) {
	MongoClient.connect(url, function(err, db) {
		var collection = db.collection(name);
		if (document.uuid==undefined) {
			document.uuid = uuid.v4();
		}
		collection.save(document,function(err,result) {
			db.close();
			callback(err,result);
		})
	});
}

exports.saveDocuments = function(name, documents, callback) {
	async.eachSeries(documents,function (document,icallback) {
		MongoClient.connect(url, function(err, db) {
			var collection = db.collection(name);
			if (document.uuid==undefined) {
				document.uuid = uuid.v4();
			}
			collection.save(document,function(err,result) {
				db.close();
				icallback();
			})
		});
	}, function(err){
	    // if any of the file processing produced an error, err would equal that error
      	callback(null);
	});
}

exports.removeDocument = function(name, document, callback) {
	MongoClient.connect(url, function(err, db) {
		var collection = db.collection(name);
		collection.remove(document,function(err,result) {
			db.close();
			callback(err,result);
		})

	});
}

exports.updateDocument = function(name,query,update,options,callback) {
	MongoClient.connect(url, function(err, db) {
		var collection = db.collection(name);
		collection.update(query,update,options,function(err,result) {
			db.close();
			callback(err,result);
		})
	});
}

exports.findDocuments = function(name,query,limit,callback) {
	MongoClient.connect(url, function(err, db) {
		var collection = db.collection(name);
		if (limit==undefined || limit==-1) {
			collection.find(query).toArray(function(err, docs) {
				db.close();
				callback(err,docs);
			},function(err,result) {
				db.close();
				callback(err,result);
			})
		}
		else {
			collection.find(query).limit(limit).toArray(function(err, docs) {
				db.close();
				callback(err,docs);
			},function(err,result) {
				db.close();
				callback(err,result);
			})
		}
	});
}

exports.aggregateDocuments = function(name, query, callback) {
	MongoClient.connect(url, function(err, db) {
		var collection = db.collection(name);
		collection.aggregate(query).toArray(function(err, docs) {
			db.close();
			callback(err,docs);
		},function(err,result) {
			db.close();
			callback(err,result);
		})
	});
}



exports.findDocument = function(name,query, callback) {
	MongoClient.connect(url, function(err, db) {
		var collection = db.collection(name);
		collection.find(query).toArray(function(err, docs) {
			db.close();
			if (docs.length>0) {
				callback(err,docs[0]);
			}
			else {
				callback(err);
			}
		},function(err,result) {
			db.close();
			callback(err,result);
		})

	});
}

exports.clearDatabase = function(callback) {
    var MongoClient = require('mongodb').MongoClient
    var base = this;
    MongoClient.connect(url, function(err, db) {
        if(err) {
        	callback(err);
        	return;
        }
        db.collectionNames(function(err, collections){
        	if (!err) {
	        	async.each(collections, function(collection, callback) {
					var name = collection.name.substring(dbname+'.'.length);
			        if (name.substring(0, 6) !== "system"){
						db.dropCollection(name, function(err) {
							if (!err) {
								callback();
							}
							else {
								callback(err);
							}
						});
					}
					else {
						callback();
					}
	        	}, function(err){
	        		db.close();
				    if( err ) {
				      callback(err);
				    } else {
				      callback();
				    }
				});
        	}
        	else {
        		db.close();
	        	callback(err);
	        	return;
        	}
        });
    });
}

exports.dropCollection = function(name,callback) {
    var MongoClient = require('mongodb').MongoClient

    MongoClient.connect(url, function(err, db) {
        db.dropCollection(name, function(err) {
            if(!err) {
            } else {
            	db.close();
            	callback(err,err.errmsg);
            }
        });
    });
}
