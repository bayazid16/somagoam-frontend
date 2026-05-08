import React from 'react';
import { Link } from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Import required modules
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// You can import your actual images here
import heroBg from '../assets/artistic_hand.jpg'; 

const slideData = [
  {
    title: "HERITAGE",
    subtitle: "AND TRADITION",
    desc: "ঐতিহ্য এখন আপনার ঘরের দুয়ারে",
    link: "/fashion",
    btnText: "Shop Fashion",
    img: heroBg // Replace with specific fashion image
  },
  {
    title: "PURE GI",
    subtitle: "FOOD & FLAVOR",
    desc: "বাংলার খাঁটি স্বাদ",
    link: "/food",
    btnText: "Explore Food",
    img: heroBg // Replace with specific food image
  },
  {
    title: "EXQUISITE",
    subtitle: "CRAFTSMANSHIP",
    desc: "হস্তশিল্পের অনন্য সমাহার",
    link: "/crafts",
    btnText: "View Crafts",
    img: heroBg // Replace with specific crafts image
  }
];

export default function Hero() {
  return (
    <section className="hero-section">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="mySwiper h-[70vh] md:h-[85vh]"
      >
        {slideData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="w-full h-full flex items-center justify-center px-6"
              style={{ 
                backgroundImage: `linear-gradient(rgba(42, 36, 32, 0.6), rgba(42, 36, 32, 0.4)), url(${slide.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="max-w-4xl text-center">
                <h1 className="text-4xl md:text-8xl serif leading-tight mb-4 md:mb-6 text-white uppercase">
                  {slide.title} <br /> 
                  <span className="italic font-light opacity-90 text-[#C5A059]">{slide.subtitle}</span>
                </h1>
                
                <p className="max-w-xl mx-auto text-stone-200 text-xs md:text-base mb-8 md:mb-10 uppercase tracking-[0.2em]">
                  {slide.desc} <br />
                  <span className="hidden md:inline">Empowering the roots of Bangladesh through authentic commerce.</span>
                </p>
                
                <div className="flex flex-row justify-center items-center gap-4 md:gap-6">
                  <Link 
                    to={slide.link}
                    className="brand-bg text-white px-6 py-3 md:px-10 md:py-4 text-[10px] md:text-xs uppercase font-bold tracking-widest hover:opacity-90 transition"
                  >
                    {slide.btnText}
                  </Link>
                  <Link 
                    to="/about" 
                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 md:px-10 md:py-4 text-[10px] md:text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition"
                  >
                    Our Legacy
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom CSS for Swiper arrows/dots color */}
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev { color: white !important; transform: scale(0.7); }
        .swiper-pagination-bullet-active { background: #A33B26 !important; }
      `}</style>
    </section>
  );
}