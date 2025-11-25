import AboutSection from '../AboutSection';
import profileImage from '@assets/generated_images/about_section_portrait.png';

export default function AboutSectionExample() {
  return (
    <AboutSection
      image={profileImage}
      bioMarathi="मी प्राजक्तप्रभा. लेखन, नृत्य आणि गायन हे माझे आवडते छंद आहेत. मी माझ्या कवितांमधून जीवनातील विविध भावना व्यक्त करते. नृत्य माझ्या जीवनाचा एक महत्त्वाचा भाग आहे. माझ्या ब्लॉगवर तुम्हाला कविता, लेख आणि उखाणे वाचायला मिळतील."
      bioEnglish="I'm Prajakta Prabha. Writing, dancing, and singing are my favorite hobbies. Through my poetry, I express various emotions of life. Dance is an important part of my life. On my blog, you'll find poetry, articles, and traditional Marathi verses."
      onContact={() => console.log('Contact clicked')}
    />
  );
}
