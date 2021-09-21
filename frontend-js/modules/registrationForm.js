export default class RegistrationForm {
    constructor() {
        this.allFields = document.querySelectorAll("#registration-form .form-control")
        this.insertValidationElements()
        this.username = document.querySelector("#username-register")
        this.username.previousValue = ""
        this.events()
    }

    // Events 
    events(){
        this.username.addEventListener("keyup", () => {
            this.inputIsNotTheSame(this.username, this.usernameHandler)
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
        this.username.timer = setTimeout(() => this.usernameAfterDelay(), 2000)
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
    }

    insertValidationElements(){
        this.allFields.forEach(function(element){
            element.insertAdjacentHTML("afterend", `
            <div class="alert alert-danger small liveValidateMessage"></div>
            `)
        })
    }
}