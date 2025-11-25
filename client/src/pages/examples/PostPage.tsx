import { Route } from 'wouter';
import PostPage from '../PostPage';

export default function PostPageExample() {
  return (
    <Route path="/post/:id">
      <PostPage />
    </Route>
  );
}
