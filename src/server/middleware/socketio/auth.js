'use strict';



export default async function ioAuth(socket,reqRoleList, reqPrivLevel) {
        if (!socket.user) {
        return false;
    } else {
        let checkRole = reqRoleList || ['viewer'];
        let checkPriv = reqPrivLevel || 0;
        let isRole = (checkRole.indexOf(socket.user.role) > -1);
        let isprivilegeLevel = (socket.user.privilegeLevel >= checkPriv);
        if (isRole && isprivilegeLevel) {
            return true;
        } else {
            return false;
        }
    }
}
