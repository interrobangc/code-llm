import { Provider, ProviderConfig, ProviderItem } from '../llm/types';

const SERVICES = {
  embedding: 'embedding',
  summarization: 'summarization',
  agent: 'agent',
} as const;

export const services = Object.keys(SERVICES) as Service[];

export type Service = (typeof SERVICES)[keyof typeof SERVICES];

const DEBUG_LEVELS = {
  none: 'none',
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
} as const;

export type DebugLevel = (typeof DEBUG_LEVELS)[keyof typeof DEBUG_LEVELS];

export type Config = {
  debugLevel: DebugLevel;
  llms: Record<Service, ProviderItem>;
  providers: Record<Provider, ProviderConfig>;
};
