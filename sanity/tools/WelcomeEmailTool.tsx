import React, { useState } from 'react'
import { Card, Stack, Text, TextInput, Button, useToast, Box, Container } from '@sanity/ui'
import { Send } from 'lucide-react'

export function WelcomeEmailTool() {
  const [name, setName] = useState('')
  const [personalEmail, setPersonalEmail] = useState('')
  const [classgridEmail, setClassgridEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const toast = useToast()

  const handleSend = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/team/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, personalEmail, classgridEmail, password }),
      })

      if (!res.ok) {
        throw new Error('Failed to send email')
      }
      
      setStatus('success')
      setName('')
      setPersonalEmail('')
      setClassgridEmail('')
      setPassword('')
      toast.push({ status: 'success', title: 'Welcome email sent successfully!' })
      
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setStatus('error')
      toast.push({ status: 'error', title: 'Error sending email. Please try again.' })
    }
  }

  return (
    <Container width={1} padding={4}>
      <Card padding={4} radius={2} shadow={1} border>
        <Stack space={5}>
          <Stack space={3}>
            <Text size={4} weight="bold">Team Welcome Email</Text>
            <Text size={2} muted>Send a beautiful welcome email to a new team member with their login credentials.</Text>
          </Stack>
          
          <Card padding={4} radius={2} tone="transparent" border>
            <Stack space={4}>
              <Stack space={3}>
                <Text size={1} weight="semibold">Team Member Name</Text>
                <TextInput 
                  value={name} 
                  onChange={(e) => setName(e.currentTarget.value)} 
                  placeholder="e.g. Jane Doe" 
                />
              </Stack>

              <Stack space={3}>
                <Text size={1} weight="semibold">Personal Email (Where to send this email)</Text>
                <TextInput 
                  value={personalEmail} 
                  onChange={(e) => setPersonalEmail(e.currentTarget.value)} 
                  placeholder="e.g. personal@gmail.com" 
                  type="email"
                />
              </Stack>

              <Stack space={3}>
                <Text size={1} weight="semibold">New Classgrid Email</Text>
                <TextInput 
                  value={classgridEmail} 
                  onChange={(e) => setClassgridEmail(e.currentTarget.value)} 
                  placeholder="e.g. name@classgrid.in" 
                  type="email"
                />
              </Stack>

              <Stack space={3}>
                <Text size={1} weight="semibold">Temporary Password</Text>
                <TextInput 
                  value={password} 
                  onChange={(e) => setPassword(e.currentTarget.value)} 
                  placeholder="Enter a secure temporary password" 
                />
              </Stack>

              <Box paddingTop={2}>
                <Button 
                  icon={Send}
                  text={status === 'sending' ? 'Sending Email...' : 'Send Welcome Email'} 
                  tone="primary" 
                  onClick={handleSend} 
                  disabled={status === 'sending' || !name || !personalEmail || !classgridEmail || !password}
                  padding={3}
                />
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Card>
    </Container>
  )
}
