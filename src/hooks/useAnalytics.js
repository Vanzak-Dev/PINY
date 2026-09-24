import { base44 } from '@/api/base44Client';

export function useAnalytics(pageName) {
  const track = (eventName, properties = {}) => {
    try {
      base44.analytics.track({ eventName, properties: { ...properties, page: pageName } });
    } catch (e) {
      console.error('Analytics error:', e);
    }
  };
  return { track };
}
