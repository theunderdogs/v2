export const services = {
    getroles : () => {    
        return $.get( host + '/getroles')
    },
    
    getPermissionsByRoleId: (roleId) => {
        return $.get( host + '/getPermissionsByRoleId/' + roleId)
    },
    
    getPermissions: () => {
        return $.get( host + '/getPermissions')
    },
    
    saveRole: (role) => {
        return $.ajax(host + '/getPermissions', {
			    method: 'POST',
			    data: role,
			    processData: false,
			    contentType: false
			  });
    }
}

// export function squarex() {
//     return x*x;
// }