import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import nodemailer from 'nodemailer';
import * as path from 'path';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  // secure: true,
});

const emailsDir = path.resolve(process.cwd(), 'emails');

const sendVerificationRequest = async ({ identifier, url }) => {
  const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
    encoding: 'utf8',
  });

  const emailTemplate = Handlebars.compile(emailFile);
  const result = await transporter.sendMail({
    from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for SupaVacation',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent.`);
  }
};

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    });

    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: 'Welcome to SupaVacation! 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: process.env.EMAIL_FROM,
      }),
    });
  } catch (e) {
    console.log(`❌ Unable to send welcome email to tu user ${email}`);
  }
};

export const authOptions = {
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      maxAge: 10 * 60, // Magic links are valid for 10min only
      sendVerificationRequest,
    }),
  ],
  events: {
    createUser: sendWelcomeEmail,
  },
};

export default NextAuth(authOptions);
