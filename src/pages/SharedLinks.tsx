import React from 'react';
import { Tag, ExternalLink } from 'lucide-react';
import { useLinksStore } from '../store/links-store';
import LoadingDots from '../components/LoadingDots';

export default function SharedLinks() {
  const { sharedLinks, loading, fetchSharedLinks } = useLinksStore();

  React.useEffect(() => {
    fetchSharedLinks();
  }, [fetchSharedLinks]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shared Links</h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingDots />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sharedLinks.map((link) => (
            <div
              key={link.id}
              className="p-6 bg-white dark:bg-dark-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <h3 className="font-medium text-lg truncate" title={link.title}>
                  {link.title}
                </h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-flex items-center gap-1 truncate"
                  title={link.url}
                >
                  <ExternalLink className="w-4 h-4" />
                  {link.url}
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Shared by: {link.shared_by_email}
                </p>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {link.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}