import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Landmark, Globe } from 'lucide-react';

export default function Features() {
  const navigate = useNavigate();

  const featureData = [
    { 
      title: "Authenticity", 
      desc: "Every product is verified with mandatory GI documentation and lab tests for food categories.",
      icon: <ShieldCheck className="w-5 h-5" />,
      link: "/reviews" // Leads to verified heritage voices
    },
    { 
      title: "Direct Source", 
      desc: "Eliminating the middleman. We connect you directly to the looms and workshops of Bangladesh.",
      icon: <UserCheck className="w-5 h-5" />,
      link: "/crafts" // Leads to artisan crafts
    },
    { 
      title: "Heritage", 
      desc: "From Jamdani to Rajshahi Silk, we curate items that reflect the soul of our nation.",
      icon: <Landmark className="w-5 h-5" />,
      link: "/fashion" // Leads to heritage fashion
    },
    { 
      title: "Global Reach", 
      desc: "Bringing the heritage of Bengal to the 7.5 million expatriates living worldwide.",
      icon: <Globe className="w-5 h-5" />,
      link: "/food" // Leads to regional food (often requested by expats)
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 md:px-10 py-20 bg-[#F9F7F2]">
      {featureData.map((f, i) => (
        <div 
          key={i} 
          onClick={() => navigate(f.link)}
          className="glass-card p-8 group border border-stone-200 hover:border-[#A33B26] transition-all duration-500 cursor-pointer bg-white flex flex-col justify-between"
        >
          <div>
            <div className="text-[#A33B26] mb-6 transition-transform duration-500 group-hover:scale-110">
              {f.icon}
            </div>
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-stone-500 mb-4 uppercase">{f.title}</h3>
            <p className="text-sm text-stone-700 mb-8 leading-relaxed font-light">{f.desc}</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-[#A33B26] transition-colors">
            Explore <span className="transition-transform group-hover:translate-x-1">↗</span>
          </span>
        </div>
      ))}
    </section>
  );
}