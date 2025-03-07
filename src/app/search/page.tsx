import SearchClient from './client';

export default function SearchPage() {
  return (
    <div id="search-root">
      <SearchClient />
    </div>
  );
}

// Force static generation
export function generateStaticParams() {
  return [];
}