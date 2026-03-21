import PageWrapper from "@/components/safepark/PageWrapper";
import { Outlet } from "react-router-dom";

const UserOnboarding = () => (
  <PageWrapper>
    <p className="text-sp-text-secondary">User Onboarding — placeholder</p>
    <Outlet />
  </PageWrapper>
);

export default UserOnboarding;
