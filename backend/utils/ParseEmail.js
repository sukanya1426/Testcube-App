export const parseEmail = (email) => {
    const prefix = email.split('@')[0];
    return prefix;
}