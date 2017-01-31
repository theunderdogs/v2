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
        return $.ajax({
                url: host + '/saveRole', 
			    type: 'POST',
			    data: JSON.stringify(role),
			    //dataType: 'json',
			    contentType: 'application/json'
			  });
    },
    
    createRole: (role) => {
        return $.ajax({
                url: host + '/createRole', 
			    type: 'POST',
			    data: JSON.stringify(role),
			    //dataType: 'json',
			    contentType: 'application/json'
			  });
    }
}

// export function squarex() {
//     return x*x;
// }