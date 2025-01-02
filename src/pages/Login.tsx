import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginProps {
  setIsAdmin: (value: boolean) => void;
}

const Login = ({ setIsAdmin }: LoginProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    if (username === "admin" && password === "admin123") {
      setLoading(true);
      setIsAdmin(true);
      toast({
        title: "Welcome Admin",
        description: "Successfully logged in as administrator",
      });
      setTimeout(() => {
        navigate("/admin");
        setLoading(false);
      }, 1000);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
    }
  };

  const handleUserLogin = () => {
    if (username === "user" && password === "user123") {
      setLoading(true);
      setIsAdmin(false);
      toast({
        title: "Welcome User",
        description: "Successfully logged in as user",
      });
      setTimeout(() => {
        navigate("/user");
        setLoading(false);
      }, 1000);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid user credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <Car className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Smart Parking System
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Demo Credentials:<br />
          Admin: admin/admin123<br />
          User: user/user123
        </p>
      </div>

      <Card className="w-full max-w-[350px] shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-800">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl" 
            onClick={handleAdminLogin}
            disabled={loading}
          >
            <Key className="w-4 h-4" />
            Login as Admin
          </Button>
          <Button 
            className="w-full border-2 border-purple-200 hover:border-purple-300 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg" 
            variant="outline"
            onClick={handleUserLogin}
            disabled={loading}
          >
            <Car className="w-4 h-4" />
            Login as User
          </Button>
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign up here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;