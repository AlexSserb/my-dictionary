interface RegistrationFormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
    passwordRepeat: HTMLInputElement;
    confirmPassword: HTMLInputElement;
    conditionsAccepted: HTMLInputElement;
}

export default interface RegistrationForm extends HTMLFormElement {
    readonly elements: RegistrationFormElements;
}