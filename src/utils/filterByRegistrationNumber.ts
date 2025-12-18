export const filterByRegistrationNumber = (items: any[], regNumber: string) =>
    items.filter(item => item.registrationNumber === regNumber);