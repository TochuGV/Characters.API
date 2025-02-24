export const getCurrentCreationDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
}