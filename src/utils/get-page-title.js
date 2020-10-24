import defaultSettings from '@/settings'

const title = defaultSettings.title || '优行教育'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
