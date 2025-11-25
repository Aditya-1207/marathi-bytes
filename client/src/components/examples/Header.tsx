import Header from '../Header';

export default function HeaderExample() {
  const categories = [
    { id: 'poetry', name: 'Poetry', label: 'काव्य-संग्रह' },
    { id: 'articles', name: 'Articles', label: 'आठवणींचा ठेवा' },
    { id: 'ukhane', name: 'Ukhane', label: 'उखाणे' },
  ];

  return <Header categories={categories} onSearch={(query) => console.log('Search:', query)} />;
}
