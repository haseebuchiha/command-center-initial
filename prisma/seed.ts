import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const integrations = [
  // Chat Apps
  { slug: "discord", name: "Discord", category: "chat", icon: "💬", description: "Chat with your AI team and get notifications in Discord channels.", popular: true },
  { slug: "slack", name: "Slack", category: "chat", icon: "📨", description: "Send and receive messages through Slack workspaces and channels.", popular: true },
  { slug: "telegram", name: "Telegram", category: "chat", icon: "✈️", description: "Message your AI team from Telegram on your phone.", popular: true },
  { slug: "whatsapp", name: "WhatsApp", category: "chat", icon: "📞", description: "Talk to your AI agents through WhatsApp messages.", popular: false },
  { slug: "teams", name: "Microsoft Teams", category: "chat", icon: "🟦", description: "Connect to your Teams workspace for business communication.", popular: false },
  // CRMs
  { slug: "hubspot", name: "HubSpot CRM", category: "crm", icon: "🟠", description: "Manage contacts, deals, and sales pipeline. Auto-sync leads from outreach.", popular: true },
  { slug: "salesforce", name: "Salesforce", category: "crm", icon: "☁️", description: "Full CRM integration for enterprise-level contact and deal management.", popular: true },
  { slug: "pipedrive", name: "Pipedrive", category: "crm", icon: "🟢", description: "Visual sales pipeline management. Great for small teams.", popular: false },
  { slug: "zoho", name: "Zoho CRM", category: "crm", icon: "🔴", description: "Affordable CRM with marketing automation and analytics.", popular: false },
  { slug: "freshsales", name: "Freshsales", category: "crm", icon: "🍊", description: "AI-powered CRM with built-in phone, email, and chat.", popular: false },
  { slug: "gohighlevel", name: "GoHighLevel", category: "crm", icon: "⚡", description: "All-in-one CRM, funnels, and marketing automation platform.", popular: true },
  // Ad Platforms
  { slug: "meta-ads", name: "Meta Ads (Facebook/Instagram)", category: "ads", icon: "📘", description: "Create, manage, and optimize your Facebook and Instagram ad campaigns.", popular: true },
  { slug: "google-ads", name: "Google Ads", category: "ads", icon: "🔍", description: "Run search, display, and YouTube ads. AI optimizes your campaigns.", popular: true },
  { slug: "tiktok-ads", name: "TikTok Ads", category: "ads", icon: "🎵", description: "Create and manage TikTok ad campaigns for younger audiences.", popular: false },
  { slug: "linkedin-ads", name: "LinkedIn Ads", category: "ads", icon: "💼", description: "B2B advertising on LinkedIn for professional audiences.", popular: false },
  { slug: "pinterest-ads", name: "Pinterest Ads", category: "ads", icon: "📌", description: "Visual ad campaigns perfect for product-based businesses.", popular: false },
  // eCommerce
  { slug: "shopify", name: "Shopify", category: "ecommerce", icon: "🛍️", description: "Manage products, orders, inventory, and customers in your Shopify store.", popular: true },
  { slug: "etsy", name: "Etsy", category: "ecommerce", icon: "🧶", description: "List products, manage orders, and optimize listings on Etsy.", popular: false },
  { slug: "woocommerce", name: "WooCommerce", category: "ecommerce", icon: "🟣", description: "Full WordPress eCommerce store management.", popular: false },
  { slug: "amazon", name: "Amazon Seller", category: "ecommerce", icon: "📦", description: "Product listings, order tracking, and review monitoring on Amazon.", popular: false },
  { slug: "stripe", name: "Stripe", category: "ecommerce", icon: "💳", description: "Payment processing, invoicing, and subscription management.", popular: true },
  { slug: "square", name: "Square", category: "ecommerce", icon: "⬛", description: "Point-of-sale and online payments for retail and service businesses.", popular: false },
  // AI
  { slug: "openai", name: "OpenAI (GPT)", category: "ai", icon: "🤖", description: "Connect your OpenAI API key to use GPT models for specific agent tasks.", popular: false },
  { slug: "anthropic", name: "Anthropic (Claude)", category: "ai", icon: "🧠", description: "Claude is the default AI brain for your agents. Already connected!", popular: true },
  { slug: "gemini", name: "Google Gemini", category: "ai", icon: "💎", description: "Add Google Gemini as an alternative AI model for certain tasks.", popular: false },
  { slug: "perplexity", name: "Perplexity", category: "ai", icon: "🔮", description: "Use Perplexity for real-time web research and fact-checking.", popular: false },
  { slug: "mistral", name: "Mistral", category: "ai", icon: "🌬️", description: "Cost-effective open-source AI for high-volume, simpler tasks.", popular: false },
  // Docs
  { slug: "gdrive", name: "Google Drive", category: "docs", icon: "📁", description: "Store, share, and collaborate on documents, sheets, and slides.", popular: true },
  { slug: "onedrive", name: "OneDrive", category: "docs", icon: "☁️", description: "Microsoft cloud storage for documents and file sharing.", popular: false },
  { slug: "dropbox", name: "Dropbox", category: "docs", icon: "📦", description: "Cloud file storage and sharing with team collaboration.", popular: false },
  { slug: "notion", name: "Notion", category: "docs", icon: "📝", description: "All-in-one workspace for notes, docs, wikis, and project management.", popular: true },
  { slug: "google-docs", name: "Google Docs", category: "docs", icon: "📄", description: "Create and edit documents collaboratively in real time.", popular: false },
  { slug: "google-sheets", name: "Google Sheets", category: "docs", icon: "📊", description: "Spreadsheets for tracking data, budgets, and analytics.", popular: false },
  // Email
  { slug: "gmail", name: "Gmail", category: "email", icon: "📧", description: "Read, send, and manage emails from your Gmail account.", popular: true },
  { slug: "outlook", name: "Outlook", category: "email", icon: "📬", description: "Microsoft email integration for business communication.", popular: false },
  { slug: "mailchimp", name: "Mailchimp", category: "email", icon: "🐵", description: "Email marketing campaigns, automations, and audience management.", popular: true },
  { slug: "convertkit", name: "ConvertKit", category: "email", icon: "✉️", description: "Email marketing built for creators and small businesses.", popular: false },
  { slug: "sendgrid", name: "SendGrid", category: "email", icon: "📮", description: "Transactional and marketing email delivery at scale.", popular: false },
  { slug: "instantly", name: "Instantly", category: "email", icon: "⚡", description: "Cold email outreach at scale with smart sending and warmup.", popular: false },
  // Social
  { slug: "instagram", name: "Instagram", category: "social", icon: "📸", description: "Post photos, reels, and stories. Track engagement and followers.", popular: true },
  { slug: "facebook", name: "Facebook Pages", category: "social", icon: "👤", description: "Manage your Facebook business page, posts, and audience.", popular: false },
  { slug: "twitter", name: "X (Twitter)", category: "social", icon: "🐦", description: "Post tweets, monitor mentions, and engage with your audience.", popular: false },
  { slug: "linkedin", name: "LinkedIn", category: "social", icon: "💼", description: "Publish content and grow your professional network.", popular: true },
  { slug: "youtube", name: "YouTube", category: "social", icon: "🎬", description: "Upload videos, manage your channel, and track analytics.", popular: false },
  { slug: "tiktok", name: "TikTok", category: "social", icon: "🎵", description: "Post short videos and track engagement on TikTok.", popular: false },
  { slug: "pinterest", name: "Pinterest", category: "social", icon: "📌", description: "Pin images and drive traffic from Pinterest to your website.", popular: false },
  // Productivity
  { slug: "gcal", name: "Google Calendar", category: "productivity", icon: "📅", description: "Schedule meetings, appointments, and sync with your AI team.", popular: true },
  { slug: "calendly", name: "Calendly", category: "productivity", icon: "🗓️", description: "Let customers book calls and appointments automatically.", popular: false },
  { slug: "trello", name: "Trello", category: "productivity", icon: "📋", description: "Visual project boards for organizing tasks and workflows.", popular: false },
  { slug: "asana", name: "Asana", category: "productivity", icon: "🎯", description: "Project management and task tracking for your business.", popular: false },
  { slug: "zapier", name: "Zapier", category: "productivity", icon: "⚡", description: "Connect 5,000+ apps together with automated workflows.", popular: true },
  { slug: "make", name: "Make (Integromat)", category: "productivity", icon: "🔧", description: "Visual automation builder for complex multi-step workflows.", popular: false },
  // Analytics
  { slug: "ga4", name: "Google Analytics", category: "analytics", icon: "📈", description: "Track website visitors, page views, conversions, and more.", popular: true },
  { slug: "hotjar", name: "Hotjar", category: "analytics", icon: "🔥", description: "Heatmaps, session recordings, and user feedback for your website.", popular: false },
  { slug: "posthog", name: "PostHog", category: "analytics", icon: "🦔", description: "Product analytics, feature flags, and session replay.", popular: false },
  // Suppliers
  { slug: "printful", name: "Printful", category: "suppliers", icon: "👕", description: "Print-on-demand for custom t-shirts, mugs, and more.", popular: false },
  { slug: "spocket", name: "Spocket", category: "suppliers", icon: "📦", description: "Dropshipping marketplace with US and EU suppliers.", popular: false },
  { slug: "cj-drop", name: "CJ Dropshipping", category: "suppliers", icon: "🚢", description: "Global dropshipping platform with sourcing and fulfillment.", popular: false },
];

async function main() {
  console.log('Seeding integrations...');

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { slug: integration.slug },
      update: {
        name: integration.name,
        category: integration.category,
        icon: integration.icon,
        description: integration.description,
        popular: integration.popular,
      },
      create: integration,
    });
  }

  console.log(`Seeded ${integrations.length} integrations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
