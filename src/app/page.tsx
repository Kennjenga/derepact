"use client";

import { useState } from "react";
import { DollarSign, Users, Shield, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [distance, setDistance] = useState(5);
  const [isPartnerRide, setIsPartnerRide] = useState(false);

  const estimateFare = () => {
    const baseFare = 100; // Base fare in Ksh
    const ratePerKm = 30; // Rate per km in Ksh
    let estimatedFare = baseFare + distance * ratePerKm;
    if (isPartnerRide) {
      estimatedFare *= 0.9; // 10% discount for partner rides
    }
    return Math.round(estimatedFare); // Round to nearest whole Ksh
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <header className="flex justify-between items-center py-6">
          <div className="text-2xl font-bold text-blue-600">Derepact Rides</div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#home"
                  className="hover:text-blue-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-500 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#fare-calculator"
                  className="hover:text-blue-500 transition-colors"
                >
                  Fare Calculator
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-blue-500 transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
          <Link
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Get Started
          </Link>
        </header>

        <section id="home" className="text-center py-20">
          <h1 className="text-5xl font-bold mb-4 text-blue-700">
            Welcome to Derepact Rides
          </h1>
          <p className="text-xl mb-6 text-gray-600">
            Connecting Riders and Drivers with Fair and Transparent Fares
          </p>
          <button className="bg-green-500 text-white px-6 py-3 rounded text-lg font-semibold hover:bg-green-600 transition-colors">
            Book a Ride
          </button>
        </section>

        <section id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign className="w-8 h-8 text-green-500" />,
                title: "Fair Pricing",
                description:
                  "Transparent fare calculation with no hidden charges.",
              },
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                title: "Partner Rides",
                description: "Share rides with partners for discounted fares.",
              },
              {
                icon: <Shield className="w-8 h-8 text-red-500" />,
                title: "Issue Resolution",
                description: "Quick and fair resolution for any fare disputes.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-2">
                    {feature.title}
                  </h3>
                </div>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="fare-calculator"
          className="py-20 bg-white rounded-lg shadow-lg p-8 mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
            Fare Calculator
          </h2>
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <label
                htmlFor="distance"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Estimated Distance (km)
              </label>
              <input
                type="range"
                id="distance"
                min="1"
                max="50"
                step="1"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-right mt-2">{distance} km</p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label
                htmlFor="partner-ride"
                className="text-sm font-medium text-gray-700"
              >
                Partner Ride
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="partner-ride"
                  checked={isPartnerRide}
                  onChange={() => setIsPartnerRide(!isPartnerRide)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="partner-ride"
                  className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    isPartnerRide ? "bg-green-400" : ""
                  }`}
                ></label>
              </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold mb-2">Estimated Fare</h3>
              <p className="text-4xl font-bold text-green-600">
                Ksh {estimateFare()}
              </p>
              {isPartnerRide && (
                <p className="text-sm text-gray-500 mt-2">
                  Includes 10% partner ride discount
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-blue-50 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
            About Derepact Rides
          </h2>
          <p className="text-center max-w-2xl mx-auto text-gray-600">
            Derepact Rides is dedicated to providing fair and transparent
            ride-sharing services in Kenya. We focus on solving common issues
            between drivers and riders, ensuring a smooth experience for
            everyone involved while offering competitive rates in Kenyan
            Shillings.
          </p>
        </section>

        <section id="testimonials" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Fair prices and great service!",
                user: "Alex K., Rider",
              },
              {
                quote: "The partner ride feature saves me money!",
                user: "Sam T., Regular User",
              },
              {
                quote: "Quick resolution to fare issues.",
                user: "Jamie L., Driver",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-center mb-4">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="text-center text-sm text-gray-500">
                  - {testimonial.user}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center py-8 border-t mt-20">
          <p className="text-gray-600">
            &copy; 2024 Derepact Rides. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
