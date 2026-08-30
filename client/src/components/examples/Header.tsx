import Header from '../Header';
import { NAV_CATEGORIES as categories } from '@/lib/categories';

export default function HeaderExample() {
  return <Header categories={categories} onSearch={(query) => console.log('Search:', query)} />;
}
