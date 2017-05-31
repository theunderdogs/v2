var userApi =  require( process.cwd() + '/api/user_api');
var _;

var checkInitialization = () => {
    if (!_) {
        throw new Error("Can't use constructor until _ is properly initalized");
    }
}

module.exports = (underscore) => {
    _ = underscore;
    
    return module.exports;
}

module.exports.permissionMap = undefined;

module.exports.buildRolesPermissionMap = () => {
    checkInitialization();
    
    return userApi.getRoles()
        .then((roles) => {
            if(!roles)
                return null;
                
            var ids = _.map(roles, '_id');
            var p = [];
            
            ids.forEach((id) => {
                p.push( userApi.getPermissionsByRoleId(id) );
            });
            
            return Promise.all(p)
                    .then((res) => {
                        module.exports.permissionMap = res
                    });
        });
}