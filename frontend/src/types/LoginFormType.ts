interface LoginFormElements extends HTMLFormControlsCollection {
    username: HTMLInputElement;
    password: HTMLInputElement;
    confirmPassword: HTMLInputElement;
    conditionsAccepted: HTMLInputElement;
}

export default interface LoginForm extends HTMLFormElement {
    readonly elements: LoginFormElements;
}