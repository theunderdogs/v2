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
        //let form = new FormData();
        //form.append('data', role);
        //return $.post(host + '/saveRole', role);
        
        return $.ajax({
                url: host + '/saveRole', 
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