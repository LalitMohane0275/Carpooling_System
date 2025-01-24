import { Star } from "lucide-react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ name, quote }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Star className="text-yellow-400 h-5 w-5" />
        <Star className="text-yellow-400 h-5 w-5" />
        <Star className="text-yellow-400 h-5 w-5" />
        <Star className="text-yellow-400 h-5 w-5" />
        <Star className="text-yellow-400 h-5 w-5" />
      </div>
      <p className="text-gray-600 mb-4">"{quote}"</p>
      <p className="font-semibold">{name}</p>
    </div>
  );
};

export { FeatureCard, TestimonialCard, StepCard };
