import React from 'react';

export default function Producers() {
  // Eventually, you'll fetch this from Bayazid's backend
  const producers = [
    { id: 1, name: "Jamdani Weavers Guild", location: "Narayanganj", specialty: "Handloom Fashion" },
    { id: 2, name: "Rajshahi Silk Collective", location: "Rajshahi", specialty: "Pure Silk" },
    { id: 3, name: "Satranji Artisans", location: "Rangpur", specialty: "Home Decor" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl serif mb-2">Our Heritage Producers</h2>
      <p className="text-stone-500 mb-10">Connecting you directly with the roots of Bangladesh.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {producers.map((p) => (
          <div key={p.id} className="border border-stone-200 p-6 hover:shadow-lg transition-shadow bg-white">
            <h3 className="text-xl font-bold brand-color uppercase mb-1">{p.name}</h3>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">{p.location}</p>
            <p className="text-sm text-stone-600 mb-6">{p.specialty}</p>
            <button className="text-xs font-bold underline uppercase tracking-tighter">View Collection</button>
          </div>
        ))}
      </div>
    </div>
  );
}