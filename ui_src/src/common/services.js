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
    },
    getUsers : () => {    
        return $.get( host + '/getUsers')
    },
    saveUser: (user) => {
        return $.ajax({
                url: host + '/saveUser', 
			    type: 'POST',
			    data: JSON.stringify(user),
			    //dataType: 'json',
			    contentType: 'application/json'
			  });
    },
    getUserByFacebookId: (facebookId) => {
        return $.get( host + '/getUserByFacebookId/' + facebookId)
    },
    getEmailLists : () => {    
        return $.get( host + '/getEmailLists')
    },
    getEmailListById: (id) => {
        return $.get( host + '/getEmailListById/' + id)
    },
    saveEmailList: (list) => {
        return $.ajax({
                url: host + '/saveEmailList', 
			    type: 'POST',
			    data: JSON.stringify(list),
			    //dataType: 'json',
			    contentType: 'application/json'
			  });
    },
    sendEmail: (email) => {
        return $.ajax({
                url: host + '/sendEmail', 
			    type: 'POST',
			    data: JSON.stringify(email),
			    //dataType: 'json',
			    contentType: 'application/json'
			  });
    },
    
}

// export function squarex() {
//     return x*x;
// }