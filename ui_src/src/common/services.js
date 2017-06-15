const getR = (url) => $.ajax( {
			          url,
			          type: 'GET',
			          headers: {
					        access_token: JSON.parse(localStorage['accesstoken'] || null)
					    }
			      });

const postR = (url, data) => $.ajax( {
			          url,
			          type: 'POST',
			          data: JSON.stringify(data),
			          contentType: 'application/json',
			          headers: {
					        access_token: JSON.parse(localStorage['accesstoken'] || null)
					    }
			      });

export const services = {
    authenticate : () => {
        return $.ajax( {
	          url: host + "/auth/facebook/token",
	          type: 'POST',
	          data: JSON.stringify({ access_token : JSON.parse(localStorage['accesstoken'] || null) }),
    		  contentType: 'application/json'
	      })
    },
    getroles : () => {    
        //return getR( host + '/getroles')
        return getR( host + '/getroles')
    },
    getPermissionsByRoleId: (roleId) => {
        return getR( host + '/getPermissionsByRoleId/' + roleId)
    },
    getPermissions: () => {
        return getR( host + '/getPermissions')
    },
    saveRole: (role) => {
        return postR(host + '/saveRole', role)
    },
    createRole: (role) => {
        return postR(host + '/createRole', role)
    },
    getUsers : () => {    
        return getR( host + '/getUsers')
    },
    saveUser: (user) => {
        return getR( host + '/saveUser')
    },
    getUserByFacebookId: (facebookId) => {
        return getR( host + '/getUserByFacebookId/' + facebookId)
    },
    getEmailLists : () => {    
        return getR( host + '/getEmailLists')
    },
    getEmailListById: (id) => {
        return getR( host + '/getEmailListById/' + id)
    },
    saveEmailList: (list) => {
        return postR(host + '/saveEmailList', list)
    },
    sendEmail: (email) => {
        return postR(host + '/sendEmail', email)
    },
    getSendersEmails: () => {
        return getR( host + '/getSendersEmails')
    },
    saveAboutus: (about) => {
        return postR(host + '/saveAboutus', about)
    },
    getAbouts : () => {    
        return getR( host + '/getAbouts')
    },
    getAboutById: (id) => {
        return getR( host + '/getAboutById/' + id)
    },
    getActiveAboutById: () => {
        return getR( host + '/getActiveAboutById')
    },
    getActiveAboutToDisplay: () => {
        return getR( host + '/getActiveAboutToDisplay')
    },
    saveContactTemplate: (template) => {
        return postR(host + '/saveContactTemplate', template)
    },
    getContactTemplates : () => {    
        return getR( host + '/getContactTemplates')
    },
    getContactTemplateById: (id) => {
        return getR( host + '/getContactTemplateById/' + id)
    },
    getActiveContactTemplate: () => {
        return getR( host + '/getActiveContactTemplate')
    },
    getActiveContactTemplateToDisplay: () => {
        return getR( host + '/getActiveContactTemplateToDisplay')
    },
    saveQuestion: (question) => {
        return postR(host + '/saveQuestion', question)
    },
    getQuestionOrder: () => {
        return getR( host + '/getQuestionOrder')
    },
    getQuestions: () => {
        return getR( host + '/getQuestions')
    },
    saveQuestionOrder: (_order) => {
        return postR(host + '/saveQuestionOrder', _order)
    },
    getQuestionById: (id) => {
        return getR( host + '/getQuestionById/' + id)
    },
    deleteQuestion: (id) => {
        return postR(host + '/deleteQuestion', id)
    }
}

// export function squarex() {
//     return x*x;
// }