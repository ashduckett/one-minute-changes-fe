export const UPDATE_FORM = 'UPDATE_FORM';
export const EMAIL_EXISTS = 'EMAIL_EXISTS';
export const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export const validateInput = (name, value, formState) => {
    let hasError = false;
    let error = '';

    switch (name) {
        case 'firstNameState':
            if (value.trim() === '') {
                hasError = true;
                error = 'First name cannot be empty';
            } else {
                hasError = false;
                error = '';
            }
            break;
        case 'lastNameState':
            if (value.trim() === '') {
                hasError = true;
                error = 'Last name cannot be empty';
            } else {
                hasError = false;
                error = '';
            }
            break;
        case 'emailState':
            if (value.trim() === '') {
                hasError = true;
                error = 'Email cannot be empty';
            } else if (!validateEmail(value.trim())) {
                hasError = true;
                error = 'Enter a valid email';
            } else {
                hasError = false;
                error = '';
            }
            break;
        case 'passwordState':
            if (value.trim() === '') {
                hasError = true;
                error = 'Password cannot be empty';
            } else if (value.trim().length < 8) {
                hasError = true;
                error = 'Password must be 8 characters or more';
            } else {
                hasError = false;
                error = '';
            }
            break;
        case 'confirmPasswordState':
            console.log(formState)
            if (value.trim() === '') {
                hasError = true;
                error = 'Confirm password cannot be empty';
            } else if (value !== formState.passwordState.value) {
                hasError = true;
                error = 'Passwords don\'t match';
            } else {
                hasError = false;
                error = '';
            }
            break;
        default:
            break;
    }

    return { hasError, error };
};


export const onFocusOut = (name, value, dispatch, formState) => {
    const { hasError, error } = validateInput(name, value, formState);
    let isFormValid = true;

    for (const key in formState) {
        const item = formState[key];

        if (key === name && hasError) {
            isFormValid = false;
            break;
        } else if (key !== name && item.hasError) {
            isFormValid = false;
        }
    }

    dispatch({
        type: UPDATE_FORM,
        data: {
            name,
            value,
            hasError,
            error,
            touched: true,
            isFormValid
        }
    });
};

export const onInputChange = (name, value, dispatch, formState) => {
    const { hasError, error } = validateInput(name, value, formState);
    let isFormValid = true;

    for (const key in formState) {
        console.log(key)
        const item = formState[key];

        if (key === name && hasError) {

            isFormValid = false;
            break;
        } else if (key !== name && item.hasError) {
            isFormValid = false;
            break;
        }
    }

    dispatch({
        type: UPDATE_FORM,
        data: {
            name,
            value,
            hasError,
            error,
            touched: false,
            isFormValid
        }
    });
};