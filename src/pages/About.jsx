import React from 'react';
import artisticHand from '../assets/artistic_hand.jpg'; 

export default function About() {
  const philosophies = [
    {
      id: "01",
      title: "The Soil",
      desc: "A Geographical Indication is tied to the earth. The mineral-rich silt of the Padma gives the Ilish its fat; the humid air of Narayanganj allows the Jamdani thread to stay supple."
    },
    {
      id: "02",
      title: "The Skill",
      desc: "Inherited mastery cannot be replicated by machines. Our artisans possess 'muscle memory' passed down through generations, ensuring flavors that factories can never mimic."
    },
    {
      id: "03",
      title: "The Shield",
      desc: "Your purchase acts as a protective shield. By choosing certified GI products, you prevent legal copyright theft of our national culture."
    }
  ];

  const pillars = [
    { name: "Provenance", meaning: "Tracing every item back to its specific village and artisan family.", commitment: "No third-party middlemen or fake labels." },
    { name: "Purity", meaning: "Lab-testing food items for preservatives and textiles for fiber content.", commitment: "100% natural and safe materials." },
    { name: "Prosperity", meaning: "Ensuring 70% of the sale price goes directly back into the communities.", commitment: "Empowering the rural economy." }
  ];

  return (
    <div className="bg-[#F9F7F2]">
      {/* Hero Section */}
      <section className="px-10 py-24 text-center max-w-5xl mx-auto">
        <span className="brand-color text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Heritage Preservation Network</span>
        <h1 className="text-5xl md:text-8xl serif mb-10 leading-tight">Authenticity is our <span className="italic font-light">Ancestry.</span></h1>
        <div className="w-20 h-1 bg-[#A33B26] mx-auto mb-10"></div>
        <p className="text-xl text-stone-600 leading-relaxed font-light max-w-3xl mx-auto">
          Somagom isn't just a marketplace; it is a movement to protect the <span className="brand-color font-semibold">Geographical Indication (GI)</span> status of Bangladesh's most iconic treasures.
        </p>
      </section>

      {/* Story Section */}
      <section className="px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-stone-200">
        <div className="space-y-6 text-stone-600 text-sm leading-loose">
          <h2 className="text-4xl serif mb-8 text-stone-900">Beyond the Label</h2>
          <p>
            Every product on this platform carries a story that spans centuries. When you hold a <strong>Dhakai Jamdani</strong>, you aren't just holding fabric; you are holding a weaving tradition that survived the colonial era.
          </p>
          <p>
            <strong>Somagom was founded in 2024</strong> to create a digital sanctuary where the provenance of every item is verified and the lineage of every weaver is respected.
          </p>
        </div>
        <div className="relative">
          <img src={artisticHand} alt="Weaving" className="w-full h-[500px] object-cover shadow-[20px_20px_0px_rgba(163,59,38,0.05)]" />
          <div className="absolute -bottom-6 -left-6 bg-white p-8 border-l-4 border-[#A33B26] shadow-lg max-w-xs">
            <p className="serif italic text-lg">"We weave not just with thread, but with the memories of our fathers."</p>
            <p className="text-[10px] uppercase tracking-widest mt-4 font-bold text-stone-400">— Master Weaver, Tangail</p>
          </div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="bg-[#F2EBE1] py-24 px-10 border-y border-stone-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophies.map((p, i) => (
            <div key={i} className="bg-white p-10 border border-stone-100 hover:border-[#A33B26] transition-transform hover:-translate-y-2">
              <div className="w-12 h-12 flex items-center justify-center bg-[#A33B26] text-white mb-6 serif text-2xl">{p.id}</div>
              <h3 className="serif text-2xl mb-4 brand-color">{p.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Table */}
      <section className="px-10 py-24 max-w-5xl mx-auto">
        <h2 className="serif text-4xl mb-12 text-center">Our Core Pillars</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-800 text-[10px] uppercase tracking-widest font-bold">
                <th className="py-4">Pillar</th>
                <th className="py-4">What it Means</th>
                <th className="py-4">Our Commitment</th>
              </tr>
            </thead>
            <tbody className="text-sm text-stone-600">
              {pillars.map((pillar, i) => (
                <tr key={i} className="border-b border-stone-200">
                  <td className="py-6 font-bold text-stone-900 serif text-lg">{pillar.name}</td>
                  <td className="py-6 pr-6">{pillar.meaning}</td>
                  <td className="py-6 italic">{pillar.commitment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}