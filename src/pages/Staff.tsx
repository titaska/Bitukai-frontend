import StaffListPage from "./StaffListPage";

type Props = {
  registrationNumber: string;
  businessType: "CATERING" | "BEAUTY";
};

export default function Staff({ registrationNumber, businessType }: Props) {
  return (
    <StaffListPage
      registrationNumber={registrationNumber}
      businessType={businessType}
    />
  );
}
