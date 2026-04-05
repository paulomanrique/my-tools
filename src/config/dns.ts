import type { DnsRecordType, ResolverDefinition } from '../types'

export const DNS_RECORD_TYPES: DnsRecordType[] = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']

export const RESOLVERS: ResolverDefinition[] = [
  {
    id: 'google-us',
    name: 'Google Public DNS',
    region: 'North America',
    endpoint: 'https://dns.google/resolve',
    kind: 'google-json',
    browserSupported: true,
  },
  {
    id: 'cloudflare-global',
    name: 'Cloudflare DNS',
    region: 'Global Edge',
    endpoint: 'https://cloudflare-dns.com/dns-query',
    kind: 'rfc-json',
    browserSupported: true,
  },
]
