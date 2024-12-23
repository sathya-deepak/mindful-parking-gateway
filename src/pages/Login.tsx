import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsAdmin: (value: boolean) => void;
}

const Login = ({ setIsAdmin }: LoginProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = () => {
    setLoading(true);
    setIsAdmin(true);
    setTimeout(() => {
      navigate("/admin");
      setLoading(false);
    }, 1000);
  };

  const handleUserLogin = () => {
    setLoading(true);
    setIsAdmin(false);
    setTimeout(() => {
      navigate("/user");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Parking System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={handleAdminLogin}
            disabled={loading}
          >
            Login as Admin
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleUserLogin}
            disabled={loading}
          >
            Login as User
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;