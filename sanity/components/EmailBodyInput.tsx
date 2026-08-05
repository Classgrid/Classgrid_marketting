import React, { useCallback, useEffect } from 'react';
import { TextArea, Stack, Button, Flex, Text } from '@sanity/ui';
import { StringInputProps, set, unset, useFormValue } from 'sanity';

export function EmailBodyInput(props: StringInputProps) {
  const name = (useFormValue(['name']) as string) || '[Reviewer Name]';
  const adminReply = (useFormValue(['adminReply']) as string) || '';

  // Clean the greeting out of the admin reply just in case
  const cleanReply = adminReply.replace(/^Hi\s+[^!\.,\n]+[!,\.]?\s*/i, '');

  const defaultEmailText = `Hi ${name},

I personally wanted to reach out and say — thank you so much for sharing your honest experience with Classgrid. It genuinely made our day at the team when we read your review.

Feedback like yours is exactly what keeps us motivated to build something truly great for institutions across India. We are so glad to have you as part of the Classgrid community!

Your review is now live on our community page for everyone to see:
👉 View Your Published Review → classgrid.in/reviews

A note from me personally:
"${cleanReply}"

If you ever have more feedback, suggestions, or just want to talk — feel free to reply to this email directly. I read every single one.

With gratitude,
Nikhil Shinde
CEO & Founder, Classgrid
nikhil.shinde@classgrid.in | classgrid.in`;

  const handleGenerate = useCallback(() => {
    props.onChange(set(defaultEmailText));
  }, [defaultEmailText, props.onChange]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value;
      props.onChange(nextValue ? set(nextValue) : unset());
    },
    [props.onChange]
  );

  return (
    <Stack space={3}>
      <TextArea
        value={props.value || ''}
        onChange={handleChange}
        rows={15}
        placeholder="Click 'Generate Email Draft' to pre-fill this box..."
      />
      <Flex justify="flex-start" align="center" gap={3}>
        <Button 
          onClick={handleGenerate} 
          text={props.value ? "🔄 Regenerate from Template" : "✨ Generate Email Draft"} 
          tone={props.value ? "caution" : "primary"}
          mode="ghost"
        />
        {props.value && (
          <Text size={1} muted>
            You can freely edit the text above. It will be sent exactly as written.
          </Text>
        )}
      </Flex>
    </Stack>
  );
}
