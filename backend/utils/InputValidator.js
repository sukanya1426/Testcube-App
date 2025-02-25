class InputValidator {

    static isValidInfo = (email, password, confirmPassword) => {
        const emailValidation = this.isValidEmail(email);
        const passwordValidation = this.isValidPassword(password, confirmPassword);

        if (!emailValidation.isValid) {
            return {
                message: emailValidation.message,
                isValid: false
            };
        }

        if (!passwordValidation.isValid) {
            return {
                message: passwordValidation.message,
                isValid: false
            };
        }

        return {
            message: "Valid input.",
            isValid: true
        };
    } 

    static isValidEmail = (email) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!email) {
            return {
                message: "Email is required.",
                isValid: false
            };
        }

        if (!gmailRegex.test(email)) {
            return {
                message: "Invalid Email address.",
                isValid: false
            };
        }

        return {
            message: "Valid Gmail address.",
            isValid: true
        };
    }

    static isValidPassword = (password, confirmPassword) => {
        if (!password || !confirmPassword) {
            return {
                message: "Password and Confirm Password are required.",
                isValid: false
            };
        }

        if (password.length < 8) {
            return {
                message: "Password must be at least 8 characters.",
                isValid: false
            };
        }

        if (password !== confirmPassword) {
            return {
                message: "Password and Confirm Password do not match.",
                isValid: false
            };
        }


        return {
            message: "Password and Confirm Password match.",
            isValid: true
        };
    }
}

export default InputValidator;