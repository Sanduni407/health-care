import Navbar from "../../components/Navbar/Navbar";
import { Calendar, Clock, Shield, Heart, Activity, Stethoscope, Users, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';



export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: "Easy Appointments",
      description: "Book your medical appointments online with ease"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock healthcare assistance"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected and confidential"
    },
    {
      icon: Heart,
      title: "Quality Care",
      description: "Access to experienced healthcare professionals"
    }
  ];

  const departments = [
    { icon: Heart, name: "Cardiology", description: "Heart care specialists" },
    { icon: Activity, name: "Gynecology", description: "Women's health" },
    { icon: Users, name: "Nursing", description: "Professional nursing care" },
    { icon: FileText, name: "Pharmacy", description: "Medicine services" },
    { icon: Stethoscope, name: "Emergency", description: "24/7 urgent care" }
  ];
   const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden min-h-[600px]">
        {/* Background Image - No Overlay */}
       
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1200')"
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              INTRODUCING A NEW INFORMATION SYSTEM
            </h1>
            <p className="text-xl md:text-2xl text-white drop-shadow-md">
              where service is shared, managed and is actively used
            </p>
          </div>
        </div>
      </div>

      {/* Three Column Info Section - Glassmorphism Cards */}
      <div className="bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Doctors Timetable */}
            <div className="bg-white/40 backdrop-blur-md rounded-lg p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Doctors Timetable</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The following is the guidelines that is used to set our doctor appointments and fixed time.
              </p>
              <button className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all font-medium">
                View Timetable →
              </button>
            </div>

            {/* Our Benefits */}
            <div className="bg-white/40 backdrop-blur-md rounded-lg p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Benefits</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>Qualified list of Doctors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>Get Your Money and Time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>24hr Emergency services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>We care you all at Home Services</span>
                </li>
              </ul>
            </div>

            {/* Our Working Hours */}
            <div className="bg-white/40 backdrop-blur-md rounded-lg p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Working Hours</h3>
              <p className="text-gray-700 mb-4">
                It is a long established fact that a reader will be...
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong className="text-gray-800">Monday - Friday:</strong> 08.00-20.00</p>
                <p><strong className="text-gray-800">Saturday:</strong> 09.00-18.30</p>
                <p><strong className="text-gray-800">Thursday - Friday:</strong> 08.00-20.00</p>
                <p><strong className="text-gray-800">Sunday:</strong> Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department List */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Department List
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all border border-gray-100 hover:border-teal-200 cursor-pointer"
              >
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <dept.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {dept.name}
                </h3>
                <p className="text-sm text-gray-600">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive healthcare solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of satisfied patients managing their healthcare online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-md hover:bg-gray-100 transition-all shadow-md"
            >
              Get Started Today
            </a>
            <a
              href="/login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-teal-600 transition-all"
            >
              Already a Member?
            </a>
             <button 
      onClick={() => navigate('/outstanding-bills')}
      className="bg-blue-500 text-white px-6 py-3 rounded-lg"
      
    >
      View Outstanding Bills
    </button>
          </div>
        </div>
      </div>
    </>
  );
}