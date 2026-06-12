import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const producersData = [
  {
    id: 1,
    name: "Rajbari Spice Collective",
    specialty: "Premium Coriander (Dhonia) & Spices",
    location: "Rajbari, Bangladesh",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "A dedicated collective of local farmers specializing in high-grade, organically grown spices and herbs.",
  },
  {
    id: 2,
    name: "Tangail Weavers Guild",
    specialty: "Handloom Sarees & Textiles",
    location: "Tangail, Bangladesh",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=600&q=80",
    description: "Generations of artisans crafting traditional, high-quality textiles utilizing sustainable weaving practices.",
  },
  {
    id: 3,
    name: "Sylhet Heritage Farms",
    specialty: "Organic Black & Green Tea",
    location: "Sylhet, Bangladesh",
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1596065959546-5f75e01f609e?auto=format&fit=crop&w=600&q=80",
    description: "Ethically sourced, hand-picked tea leaves harvested from the rolling hills and estates of Sylhet.",
  }
];

export default function Producers() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">
            Meet Our Producers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the dedicated artisans, farmers, and creators behind the authentic products on Somagom.
          </p>
        </div>

        {/* Producers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {producersData.map((producer) => (
            <div
              key={producer.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={producer.image} 
                  alt={producer.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium text-gray-800 shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {producer.rating}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  {producer.location}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {producer.name}
                </h3>
                
                <p className="text-sm font-medium text-[#A33B26] mb-3">
                  {producer.specialty}
                </p>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {producer.description}
                </p>

                <button className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors text-sm font-medium border border-gray-200">
                  View Storefront
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
