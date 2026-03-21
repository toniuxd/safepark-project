import PageWrapper from "@/components/safepark/PageWrapper";
import { Outlet } from "react-router-dom";

const OwnerOnboarding = () => (
  <PageWrapper>
    <p className="text-sp-text-secondary">Owner Onboarding — placeholder</p>
    <Outlet />
  </PageWrapper>
);

export default OwnerOnboarding;
