var userApi =  require( process.cwd() + '/api/user_api');

module.exports.buildRolesPermissionMap = () => {
    
    return userApi.getRoles()
        .then((roles) => {
            return roles;
        });
}