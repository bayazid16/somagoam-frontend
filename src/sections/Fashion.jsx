// 1. Import your images as variables
import tangailSaree from '../assets/tangail_sareee.jpg';
import rajshahiSilk from '../assets/rajshahi_silk_saree.png';
import khadiPanjabi from '../assets/khadi_panjabi.png';

export default function Fashion() {
  return (
    <section className="px-10 py-16">
      <h2 className="text-3xl serif mb-10 border-b border-stone-200 pb-4">
        Heritage <span className="brand-color">Fashion</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="traditional-card p-4">
           {/* 2. Use the variable name inside curly braces */}
           <img src={tangailSaree} className="w-full h-64 object-cover mb-4 grayscale hover:grayscale-0 transition duration-500" alt="Tangail Jamdani" />
           <h3 className="serif text-xl">Tangail Jamdani</h3>
           <p className="text-xs text-stone-500 uppercase tracking-widest">GI Certified Wear</p>
        </div>

        {/* Card 2 */}
        <div className="traditional-card p-4">
            <img 
              src={rajshahiSilk} 
              className="w-full h-64 object-cover mb-4 grayscale hover:grayscale-0 transition duration-500" 
              alt="Rajshahi Silk"
            />
            <h3 className="serif text-xl">Rajshahi Silk</h3>
            <p className="text-xs text-stone-500 uppercase tracking-widest">Pure Mulberry Silk</p>
        </div>

        {/* Card 3 */}
        <div className="traditional-card p-4">
            <img 
              src={khadiPanjabi} 
              className="w-full h-64 object-cover mb-4 grayscale hover:grayscale-0 transition duration-500" 
              alt="Cumilla Khadi"
            />
            <h3 className="serif text-xl">Cumilla Khadi</h3>
            <p className="text-xs text-stone-500 uppercase tracking-widest">Hand-spun Cotton</p>
        </div>

      </div>
    </section>
  );
}