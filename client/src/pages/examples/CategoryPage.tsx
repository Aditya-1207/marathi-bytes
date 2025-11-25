import { Route } from 'wouter';
import CategoryPage from '../CategoryPage';

export default function CategoryPageExample() {
  return (
    <Route path="/category/:category">
      <CategoryPage />
    </Route>
  );
}
