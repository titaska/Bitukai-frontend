import { createContext, useContext } from "react";

interface BusinessContextProps {
    registrationNumber: string;
    setRegistrationNumber: (value: string) => void;
}

export const BusinessContext = createContext<BusinessContextProps>({
    registrationNumber: "",
    setRegistrationNumber: () => {},
});

export const useBusiness = () => useContext(BusinessContext);