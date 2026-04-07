import { createClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN
const region = import.meta.env.VITE_NHOST_REGION

export const hasNhostConfig = Boolean(subdomain && region)

export const nhost = hasNhostConfig
  ? createClient({
      subdomain,
      region,
    })
  : null
