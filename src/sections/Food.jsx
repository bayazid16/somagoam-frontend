// 1. Import the images from your assets folder
import roshmalaiImg from '../assets/cumilla_roshmalai.png';
import chomchomImg from '../assets/tangail_chomchom.jpg';
import patisaptaImg from '../assets/Patishapta.png';

export default function Food() {
  // 2. Assign the imported variables to your data array
  const foods = [
    { 
      name: "Cumilla Roshmalai", 
      img: roshmalaiImg, 
      desc: "Pure milk-based heritage dessert" 
    },
    { 
      name: "Tangail Chomchom", 
      img: chomchomImg, 
      desc: "The King of Sweets from Porabari" 
    },
    { 
      name: "Patisapta Pitha", 
      img: patisaptaImg, 
      desc: "Thin rice-flour crepes with Kheer filling" 
    }
  ];

  return (
    <section id="food" className="px-10 py-16 bg-stone-100/50">
      <h2 className="text-3xl serif mb-10 border-b border-stone-200 pb-4">
        Traditional <span className="brand-color">GI Food</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {foods.map((food, i) => (
          <div key={i} className="traditional-card group">
            <div className="h-48 overflow-hidden">
              {/* 3. food.img is now a variable, so it works perfectly */}
              <img 
                src={food.img} 
                alt={food.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="serif text-xl">{food.name}</h3>
              <p className="text-sm text-stone-600 mt-2 italic">{food.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}