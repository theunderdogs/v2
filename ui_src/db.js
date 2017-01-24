//conn = new Mongo();
//db = conn.getDB("mongodb://kirandeore:Shiv1984@ds023654.mlab.com:23654/underdogsdb");
db.getCollectionNames().forEach(function(c) {
    if(c != 'system.indexes') { 
        db.getCollection(c).drop();
    }
 });

db.createCollection('user')
db.createCollection('permission')
db.createCollection('role')    

db.permission.insert({ description: 'Can user add pet?', dateAdded: new Date() })

cursor = db.permission.find({ description: 'Can user add pet?'})

//print(cursor[0]._id);

db.role.insert({ 
	name : 'admin', 
	permission : [{
		re: { 
			$ref: 'permission', 
			$id :  cursor[0]._id 
		}
	}], 
	dateAdded: new Date() 
});

cursor = db.role.find({ name: 'admin'})

db.user.insert({ 
	facebookId : '10158081909300057', 
	role: { 
		$ref: 'role', 
		$id :  cursor[0]._id 
	},
	status: 'active',
	dateAdded: new Date() 
});



/*
if ( cursor.hasNext() ){
   cursor.next();
}
*/
/*
db.permission.insert({ name: 'Admin' })
*/
//C:\Program Files\MongoDB\Server\3.4\bin

//mongo ds023654.mlab.com:23654/underdogsdb -u kirandeore -p Shiv1984
//load("C:/aurelia 1.2.2/skeleton-esnext/db.js")

//mongo kirandeore:Shiv1984@ds023654.mlab.com:23654/underdogsdb C:/aurelia_1.2.2/skeleton-esnext/db.js

//