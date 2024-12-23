import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Key } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <Car className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Smart Parking System
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Efficient parking management solution for both users and administrators
        </p>
      </div>

      <Card className="w-full max-w-[350px] shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-800">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2" 
            onClick={handleAdminLogin}
            disabled={loading}
          >
            <Key className="w-4 h-4" />
            Login as Admin
          </Button>
          <Button 
            className="w-full border-2 border-purple-200 hover:border-purple-300 transition-all flex items-center justify-center gap-2" 
            variant="outline"
            onClick={handleUserLogin}
            disabled={loading}
          >
            <Car className="w-4 h-4" />
            Login as User
          </Button>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
        <div className="text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Real-time Tracking</h3>
          <p className="text-sm text-gray-600">Monitor parking spots availability in real-time</p>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Secure Access</h3>
          <p className="text-sm text-gray-600">Advanced security for both users and administrators</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Easy Booking</h3>
          <p className="text-sm text-gray-600">Simple and quick parking spot reservation</p>
        </div>
      </div>
    </div>
  );
};

export default Login;