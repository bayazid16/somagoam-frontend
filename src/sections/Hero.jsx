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

import hero1 from '../assets/artistic_hand.jpg'; 
import hero2 from '../assets/hero-2.jpg'; 
import hero3 from '../assets/bamboo_craft.jpeg'; 
import hero4 from '../assets/hero-4.jpg'; 
import hero5 from '../assets/craft_story.jpg'; 

const slideData = [
  {
    title: "PURE GI",
    subtitle: "FOOD & FLAVOR",
    desc: "বাংলার খাঁটি স্বাদ",
    link: "/food",
    btnText: "Explore Food",
    img: hero2
  },
  {
    title: "HERITAGE",
    subtitle: "AND TRADITION",
    desc: "ঐতিহ্য এখন আপনার ঘরের দুয়ারে",
    link: "/fashion",
    btnText: "Shop Fashion",
    img: hero1
  },
  {
    title: "EXQUISITE",
    subtitle: "CRAFTSMANSHIP",
    desc: "হস্তশিল্পের অনন্য সমাহার",
    link: "/crafts",
    btnText: "View Crafts",
    img: hero3
  },
  {
    title: "EXQUISITE",
    subtitle: "PRODUCERS",
    desc: "হস্তশিল্পের কারিগর",
    link: "/producers",
    btnText: "View Producers",
    img: hero4
  },
  {
    title: "EXQUISITE",
    subtitle: "OUR STORY",
    desc: "আমাদের পথচলা",
    link: "/about",
    btnText: "View Our Story",
    img: hero5
  }
];

export default function Hero() {
  return (
    /* 
       Added 'w-screen' and 'relative left-1/2 -translate-x-1/2' 
       to break out of any parent padding and reach the screen edges.
    */
    <section className="hero-section relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-black">
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
        /* Increased mobile height to 75vh to fill the visual gap */
        className="mySwiper h-[75vh] sm:h-[70vh] md:h-[85vh] w-full"
      >
        {slideData.map((slide, index) => (
          <SwiperSlide key={index} className="w-full">
            <div 
              className="w-full h-full flex items-center justify-center relative"
              style={{ 
                background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(${slide.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="w-full max-w-5xl text-center z-10 px-4 md:px-6">
                <h1 className="text-4xl sm:text-5xl md:text-8xl serif leading-[1.1] mb-3 md:mb-6 text-white uppercase tracking-tighter">
                  {slide.title} <br /> 
                  <span className="italic font-light opacity-90 text-[#C5A059]">{slide.subtitle}</span>
                </h1>
                
                <p className="max-w-xl mx-auto text-stone-200 text-[11px] md:text-base mb-6 md:mb-10 uppercase tracking-[0.1em] md:tracking-[0.2em]">
                  {slide.desc} <br />
                  <span className="hidden sm:inline-block mt-2 opacity-80">Empowering the roots of Bangladesh through authentic commerce.</span>
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-6">
                  <Link 
                    to={slide.link}
                    className="bg-[#A33B26] text-white w-56 sm:w-auto px-8 py-3 md:px-10 md:py-4 text-[11px] md:text-xs uppercase font-bold tracking-widest hover:opacity-90 transition shadow-xl text-center"
                  >
                    {slide.btnText}
                  </Link>
                  <Link 
                    to="/about" 
                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white w-56 sm:w-auto px-8 py-3 md:px-10 md:py-4 text-[11px] md:text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition text-center"
                  >
                    Our Legacy
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style jsx="true" global="true">{`
        /* Crucial: Zero out all margins and padding for the slider */
        .swiper { 
          padding: 0 !important; 
          margin: 0 !important;
        }
        
        .swiper-button-next, .swiper-button-prev { 
          color: white !important; 
          transform: scale(0.5); 
        }
        
        @media (max-width: 768px) {
          .swiper-button-next, .swiper-button-prev { display: none !important; }
        }
        
        .swiper-pagination { bottom: 15px !important; }
        .swiper-pagination-bullet { background: white !important; opacity: 0.5; width: 8px; height: 8px; }
        .swiper-pagination-bullet-active { background: #A33B26 !important; opacity: 1; scale: 1.2; }
      `}</style>
    </section>
  );
}