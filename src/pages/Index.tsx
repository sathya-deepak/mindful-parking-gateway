import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Key, Calendar, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 animate-fade-in">
        <div className="relative">
          <Car className="w-24 h-24 mx-auto mb-6 text-purple-600 animate-bounce" />
          <div className="absolute -top-2 -right-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Parking System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Experience the future of parking management with real-time availability tracking 
          and instant booking capabilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/login")}
          >
            Get Started
            <Shield className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <Car className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Real-time Tracking</h3>
          <p className="text-gray-600">Monitor parking spot availability instantly with our advanced tracking system</p>
        </div>
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <Key className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure Access</h3>
          <p className="text-gray-600">Advanced security protocols for both users and administrators</p>
        </div>
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Easy Booking</h3>
          <p className="text-gray-600">Book your parking spot in seconds with our streamlined system</p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">© 2024 Smart Parking System. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Index;