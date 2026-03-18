import type { TourStep } from '@/types/command-center';

export const tourSteps: Record<string, TourStep[]> = {
  dashboard: [
    { emoji: '🏠', title: 'Welcome to your Command Center!', body: "This is your home base. You can see everything your AI team is doing right here. Think of it like a manager's desk — but your managers are AI!" },
    { emoji: '📊', title: 'Quick Stats', body: 'These cards at the top show your key numbers at a glance: how many agents are working, what needs your approval, tasks done today, and new leads this week.' },
    { emoji: '🔴', title: 'Live Activity Feed', body: 'This is the live feed! Watch your AI team work in real time. Text streams in like someone is typing. You can pause it anytime.' },
    { emoji: '✅', title: 'Approve or Reject', body: "When your agents finish something, it shows up in the 'Needs Your Approval' section. Nothing goes live without you saying OK!" },
  ],
  agents: [
    { emoji: '👥', title: 'Meet Your AI Team', body: "Here's your full team of 8 AI agents. Each one has a specialty — writing, research, sales, SEO, customer service, operations, social media, and data analysis." },
    { emoji: '⚡', title: 'Working Agents', body: "Agents with a 'Working' badge are busy doing tasks right now. You can see what they're working on and how far along they are." },
    { emoji: '🎯', title: 'Assign Tasks', body: "See an idle agent? Tap 'Assign a Task' and tell them what to do in plain English. Like talking to a real team member!" },
  ],
  approvals: [
    { emoji: '📝', title: 'Your Approval Queue', body: 'Everything your AI team creates shows up here first. Blog posts, emails, social media posts — nothing goes live until you say it\'s good.' },
    { emoji: '✅', title: 'Three Options', body: "For each item you can: Approve (send it live), Revise (ask for changes), or Block (stop it completely). You're always in control!" },
  ],
  integrations: [
    { emoji: '🔌', title: 'Connect Your Tools', body: 'Link the apps you already use — like Shopify, Instagram, Gmail, or HubSpot. Your AI team gets smarter when it can work with your real tools!' },
    { emoji: '⭐', title: 'Start with Popular Ones', body: 'We recommend starting with 1-2 tools you use the most. You can always add more later. Each connection takes just one click!' },
  ],
};

export const agentStatusMessages: Record<string, { working: string; idle: string }> = {
  Emma: { working: 'Emma is writing a blog post for you right now', idle: 'Emma is ready to write! Give her a topic and she\'ll start creating.' },
  James: { working: 'James is researching your competitors and market', idle: 'James is available to dig into any topic you need.' },
  Olivia: { working: 'Olivia is personalizing emails for your leads', idle: 'Olivia is ready to help you reach out to new customers.' },
  Liam: { working: "Liam is checking your website's SEO score", idle: "Liam can run an SEO audit whenever you're ready." },
  Sophia: { working: 'Sophia is replying to customer questions', idle: 'Sophia is standing by to help your customers.' },
  Noah: { working: "Noah is coordinating the team's priorities", idle: 'Noah is ready to organize your business tasks.' },
  Ava: { working: 'Ava is creating social media posts for this week', idle: 'Ava can whip up social content anytime you need it.' },
  Ethan: { working: 'Ethan is crunching your weekly numbers', idle: 'Ethan can generate a report whenever you want.' },
};
