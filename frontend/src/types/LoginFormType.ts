interface LoginFormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
    confirmPassword: HTMLInputElement;
    conditionsAccepted: HTMLInputElement;
}

export default interface LoginForm extends HTMLFormElement {
    readonly elements: LoginFormElements;
}