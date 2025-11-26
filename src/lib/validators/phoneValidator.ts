export const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone) {
        return false;
    }
    // Simple regex for international phone numbers (E.164 format)
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
}