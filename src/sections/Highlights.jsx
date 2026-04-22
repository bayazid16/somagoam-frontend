// 1. Import the specific icons you need
import { ShieldCheck, MapPin, Truck, Users } from 'lucide-react';

export default function Highlights() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-stone-200 bg-white">
      
      {/* GI Verified */}
      <div className="p-10 border-r border-stone-100 flex flex-col items-center text-center">
        <div className="brand-color mb-4">
          <ShieldCheck size={32} strokeWidth={1.5} />
        </div>
        <h3 className="serif text-lg mb-2">GI Verified</h3>
        <p className="text-[10px] text-stone-500 uppercase tracking-wider">Certified Authenticity</p>
      </div>

      {/* Direct Source */}
      <div className="p-10 border-r border-stone-100 flex flex-col items-center text-center">
        <div className="brand-color mb-4">
          <MapPin size={32} strokeWidth={1.5} />
        </div>
        <h3 className="serif text-lg mb-2">Direct Source</h3>
        <p className="text-[10px] text-stone-500 uppercase tracking-wider">Village to Doorstep</p>
      </div>

      {/* Fast Shipping */}
      <div className="p-10 border-r border-stone-100 flex flex-col items-center text-center">
        <div className="brand-color mb-4">
          <Truck size={32} strokeWidth={1.5} />
        </div>
        <h3 className="serif text-lg mb-2">Fast Shipping</h3>
        <p className="text-[10px] text-stone-500 uppercase tracking-wider">Global Logistics</p>
      </div>

      {/* Artisan First */}
      <div className="p-10 flex flex-col items-center text-center">
        <div className="brand-color mb-4">
          <Users size={32} strokeWidth={1.5} />
        </div>
        <h3 className="serif text-lg mb-2">Artisan First</h3>
        <p className="text-[10px] text-stone-500 uppercase tracking-wider">Supporting 100+ Families</p>
      </div>

    </section>
  );
}