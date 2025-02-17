import React from 'react';
import { Plus, Search, Share2, Tag, ExternalLink } from 'lucide-react';
import { useLinksStore } from '../store/links-store';
import { toast } from 'react-hot-toast';
import LoadingDots from '../components/LoadingDots';

export default function Dashboard() {
  const { links, loading, fetchLinks, addLink, shareLink } = useLinksStore();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [newLink, setNewLink] = React.useState({
    title: '',
    url: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = React.useState('');
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [selectedLinkId, setSelectedLinkId] = React.useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error('Title and URL are required');
      return;
    }
    setIsSubmitting(true);
    try {
      await addLink(newLink);
      await fetchLinks();
      setShowAddModal(false);
      setNewLink({ title: '', url: '', tags: [] });
      toast.success('Link added successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    
    // Add tags when comma is typed
    if (value.includes(',')) {
      const newTags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && !newLink.tags.includes(tag));
      
      if (newTags.length > 0) {
        setNewLink({
          ...newLink,
          tags: [...newLink.tags, ...newTags],
        });
      }
      setTagInput('');
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLinkId) return;
    
    setIsSubmitting(true);
    try {
      await shareLink(selectedLinkId, recipientEmail);
      setShowShareModal(false);
      setRecipientEmail('');
      setSelectedLinkId(null);
      toast.success('Link shared successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary-500" />
          <input
            type="text"
            placeholder="Search links or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-4 inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Link
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingDots />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No links found
            </div>
          ) : (
            filteredLinks.map((link) => (
              <div
                key={link.id}
                className="p-6 bg-white dark:bg-dark-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate-text" title={link.title}>
                      {link.title.length > 12 ? `${link.title.slice(0, 12)}...` : link.title}
                    </h3>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1 truncate-text"
                      title={link.url}
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{link.url}</span>
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLinkId(link.id);
                      setShowShareModal(true);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors flex-shrink-0 ml-2"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
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
            ))
          )}
        </div>
      )}

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="modal-overlay flex items-center justify-center p-4">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-6">Add New Link</h2>
            <form onSubmit={handleAddLink} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  required
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInput}
                  placeholder="Add tags separated by commas"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {newLink.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setNewLink({
                            ...newLink,
                            tags: newLink.tags.filter((_, i) => i !== index),
                          })
                        }
                        className="ml-1 hover:text-primary-800 dark:hover:text-primary-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <LoadingDots /> : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay flex items-center justify-center p-4">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-6">Share Link</h2>
            <form onSubmit={handleShare} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <LoadingDots /> : 'Share'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}