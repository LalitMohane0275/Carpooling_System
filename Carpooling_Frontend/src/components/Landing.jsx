import React from "react";
import { Users, DollarSign, Leaf, ChevronRight } from "lucide-react";
import { FeatureCard, TestimonialCard, StepCard } from "./LandingPageComp";
import carpool from "../assets/images/carpool.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Share Rides, Save Money, Reduce Emissions
              </h1>
              <p className="text-xl mb-6">
                Join RideBuddy today and experience a smarter way to commute!
              </p>
              <button className="px-6 py-3 bg-white text-green-500 rounded-full font-semibold flex items-center hover:bg-gray-100">
                Get Started <ChevronRight className="ml-2" />
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={carpool}
                alt="Carpooling Illustration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose RideBuddy?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<DollarSign className="h-12 w-12 text-green-500" />}
                title="Save Money"
                description="Split costs with fellow commuters and reduce your transportation expenses."
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 text-blue-500" />}
                title="Meet New People"
                description="Connect with like-minded individuals and expand your social network."
              />
              <FeatureCard
                icon={<Leaf className="h-12 w-12 text-green-500" />}
                title="Reduce Carbon Footprint"
                description="Help the environment by sharing rides and reducing the number of cars on the road."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How RideBuddy Works
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
              <StepCard
                number={1}
                title="Sign Up"
                description="Create your account and set up your profile."
              />
              <StepCard
                number={2}
                title="Find a Ride"
                description="Search for available rides or offer your own."
              />
              <StepCard
                number={3}
                title="Connect"
                description="Chat with potential ride buddies and confirm details."
              />
              <StepCard
                number={4}
                title="Ride Together"
                description="Meet up and enjoy your shared journey!"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah L."
                quote="RideBuddy has transformed my daily commute. I've saved money and made new friends!"
              />
              <TestimonialCard
                name="Mike T."
                quote="As a driver, I love how easy it is to find passengers and split costs. Highly recommended!"
              />
              <TestimonialCard
                name="Emily R."
                quote="The app is user-friendly, and the community is fantastic. It's a win-win for everyone!"
              />
            </div>
          </div>
        </section>

        {/* Environmental Impact Section */}
        <section className="py-20 bg-green-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Make a Difference with Every Ride
            </h2>
            <p className="text-xl mb-8">
              Join our community of eco-conscious commuters and help reduce CO2
              emissions.
            </p>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-4xl font-bold">1,234,567</div>
              <div className="text-left">
                <div className="text-2xl font-semibold">kg of CO2 saved</div>
                <div>by our RideBuddy community</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your RideBuddy Journey?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of happy commuters and start saving today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Sign Up Now
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
