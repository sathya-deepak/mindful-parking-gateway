import { MapPin, Car, Navigation } from "lucide-react";

interface ProgressStepsProps {
  currentStep: 'select-location' | 'manage-spots' | 'view-route';
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center ${currentStep === 'select-location' ? 'text-blue-600' : 'text-gray-400'}`}>
          <MapPin className="h-5 w-5 mr-2" />
          <span>Select Location</span>
        </div>
        <div className="h-px w-8 bg-gray-300" />
        <div className={`flex items-center ${currentStep === 'manage-spots' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Car className="h-5 w-5 mr-2" />
          <span>Manage Spots</span>
        </div>
        <div className="h-px w-8 bg-gray-300" />
        <div className={`flex items-center ${currentStep === 'view-route' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Navigation className="h-5 w-5 mr-2" />
          <span>View Route</span>
        </div>
      </div>
    </div>
  );
};