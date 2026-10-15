import { apiRequest, fail } from './apiClient';
import { blogPosts as mockBlogPosts, getPostBySlug as getMockPostBySlug, blogCategories as mockBlogCategories, helpTopics as mockHelpTopics, popularQuestions as mockPopularQuestions } from '@/data/editorial';
import { testimonials as mockTestimonials } from '@/data/mockContent';

/** Blog, help centre and marketing content connected to backend API. */
export const contentService = {
  async getPosts({ category = null, limit = null } = {}) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    return apiRequest(`/content/posts?${params.toString()}`, {
      fallback: () => {
        let list = [...mockBlogPosts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        if (category) list = list.filter((p) => p.category === category);
        return limit ? list.slice(0, limit) : list;
      },
    }).then((posts) => (limit ? (posts || []).slice(0, limit) : (posts || [])));
  },

  async getPost(slug) {
    return apiRequest(`/content/posts/${slug}`, {
      fallback: () => {
        const post = getMockPostBySlug(slug);
        if (!post) fail('That article does not exist or has been unpublished.', 404, 'POST_NOT_FOUND');
        const related = mockBlogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
        return { post, related: related.length ? related : mockBlogPosts.filter((p) => p.slug !== slug).slice(0, 3) };
      },
    }).then((res) => {
      if (res.post) return res;
      const post = res;
      const related = mockBlogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
      return { post, related };
    });
  },

  async getBlogCategories() {
    return apiRequest('/content/blog-categories', {
      fallback: () => mockBlogCategories,
    });
  },

  async getHelpTopics() {
    return apiRequest('/content/help-topics', {
      fallback: () => mockHelpTopics,
    });
  },

  async searchHelp(query) {
    if (!query?.trim()) return [];
    return apiRequest(`/content/help/search?q=${encodeURIComponent(query)}`, {
      fallback: () => {
        const q = query.trim().toLowerCase();
        return mockHelpTopics.flatMap((topic) =>
          topic.faqs
            .filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
            .map((f) => ({ ...f, topic: topic.label, topicId: topic.id })),
        );
      },
    });
  },

  async getPopularQuestions() {
    return apiRequest('/content/popular-questions', {
      fallback: () => mockPopularQuestions,
    });
  },

  async getTestimonials() {
    return apiRequest('/content/testimonials', {
      fallback: () => mockTestimonials,
    });
  },

  async submitContact(formData) {
    return apiRequest('/content/contact', {
      method: 'POST',
      body: formData,
      fallback: () => ({ success: true, ticketId: `tkt-${Date.now()}` }),
    });
  },

  async subscribeNewsletter(email) {
    return apiRequest('/content/newsletter', {
      method: 'POST',
      body: { email },
      fallback: () => ({ success: true, message: 'Subscribed successfully.' }),
    });
  },
};

export default contentService;
