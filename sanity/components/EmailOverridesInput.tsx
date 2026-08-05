import React, { useCallback } from 'react';
import { TextInput, TextArea, Stack, Button, Flex, Text, Label } from '@sanity/ui';
import { ObjectInputProps, set, unset, useFormValue } from 'sanity';

export function EmailOverridesInput(props: ObjectInputProps) {
  const name = (useFormValue(['name']) as string) || '[Reviewer Name]';
  const adminReply = (useFormValue(['adminReply']) as string) || '';

  const cleanReply = adminReply.replace(/^Hi\s+[^!\.,\n]+[!,\.]?\s*/i, '');

  const defaultSubject = `Thank you for sharing your Classgrid experience ❤️`;

  const defaultBody = `Hi ${name},

I personally wanted to reach out and say — thank you so much for sharing your honest experience with Classgrid. It genuinely made our day at the team when we read your review.

Feedback like yours is exactly what keeps us motivated to build something truly great for institutions across India. We are so glad to have you as part of the Classgrid community!

Your review is now live on our community page for everyone to see:
👉 View Your Published Review → classgrid.in/reviews

A message from our team:
"${cleanReply}"

If you ever have more feedback, suggestions, or just want to talk — feel free to reply to this email directly. I read every single one.

With gratitude,
Nikhil Shinde
CEO & Founder, Classgrid
nikhil.shinde@classgrid.in | classgrid.in`;

  const value = (props.value || {}) as { subject?: string; body?: string };

  const handleGenerate = useCallback(() => {
    props.onChange(
      set({
        subject: defaultSubject,
        body: defaultBody,
      })
    );
  }, [defaultSubject, defaultBody, props.onChange]);

  const handleSubjectChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextSubject = event.currentTarget.value;
      props.onChange(set({ ...value, subject: nextSubject }));
    },
    [props.onChange, value]
  );

  const handleBodyChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextBody = event.currentTarget.value;
      props.onChange(set({ ...value, body: nextBody }));
    },
    [props.onChange, value]
  );

  const hasContent = !!value.subject || !!value.body;

  return (
    <Stack space={4}>
      <Flex justify="flex-start" align="center" gap={3}>
        <Button
          onClick={handleGenerate}
          text={hasContent ? '🔄 Regenerate Draft (Subject & Body)' : '✨ Generate Full Email Draft'}
          tone={hasContent ? 'caution' : 'primary'}
          mode="ghost"
        />
        {hasContent && (
          <Text size={1} muted>
            You can freely edit the text below. It will be sent exactly as written.
          </Text>
        )}
      </Flex>

      <Stack space={2}>
        <Label size={1} muted>Subject (Override)</Label>
        <TextInput
          value={value.subject || ''}
          onChange={handleSubjectChange}
          placeholder="Email subject..."
        />
      </Stack>

      <Stack space={2}>
        <Label size={1} muted>Full Email Body (Override)</Label>
        <TextArea
          value={value.body || ''}
          onChange={handleBodyChange}
          rows={15}
          placeholder="Email body..."
        />
      </Stack>
    </Stack>
  );
}
