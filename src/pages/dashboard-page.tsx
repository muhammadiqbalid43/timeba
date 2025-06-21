import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";

const DashboardPage = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <div>
      Dashboard Page <Button onClick={handleLogout}>Sign Out</Button>
    </div>
  );
};

export default DashboardPage;
