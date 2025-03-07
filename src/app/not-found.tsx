import Link from 'next/link';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <FiAlertTriangle className="mx-auto text-red-500 mb-6" size={64} />
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">404 - Page Not Found</h1>
        
        <p className="text-xl text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          <FiHome className="mr-2" /> Back to Home
        </Link>
      </div>
    </Layout>
  );
} 