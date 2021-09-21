import axios from "axios"

export default class RegistrationForm {
    constructor() {
        this.allFields = document.querySelectorAll("#registration-form .form-control")
        this.insertValidationElements()
        this.username = document.querySelector("#username-register")
        this.username.previousValue = ""
        this.email = document.querySelector("#email-register")
        this.email.previousValue = ""
        this.events()
    }

    // Events 
    events(){
        this.username.addEventListener("keyup", () => {
            this.inputIsNotTheSame(this.username, this.usernameHandler)
        })

        this.email.addEventListener("keyup", () => {
            this.inputIsNotTheSame(this.email, this.emailHandler)
        })
    }

    //Methods
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

    usernameImmediately(){
        //regex only accepts alphanumeric
        if (this.username.value != "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
            this.showValidationError(this.username, "Only alphanumeric is allowed for username")
        } 

        if (!this.username.errors){
         this.hideValidationError(this.username)   
        }

        if (this.username.value.length > 30){
            this.showValidationError(this.username, "You can only have 30 characters for username")
        }

    }

    emailAfterDelay(){
        //regex only accepts alphanumeric
        if (!/^\S+@\S+$/.test(this.email.value)) {
            this.showValidationError(this.email, "Please provide a valid email")
        } 

        if (!this.email.errors){
         axios.post('/isEmailExisting', {email: this.email.value}).then((response) =>{
            if (response.data) {
                this.email.isUnique = false
                this.showValidationError("The email address you provided is already registered")
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
        if (this.username.value.length < 3) {
            this.showValidationError(this.username, "You must have at least 3 characters for username")
        }

        if (!this.username.errors) {
            axios.post('/isUsernameExisting', {username: this.username.value}).then((response) => {
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