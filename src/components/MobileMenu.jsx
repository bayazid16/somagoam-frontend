export default function MobileMenu() {
  return (
    <div id="mobile-menu" className="fixed inset-0 z-[100] bg-[#F9F7F2] p-10 flex flex-col space-y-8 text-2xl serif">
      
      <button id="close-menu" className="absolute top-8 right-10 text-stone-500 text-4xl">
        ✕
      </button>

      <a href="#">Home</a>
      <a href="#">Fashion</a>
      <a href="#">GI Food</a>
      <a href="#">Crafts</a>
      <a href="#">Our Story</a>

    </div>
  );
}