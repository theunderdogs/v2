export const services = {
    getroles : () => {    
        return $.get( host + '/getroles')
    },
    
    getPermissionsByRoleId: (roleId) => {
        return $.get( host + '/getPermissionsByRoleId/' + roleId)
    }
    
}

// export function squarex() {
//     return x*x;
// }