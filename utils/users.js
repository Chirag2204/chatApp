const users = []

//To join the User
function userJoin(id, username, room) {
    const user = { id, username, room }
    users.push(user)

    return user
}

//get current user
function getCurrentUser(id) {
    const user = users.find(user => user.id === id)
    return user
}

// user leaves
function userLeaves(id) {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// get user List
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
}