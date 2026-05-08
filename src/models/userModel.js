class UserModel {
    constructor({ id, name, username, email, created_at, password }) {
        this.id = id
        this.name = name
        this.username = username
        this.email = email
        this.created_at = created_at
        this.password = password
    }

}

export default UserModel
