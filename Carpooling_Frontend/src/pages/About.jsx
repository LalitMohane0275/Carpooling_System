import { Users, Target, Shield, Globe, Leaf, Car, Heart, MapPin, Zap, DollarSign, Smile } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Transforming <span className="text-blue-200">Commutes</span>,<br />
            Connecting <span className="text-blue-200">Communities</span>
          </h1>
          <p className="text-2xl text-blue-100 max-w-3xl leading-relaxed">
            At RideBuddy, we're on a mission to revolutionize daily commuting, making it more sustainable, affordable,
            and social for everyone.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Our Story"
                className="rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-5xl font-bold text-blue-900 mb-8">Our Story</h2>
              <p className="text-xl text-blue-700 mb-6 leading-relaxed">
                Founded in 2025, RideBuddy emerged from a simple observation: too many cars on the road with just one
                person in them. We believed there had to be a better way to commute.
              </p>
              <p className="text-xl text-blue-700 leading-relaxed mb-8">
                What started as a small carpooling initiative has grown into a nationwide community of conscious
                commuters who share not just rides, but also a vision for a more sustainable future.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-blue-900 font-semibold">500K+ Users</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-blue-900 font-semibold">5M+ Rides Shared</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-blue-900 mb-20">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: <Shield className="h-10 w-10" />,
                title: "Safety First",
                description: "We prioritize the safety and security of our community above all else.",
              },
              {
                icon: <Globe className="h-10 w-10" />,
                title: "Sustainability",
                description: "Every shared ride contributes to a healthier planet for future generations.",
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Community",
                description: "Building meaningful connections through shared journeys.",
              },
              {
                icon: <Heart className="h-10 w-10" />,
                title: "Trust",
                description: "Fostering a reliable and transparent environment for all users.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 p-4 rounded-2xl w-fit mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">{value.title}</h3>
                <p className="text-lg text-blue-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-10 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Car className="h-16 w-16 mx-auto mb-6 text-blue-200" />
              <div className="text-5xl font-bold mb-4">50K+</div>
              <div className="text-xl text-blue-200">Active Drivers</div>
            </div>
            <div className="text-center p-10 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <MapPin className="h-16 w-16 mx-auto mb-6 text-blue-200" />
              <div className="text-5xl font-bold mb-4">100+</div>
              <div className="text-xl text-blue-200">Cities Covered</div>
            </div>
            <div className="text-center p-10 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Leaf className="h-16 w-16 mx-auto mb-6 text-blue-200" />
              <div className="text-5xl font-bold mb-4">1.2M</div>
              <div className="text-xl text-blue-200">CO₂ Emissions Saved (kg)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-blue-900 mb-20">Why Choose RideBuddy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Zap className="h-12 w-12 text-blue-500" />,
                title: "Efficient Commutes",
                description: "Save time with optimized routes and reduced traffic congestion.",
              },
              {
                icon: <DollarSign className="h-12 w-12 text-blue-500" />,
                title: "Cost-Effective",
                description: "Share ride expenses and significantly reduce your commuting costs.",
              },
              {
                icon: <Smile className="h-12 w-12 text-blue-500" />,
                title: "Social Experience",
                description: "Meet like-minded individuals and make your commute more enjoyable.",
              },
            ].map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">{benefit.title}</h3>
                <p className="text-lg text-blue-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-blue-900 mb-20">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Co-founder",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
              },
              {
                name: "Michael Chen",
                role: "CTO & Co-founder",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Operations",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-blue-100"
                />
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{member.name}</h3>
                <p className="text-xl text-blue-700">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8">Join Our Mission</h2>
          <p className="text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Be part of the transportation revolution. Together, we can create a more sustainable, connected, and
            efficient future for commuting.
          </p>
          <button className="px-10 py-4 bg-white text-blue-700 rounded-full text-xl font-semibold hover:bg-blue-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Join RideBuddy Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default About

