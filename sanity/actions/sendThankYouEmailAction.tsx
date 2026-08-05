import { useState } from 'react';
import { DocumentActionProps, useToast } from 'sanity';

/**
 * Sanity Studio custom document action:
 * Shows a "Send Thank You Email" button on every communityReview document.
 * When clicked, calls the /api/reviews/send-thanks API route to send a
 * branded thank-you email to the reviewer via AWS SES.
 */
export function SendThankYouEmailAction(props: DocumentActionProps) {
  const { id, type } = props;
  const toast = useToast();
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Only show this action on communityReview documents
  if (type !== 'communityReview') return null;

  return {
    label: sent ? '✅ Email Sent!' : isSending ? 'Sending…' : '📧 Send Thank You Email',
    tone: sent ? 'positive' : 'default' as any,
    disabled: isSending || sent,
    onHandle: async () => {
      setIsSending(true);
      try {
        const siteUrl =
          typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://classgrid.in';

        const res = await fetch(`${siteUrl}/api/reviews/send-thanks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewId: id }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to send email');
        }

        setSent(true);
        toast.push({
          status: 'success',
          title: 'Thank you email sent!',
          description: data.message,
        });

        // Reset button after 8 seconds
        setTimeout(() => setSent(false), 8000);
      } catch (err: any) {
        toast.push({
          status: 'error',
          title: 'Failed to send email',
          description: err.message,
        });
      } finally {
        setIsSending(false);
      }
    },
  };
}
