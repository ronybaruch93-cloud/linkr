// ==============================================================================
// DOMAIN MODELS & TYPES: DIGITAL QR GIFT & EXPERIENCE PLATFORM
// ==============================================================================

export type Archetype = 
  | 'classic'        // Single-creator timeline, envelope, music, voice note
  | 'memory_vault'   // Multi-contributor collective wall (no account required)
  | 'quest'          // Scavenger hunt / unlockable clues
  | 'time_capsule'   // Time-locked until scheduled unlock date
  | 'party';         // RSVP, live playlist, and guest interaction

export type ThemePreset = 
  | 'romantic_rose'
  | 'minimal'
  | 'dark_luxe'
  | 'pastel'
  | 'warm_sunset';

export type FontFamily = 
  | 'playfair'      // Classic Serif / Romantic
  | 'inter'         // Clean Modern Sans
  | 'montserrat'    // Bold Contemporary
  | 'caveat'        // Handwritten Letter style
  | 'lora';         // Editorial Elegance

export type ParticleEffect = 
  | 'hearts'
  | 'stars'
  | 'confetti'
  | 'sparkles'
  | 'none';

export type BackgroundStyle = 
  | 'solid'
  | 'gradient'
  | 'glassmorphism'
  | 'mesh';

export interface ThemeConfig {
  preset: ThemePreset;
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  particles: ParticleEffect;
  backgroundStyle: BackgroundStyle;
  enableGlassmorphism: boolean;
  customGradient?: string;
}

// ------------------------------------------------------------------------------
// Modular Blocks Types
// ------------------------------------------------------------------------------

export type BlockType = 
  | 'hero'
  | 'audio_player'
  | 'photo_gallery'
  | 'timeline'
  | 'secret_envelope'
  | 'whatsapp_reply'
  | 'memory_vault';

export interface HeroBlockData {
  coverImage?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  date?: string;
}

export interface AudioPlayerBlockData {
  audioUrl?: string;
  title?: string;
  artist?: string;
  audioType: 'background' | 'voice_note';
  waveformStyle: 'bars' | 'wave' | 'minimal';
  autoplay?: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  date?: string;
}

export interface PhotoGalleryBlockData {
  layout: 'grid' | 'swiper';
  photos: GalleryPhoto[];
}

export interface TimelineMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  icon?: 'heart' | 'star' | 'calendar' | 'gift' | 'music' | 'flag';
}

export interface TimelineBlockData {
  title?: string;
  milestones: TimelineMilestone[];
}

export interface SecretEnvelopeBlockData {
  waxSealColor: string;
  waxSealIcon: 'heart' | 'initials' | 'star' | 'rose';
  senderName: string;
  recipientName: string;
  letterText: string;
  fontStyle: 'handwritten' | 'serif' | 'sans';
  openedSealText?: string;
}

export interface WhatsAppReplyBlockData {
  phoneNumber: string; // International format without + (e.g. 15551234567)
  buttonText: string;
  defaultMessage: string;
}

export interface MemoryVaultBlockData {
  promptTitle: string;
  promptDescription: string;
  allowAudioUpload: boolean;
  allowImageUpload: boolean;
}

export type BlockDataMap = {
  hero: HeroBlockData;
  audio_player: AudioPlayerBlockData;
  photo_gallery: PhotoGalleryBlockData;
  timeline: TimelineBlockData;
  secret_envelope: SecretEnvelopeBlockData;
  whatsapp_reply: WhatsAppReplyBlockData;
  memory_vault: MemoryVaultBlockData;
};

export type ExperienceBlock = {
  [K in BlockType]: {
    id: string;
    type: K;
    enabled: boolean;
    order: number;
    data: BlockDataMap[K];
  };
}[BlockType];

// ------------------------------------------------------------------------------
// Experience Model
// ------------------------------------------------------------------------------

export interface Experience {
  id: string;
  slug: string;
  archetype: Archetype;
  title: string;
  description?: string;
  passcode?: string;
  theme_config: ThemeConfig;
  blocks: ExperienceBlock[];
  audio_url?: string;
  audio_type?: 'background' | 'voice_note';
  is_paid: boolean;
  payment_provider?: 'mercadopago' | 'stripe';
  payment_id?: string;
  edit_token: string;
  creator_email?: string;
  recipient_name?: string;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------------------------
// Contributor Content (MemoryVault)
// ------------------------------------------------------------------------------

export interface ContributorContent {
  id: string;
  experience_id: string;
  author_name: string;
  message: string;
  audio_url?: string;
  image_url?: string;
  created_at: string;
}

// ------------------------------------------------------------------------------
// Orders & Payments
// ------------------------------------------------------------------------------

export type PaymentProvider = 'mercadopago' | 'stripe';
export type OrderStatus = 'pending' | 'approved' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  experience_id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  payment_provider: PaymentProvider;
  provider_ref?: string;
  customer_email?: string;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------------------------
// PDF Print Card Config
// ------------------------------------------------------------------------------

export interface PrintCardConfig {
  format: 'a6' | 'square';
  includeCropMarks: boolean;
  customInstruction: string;
  recipientName?: string;
  headline?: string;
  qrCodeUrl: string;
}
