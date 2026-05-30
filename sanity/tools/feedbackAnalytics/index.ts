import { definePlugin } from 'sanity'
import { FeedbackAnalytics } from './FeedbackAnalytics'

export const feedbackAnalyticsTool = definePlugin({
  name: 'feedback-analytics',
  tools: [
    {
      name: 'feedback-analytics',
      title: 'Analytics',
      icon: () => '📊',
      component: FeedbackAnalytics,
    },
  ],
})
