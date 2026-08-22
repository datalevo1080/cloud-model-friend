import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface ContactMessageProps {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactMessage({
  name = 'Someone',
  email = 'unknown@example.com',
  subject = 'ZipGIF enquiry',
  message = '(no message)',
}: ContactMessageProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New ZipGIF message from ${name}`}</Preview>
      <Body style={{ backgroundColor: '#0b0b10', fontFamily: 'Inter, Arial, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
          <Heading style={{ color: '#ffffff', fontSize: '22px', margin: '0 0 4px' }}>
            New contact form message
          </Heading>
          <Text style={{ color: '#a1a1b5', fontSize: '13px', margin: '0 0 24px' }}>
            Sent from zipgif.com/contact
          </Text>

          <Section style={{ backgroundColor: '#15151f', borderRadius: '12px', padding: '20px' }}>
            <Text style={{ color: '#a1a1b5', fontSize: '12px', margin: '0' }}>From</Text>
            <Text style={{ color: '#ffffff', fontSize: '15px', margin: '2px 0 14px' }}>
              {name} &lt;{email}&gt;
            </Text>

            <Text style={{ color: '#a1a1b5', fontSize: '12px', margin: '0' }}>Subject</Text>
            <Text style={{ color: '#ffffff', fontSize: '15px', margin: '2px 0 14px' }}>{subject}</Text>

            <Hr style={{ borderColor: '#26263a', margin: '8px 0 14px' }} />

            <Text style={{ color: '#a1a1b5', fontSize: '12px', margin: '0' }}>Message</Text>
            <Text style={{ color: '#e6e6f0', fontSize: '15px', lineHeight: '24px', whiteSpace: 'pre-wrap', margin: '4px 0 0' }}>
              {message}
            </Text>
          </Section>

          <Text style={{ color: '#6b6b80', fontSize: '12px', marginTop: '20px' }}>
            Reply directly to this email to answer the sender.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactMessage,
  displayName: 'Contact form message',
  subject: (data: Record<string, any>) =>
    `ZipGIF contact: ${data['subject'] || 'New message'}`,
  to: 'contact@zipgif.com',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Bug report',
    message: 'The compressor stalls on a 40 MB GIF in Safari 17.',
  },
} satisfies TemplateEntry
