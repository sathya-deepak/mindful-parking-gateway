import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Key } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <Car className="w-20 h-20 mx-auto mb-6 text-purple-600" />
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Smart Parking System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Find and manage parking spots with ease. Real-time availability and instant booking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Car className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
          <p className="text-gray-600">Monitor parking spots availability instantly</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Key className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
          <p className="text-gray-600">Advanced security for users and administrators</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Car className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
          <p className="text-gray-600">Book your parking spot in seconds</p>
        </div>
      </div>
    </div>
  );
};

export default Index;