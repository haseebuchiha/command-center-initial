import React from 'react';
import {
  Html,
  Container,
  Tailwind,
  Head,
  Body,
  Preview,
  Section,
} from '@react-email/components';
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export default function Layout({
  preview,
  children,
  includeFooter = true,
}: {
  preview?: string;
  children: ReactNode;
  includeFooter?: boolean;
}) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Tailwind>
        <Body className="bg-gray-100 font-sans text-gray-900 leading-relaxed">
          <Container className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <Header />

            <Section className="px-8 py-6">{children}</Section>

            {includeFooter && <Footer />}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
