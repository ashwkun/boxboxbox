import { generateStaticParamsList } from '@/lib/staticParams';
import MovieDetail from '@/components/MovieDetail';

// Generate static paths for the most popular movies
export function generateStaticParams() {
  return generateStaticParamsList();
}

// Statically generated page
export default function MoviePage({ params }: { params: { id: string } }) {
  return <MovieDetail id={params.id} />;
} 