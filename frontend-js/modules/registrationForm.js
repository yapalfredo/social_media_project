import axios from "axios"

export default class RegistrationForm {
    constructor() {
        this.form = document.querySelector("#registration-form")
        this.allFields = document.querySelectorAll("#registration-form .form-control")
        this.insertValidationElements()
        this.username = document.querySelector("#username-register")
        this.username.previousValue = ""
        this.email = document.querySelector("#email-register")
        this.email.previousValue = ""
        this.password = document.querySelector("#password-register")
        this.password.previousValue = ""
        this.username.isUnique = false
        this.email.isUnique = false
        this.events()
    }

    // Events 
    events(){
        this.form.addEventListener("submit", e => {
            e.preventDefault()
            this.formSubmitHandler()
        })

        this.username.addEventListener("keyup", () => {
            this.inputIsNotTheSame(this.username, this.usernameHandler)
        })

        this.email.addEventListener("keyup", () => {
            this.inputIsNotTheSame(this.email, this.emailHandler)
        })

        this.password.addEventListener("keyup", () => {
            this.inputIsNotTheSame(this.password, this.pwdHandler)
        })

        this.username.addEventListener("blur", () => {
            this.inputIsNotTheSame(this.username, this.usernameHandler)
        })

        this.email.addEventListener("blur", () => {
            this.inputIsNotTheSame(this.email, this.emailHandler)
        })

        this.password.addEventListener("blur", () => {
            this.inputIsNotTheSame(this.password, this.pwdHandler)
        })
    }

    //Methods
    formSubmitHandler(){
        this.usernameImmediately()
        this.usernameAfterDelay()
        this.emailAfterDelay()
        this.passwordImmediately()
        this.passwordAfterDelay()

        if (
            this.username.isUnique &&
            !this.username.errors &&
            this.email.isUnique &&
            !this.email.errors &&
            !this.password.errors
        ) {
            this.form.submit()
        }
    }

    inputIsNotTheSame(element, handler){
        if(element.previousValue != element.value) {
             handler.call(this)
        }

        element.previousValue =  element.value
    }

    usernameHandler(){
        this.username.errors = false
        this.usernameImmediately()
        clearTimeout(this.username.timer)
        this.username.timer = setTimeout(() => this.usernameAfterDelay(), 800)
    }

    emailHandler(){
        this.email.errors = false
        clearTimeout(this.email.timer)
        this.email.timer = setTimeout(() => this.emailAfterDelay(), 800)
    }

    pwdHandler(){
        this.password.errors = false
        this.passwordImmediately()
        clearTimeout(this.password.timer)
        this.password.timer = setTimeout(() => this.passwordAfterDelay(), 800)
    }

    usernameImmediately(){
        //regex only accepts alphanumeric
        if (this.username.value != "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
            this.showValidationError(this.username, "Only alphanumeric is allowed for username")
        } 

        if (!this.username.errors){
         this.hideValidationError(this.username)   
        }

        if (this.username.value.length > 30){
            this.showValidationError(this.username, "You can only have up to 30 characters for username")
        }

    }

    passwordImmediately(){
        if (this.password.value.length > 50){
            this.showValidationError(this.password, "You can only have up to 50 characters for password")
        }

        if (!this.password.errors){
            this.hideValidationError(this.password)
        }

    }

    passwordAfterDelay(){
        if (this.password.value.length < 12){
            this.showValidationError(this.password, "You must have at least 12 characters for password")
        }
    }

    emailAfterDelay(){
        //regex only accepts alphanumeric
        if (!/^\S+@\S+$/.test(this.email.value)) {
            this.showValidationError(this.email, "Please provide a valid email")
        } 

        if (!this.email.errors){
         axios.post('/isEmailExisting', {email: this.email.value}).then(response => {
            if (response.data) {
                this.email.isUnique = false
                this.showValidationError(this.email, "The email address you provided is already registered")
            } else {
                this.email.isUnique = true
                this.hideValidationError(this.email)
            }
         }).catch(() => {
            console.log("Error during live form validation")
         })
        }

    }

    hideValidationError(element){
        element.nextElementSibling.classList.remove("liveValidateMessage--visible")
    }

    showValidationError(element, message){
        element.nextElementSibling.innerHTML = message
        element.nextElementSibling.classList.add("liveValidateMessage--visible")
        element.errors = true

    }

    usernameAfterDelay(){
        if (this.username.value.length < 8) {
            this.showValidationError(this.username, "You must have at least 8 characters for username")
        }

        if (!this.username.errors) {
            axios.post('/isUsernameExisting', {username: this.username.value}).then(response => {
                if (response.data) {
                    this.showValidationError(this.username, "The username you provided is not available")
                    this.username.isUnique = false
                } else {
                    this.username.isUnique = true
                }
            }).catch(() => {
                console.log("Error during live form validation")
            })
        }
    }

    insertValidationElements(){
        this.allFields.forEach(function(element){
            element.insertAdjacentHTML("afterend", `
            <div class="alert alert-danger small liveValidateMessage"></div>
            `)
        })
    }
}