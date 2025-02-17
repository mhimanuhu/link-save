import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Link {
  id: string;
  title: string;
  url: string;
  tags: string[];
  user_id: string;
  created_at: string;
}

interface SharedLink extends Link {
  shared_by_email: string;
}

interface LinksState {
  links: Link[];
  sharedLinks: SharedLink[];
  loading: boolean;
  fetchLinks: () => Promise<void>;
  fetchSharedLinks: () => Promise<void>;
  addLink: (link: Omit<Link, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  shareLink: (linkId: string, recipientEmail: string) => Promise<void>;
}

export const useLinksStore = create<LinksState>((set) => ({
  links: [],
  sharedLinks: [],
  loading: false,
  fetchLinks: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    set({ links: data, loading: false });
  },
  fetchSharedLinks: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('shared_links')
      .select(`
        *,
        link:links(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedLinks = data.map((shared) => ({
      ...shared.link,
      shared_by_email: shared.shared_by_email,
    }));

    set({ sharedLinks: formattedLinks, loading: false });
  },
  addLink: async (link) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.from('links').insert([
      {
        ...link,
        user_id: user.id,
      },
    ]);
    
    if (error) throw error;
  },
  shareLink: async (linkId, recipientEmail) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.from('shared_links').insert([
      {
        link_id: linkId,
        user_id: user.id,
        recipient_email: recipientEmail,
        shared_by_email: user.email,
      },
    ]);
    
    if (error) throw error;
  },
}));