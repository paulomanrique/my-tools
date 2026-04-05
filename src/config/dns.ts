import type { DnsRecordType, ResolverDefinition } from '../types'

export const DNS_RECORD_TYPES: DnsRecordType[] = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']

export const RESOLVERS: ResolverDefinition[] = [
  {
    id: 'google-us',
    name: 'Google Public DNS',
    region: 'North America',
    endpoint: 'https://dns.google/resolve',
    kind: 'google-json',
  },
  {
    id: 'cloudflare-global',
    name: 'Cloudflare DNS',
    region: 'Global Edge',
    endpoint: 'https://cloudflare-dns.com/dns-query',
    kind: 'rfc-json',
  },
  {
    id: 'adguard-eu',
    name: 'AdGuard DNS',
    region: 'Europe',
    endpoint: 'https://dns.adguard-dns.com/resolve',
    kind: 'google-json',
  },
  {
    id: 'quad9-global',
    name: 'Quad9',
    region: 'Global',
    endpoint: 'https://dns11.quad9.net/dns-query',
    kind: 'rfc-json',
  },
]
