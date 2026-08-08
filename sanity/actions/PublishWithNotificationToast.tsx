import { useToast } from '@sanity/ui';

export function createPublishWithNotificationToast(originalPublishAction: any) {
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
        // Call original Sanity publish action
        originalResult.onHandle();

        // If the document has the sendSubscriberNotification toggle ON
        if (draft && draft.sendSubscriberNotification === true) {
          // Add a short delay to allow publish animation to clear before the toast
          setTimeout(() => {
            toast.push({
              status: 'success',
              title: '✅ Email Notification Queued!',
              description: `The email will be sent to subscribers shortly.`,
            });
          }, 1000);
        }
      },
    };
  };
}
