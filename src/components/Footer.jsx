export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-16 px-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="logo-box border-white text-white mb-6 uppercase tracking-tighter serif">
            SOMAGOM
          </div>
          <p className="text-xs text-stone-400 leading-relaxed uppercase tracking-widest">
            Preserving heritage through equitable commerce.
          </p>
        </div>
        
        <div>
          <h4 className="serif text-lg mb-6">Collection</h4>
          <ul className="text-xs space-y-4 text-stone-400 uppercase tracking-widest">
            <li><a href="/food" className="hover:text-white transition">Heritage Food</a></li>
            <li><a href="/fashion" className="hover:text-white transition">Fashion Hub</a></li>
            <li><a href="/crafts" className="hover:text-white transition">GI Crafts</a></li>
          </ul>
        </div>

        <div>
          <h4 className="serif text-lg mb-6">Support</h4>
          <ul className="text-xs space-y-4 text-stone-400 uppercase tracking-widest">
            <li className="cursor-pointer hover:text-white">Authenticity Policy</li>
            <li className="cursor-pointer hover:text-white">Shipping Info</li>
            <li className="cursor-pointer hover:text-white">Producer Sign-up</li>
          </ul>
        </div>

        <div>
          <h4 className="serif text-lg mb-6">Newsletter</h4>
          <div className="flex flex-col">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="bg-transparent border-b border-stone-700 w-full py-2 text-[10px] focus:outline-none focus:border-white transition"
            />
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-stone-800 text-center">
        <p className="text-[9px] uppercase tracking-[0.5em] text-stone-500">
          © 2026 SOMAGOM — AUTHENTICITY GUARANTEED
        </p>
      </div>
    </footer>
  );
}