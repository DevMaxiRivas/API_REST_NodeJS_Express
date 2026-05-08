export default class userUpdateDTO {
    constructor({ name = null, username = null, email = null }) {
        this.username = username
        this.name = name
        this.email = email
    }

    getFilledFields() {
        let filledFields = {}

        if (this.name) filledFields.name = this.name
        if (this.username) filledFields.username = this.username
        if (this.email) filledFields.email = this.email

        return filledFields
    }
}

