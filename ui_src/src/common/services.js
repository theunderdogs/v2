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
    getSendersEmails: () => {
        return $.get( host + '/getSendersEmails')
    },
    saveAboutus: (about) => {
        return $.ajax({
                url: host + '/saveAboutus', 
			    type: 'POST',
			    data: JSON.stringify(about),
			    //dataType: 'json',
			    contentType: 'application/json'
			  });
    },
    getAbouts : () => {    
        return $.get( host + '/getAbouts')
    },
    getAboutById: (id) => {
        return $.get( host + '/getAboutById/' + id)
    },
    getActiveAboutById: () => {
        return $.get( host + '/getActiveAboutById')
    },
    getActiveAboutToDisplay: () => {
        return $.get( host + '/getActiveAboutToDisplay')
    },
    saveContactTemplate: (template) => {
        return $.ajax({
                url: host + '/saveContactTemplate', 
			    type: 'POST',
			    data: JSON.stringify(template),
			    //dataType: 'json',
			    contentType: 'application/json'
			  });
    },
    getContactTemplates : () => {    
        return $.get( host + '/getContactTemplates')
    },
    getContactTemplateById: (id) => {
        return $.get( host + '/getContactTemplateById/' + id)
    },
    getActiveContactTemplate: () => {
        return $.get( host + '/getActiveContactTemplate')
    },
    getActiveContactTemplateToDisplay: () => {
        return $.get( host + '/getActiveContactTemplateToDisplay')
    }
}

// export function squarex() {
//     return x*x;
// }