import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const sports = [
  {
    name: 'Basketball',
    description: 'Rejoignez notre équipe de basket dynamique et passionnée',
    image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    schedule: 'Lundi et Mercredi 18h-20h'
  },
  {
    name: 'VTT',
    description: 'Découvrez de nouveaux sentiers avec notre club de VTT',
    image: 'https://images.pexels.com/photos/71104/utah-mountain-biking-bike-biking-71104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    schedule: 'Samedi 9h-12h'
  },
  {
    name: 'Boule Bretonne',
    description: 'Partagez des moments conviviaux autour de la pétanque',
    image: 'https://www.ville-lomme.fr/var/www/storage/images/mediatheque/mairie-de-lomme/associations/visuels/petanque/229445-1-fre-FR/PETANQUE.jpg',
    schedule: 'Mardi et Jeudi 14h-18h'
  },
  {
    name: 'Tennis',
    description: 'Perfectionnez votre jeu sur nos courts de tennis',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Tennis_Racket_and_Balls.jpg',
    schedule: 'Mercredi et Vendredi 17h-21h'
  },
  {
    name: 'Gymnastique',
    description: 'Gardez la forme avec nos cours de gymnastique',
    image: 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    schedule: 'Lundi et Jeudi 10h-12h'
  }
];

export default function SportsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: rgb(30, 64, 175) !important;
        }
        .swiper-button-next {
          right: 5% !important;
        }
        .swiper-button-prev {
          left: 5% !important;
        }
        .swiper-pagination-bullet-active {
          background: rgb(30, 64, 175) !important;
        }
        .swiper-slide {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 75vw !important;
          max-width: 400px !important;
        }
        @media (min-width: 1024px) {
          .swiper-slide {
            width: 400px !important;
          }
        }
        @media (min-width: 1536px) {
          .swiper-slide {
            width: 600px !important;
            max-width: 600px !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          <span className="relative">
            Nos activités sportives
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded"></span>
          </span>
        </h2>

        <div className="relative mt-12">
          <Swiper
            effect={isWideScreen ? 'coverflow' : 'slide'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            spaceBetween={30}
            loop={true}
            speed={800}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 250,
              modifier: 1.5,
              slideShadows: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full py-4 md:py-6"
          >
            {sports.map((sport, index) => (
              <SwiperSlide key={sport.name}>
                <div
                  className={`
                    relative group overflow-hidden rounded-xl shadow-md 
                    transition-all duration-500 transform 
                    ${activeIndex === index ? 'scale-105 z-20' : 'scale-95 opacity-75'}
                    hover:shadow-lg hover:scale-[1.02]
                    w-full
                  `}
                >
                  <div className="relative h-[420px] w-full">
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80">
                      <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors duration-300">
                          {sport.name}
                        </h3>
                        <p className="text-base text-gray-200 mb-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                          {sport.description}
                        </p>
                        <div className="flex items-center">
                          <span className="px-4 py-2 rounded-full bg-blue-700/80 text-white font-medium text-sm backdrop-blur-sm border border-white/10 shadow-lg group-hover:bg-blue-600 group-hover:shadow-blue-500/25 transition-all duration-300">
                            {sport.schedule}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}