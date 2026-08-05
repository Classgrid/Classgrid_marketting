import { useToast } from 'sanity';

export function createPublishWithEmailAction(originalPublishAction: any) {
  return (props: any) => {
    const originalResult = originalPublishAction(props);
    const toast = useToast();
    const { draft } = props;

    if (!originalResult) {
      return null;
    }

    return {
      ...originalResult,
      onHandle: async () => {
        // 1. Call the original Sanity publish action
        originalResult.onHandle();

        // 2. If it's a review and autoSendEmail is true, automatically trigger the email API
        if (draft && draft._type === 'communityReview' && draft.autoSendEmail) {
          const siteUrl =
            typeof window !== 'undefined' && window.location.hostname === 'localhost'
              ? 'http://localhost:3000'
              : 'https://classgrid.in';

          try {
            const res = await fetch(`${siteUrl}/api/reviews/send-thanks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reviewId: props.id }),
            });

            const data = await res.json();

            if (res.ok) {
              toast.push({
                status: 'success',
                title: 'Email Sent Automatically!',
                description: `Sent to ${draft.email || 'reviewer'}`,
              });
            } else {
              toast.push({
                status: 'warning',
                title: 'Email not sent',
                description: data.message,
              });
            }
          } catch (err: any) {
            toast.push({
              status: 'error',
              title: 'Auto-send failed',
              description: err.message,
            });
          }
        }
      },
    };
  };
}
