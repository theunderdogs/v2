//conn = new Mongo();
//db = conn.getDB("mongodb://kirandeore:Shiv1984@ds023654.mlab.com:23654/underdogsdb");
db.getCollectionNames().forEach(function(c) {
    if(c != 'system.indexes') { 
        db.getCollection(c).drop();
    }
 });

db.createCollection('users')
db.createCollection('permissions')
db.createCollection('roles')    
db.users.ensureIndex( { facebookId: 1 }, { unique: true } );

db.permissions.insert([{ 
	  name: 'ADDUSER',
	  description: 'Can add user?', 
	  acceptedValues: [true,false],
	  dateAdded: new Date()
	}, { 
	  name: 'ADDPET',
	  description: 'Can add pet?', 
	  acceptedValues: [true,false],
	  dateAdded: new Date()
	}])

cursor = db.permissions.find({ name: 'ADDUSER'})
cursor2 = db.permissions.find({ name: 'ADDPET'})

//print(cursor[0]._id);

db.roles.insert({ 
	name : 'MANAGER', 
	permissions : [{
		item: new DBRef('permissions', cursor[0]._id)
		/* { 
			$ref: 'permission', 
			$id :  cursor[0]._id
		}*/,
		value: true
	}, {
		item: new DBRef('permissions', cursor2[0]._id),
		value: true
	}], 
	dateAdded: new Date() 
});

cursor = db.roles.find({ name: 'MANAGER'})

db.users.insert([{ 
	facebookId : '10158081909300057', 
	isAdmin: true,
	status: 'active',
	dateAdded: new Date() 
},{ 
	facebookId : '5555', 
	isAdmin: false,
	role: new DBRef('roles', cursor[0]._id) /*{ 
		$ref: 'roles', 
		$id :  cursor[0]._id 
	}*/,
	status: 'active',
	dateAdded: new Date() 
}]);


cursor = db.roles.find({ name: 'MANAGER'});
per = cursor[0].permissions[0];
val = per.value;
permissions = db[per.item.$ref].find({ _id: per.item.$id })

print('value: ' + val + ', permissions: ' + permissions[0].name + ', ' + permissions[0].description);

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