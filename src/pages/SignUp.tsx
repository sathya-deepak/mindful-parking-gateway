import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, User, Mail, Phone, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    carPlate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = () => {
    console.log("Sign up form submitted:", formData);
    
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Demo signup success
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
      });
      navigate("/login");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <Car className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Smart Parking System
        </h1>
        <p className="text-lg text-gray-600">
          Create your account to start parking smarter
        </p>
      </div>

      <Card className="w-full max-w-[450px] shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-800">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <InputWithIcon
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full"
                  icon={<User className="w-4 h-4" />}
                />
              </div>
              <div className="flex-1">
                <InputWithIcon
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <InputWithIcon
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full"
                  icon={<Key className="w-4 h-4" />}
                />
              </div>
              <div className="flex-1">
                <InputWithIcon
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full"
                  icon={<Key className="w-4 h-4" />}
                />
              </div>
            </div>

            <InputWithIcon
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full"
              icon={<User className="w-4 h-4" />}
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <InputWithIcon
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full"
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>
              <div className="flex-1">
                <InputWithIcon
                  placeholder="Car Plate Number"
                  name="carPlate"
                  value={formData.carPlate}
                  onChange={handleInputChange}
                  className="w-full"
                  icon={<Car className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl" 
            onClick={handleSignUp}
            disabled={loading}
          >
            <User className="w-4 h-4" />
            Create Account
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Login here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;