import { maskEmail } from '../utils/format/maskEmail.js'

export class UserResponseDTO {
    constructor(user) {
        this.id = user.id
        this.name = user.name
        this.username = user.username
        this.email = maskEmail(user.email)
    }

    getJsonResponse() {
        return {
            id: this.id,
            name: this.name,
            username: this.username,
            email: this.email
        }
    }
}
