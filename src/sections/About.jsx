// 1. Import the image from your assets folder
import storyImg from '../assets/home_story.jpg';

export default function About() {
  return (
    <section id="about" className="grid grid-cols-1 md:grid-cols-2 gap-0 py-20 px-10">
      
      {/* Text Content */}
      <div className="glass-card p-12 flex flex-col justify-center">
        <h4 className="brand-color text-xs uppercase tracking-widest mb-6">About Somagom</h4>
        <h2 className="text-4xl serif mb-6 leading-snug">
          Where Tradition Meets <br /> Modern Trust
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Somagom is a digital platform that directly connects Bangladeshi producers of Geographical
          Indication (GI) and heritage products with national and international consumers.
        </p>
        <button className="border border-[rgba(163,59,38,0.4)] w-max px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-[var(--heritage-red)] hover:text-white transition">
          Our Full Story
        </button>
      </div>

      {/* Image Content */}
      <div className="bg-zinc-200 h-96 md:h-auto relative overflow-hidden">
        <img 
          src={storyImg} // 2. Use the imported variable
          alt="Artisanship" 
          className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition duration-1000" 
        />
      </div>
      
    </section>
  );
}