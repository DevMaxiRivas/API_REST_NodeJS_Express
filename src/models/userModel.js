class UserModel {
    constructor({ id, name, email, createdAt }) {
        this.id = id
        this.name = name
        this.email = email
        this.created_at = createdAt
    }

    static validate({ name, email }) {
        if (!name || !email) throw new Error('name y email son requeridos')
    }
}

export default UserModel
