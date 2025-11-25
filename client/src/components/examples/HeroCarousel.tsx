import HeroCarousel from '../HeroCarousel';
import heroImage from '@assets/generated_images/dance_performance_hero_image.png';
import poetryImage from '@assets/generated_images/poetry_calligraphy_thumbnail.png';
import cultureImage from '@assets/generated_images/cultural_celebration_thumbnail.png';

export default function HeroCarouselExample() {
  const slides = [
    {
      image: heroImage,
      caption: 'नृत्य - माझे जीवन (Dance - My Life)',
      instagramLink: 'https://instagram.com/p/example1',
    },
    {
      image: poetryImage,
      caption: 'शब्दांच्या माळा (Garland of Words)',
      instagramLink: 'https://instagram.com/p/example2',
    },
    {
      image: cultureImage,
      caption: 'संस्कृतीचा रंग (Colors of Culture)',
      instagramLink: 'https://instagram.com/p/example3',
    },
  ];

  return <HeroCarousel slides={slides} autoPlayInterval={5000} />;
}
