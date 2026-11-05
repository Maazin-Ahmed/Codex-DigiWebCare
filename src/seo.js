export const canonicalOrigin = 'https://www.digicareweb.com'
export const canonicalPathFor = (route) => route === '/' ? '/' : `${route}/`

export const pageMetadata = {
  '/': {
    title: 'DigiCare Web — Digital transformation partner',
    description: 'DigiCare Web helps businesses move forward with digital marketing, web and software development, ecommerce, advertising, and consulting.',
  },
  '/about-us': {
    title: 'About DigiCare Web — Digital transformation partner',
    description: 'Meet DigiCare Web, a digital partner combining strategy, technology, and practical expertise to help businesses navigate change.',
  },
  '/service': {
    title: 'Digital Services — DigiCare Web',
    description: 'Explore DigiCare Web services across digital marketing, technology, ecommerce, Amazon, advertising, and business consulting.',
  },
  '/faq': {
    title: 'Frequently Asked Questions — DigiCare Web',
    description: 'Find answers about DigiCare Web services, project timelines, support, security, and how to get started.',
  },
  '/contact-us': {
    title: 'Contact DigiCare Web',
    description: 'Contact DigiCare Web to discuss a project, ask about services, or find a practical next step for your business.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy — DigiCare Web',
    description: 'Read the DigiCare Web privacy policy and learn how information shared through the website and business communications is handled.',
  },
  '/terms-and-conditions': {
    title: 'Terms and Conditions — DigiCare Web',
    description: 'Review the terms and conditions that apply to DigiCare Web services, communications, and use of this website.',
  },
  '/payment': {
    title: 'Package Request — DigiCare Web',
    description: 'Request information about a DigiCare Web package and confirm its scope, billing, and next steps with the team.',
    noindex: true,
  },
  '/cart': {
    title: 'Your Cart — DigiCare Web',
    description: 'Review selected DigiCare Web services.',
    noindex: true,
  },
  '/checkout': {
    title: 'Guest Checkout — DigiCare Web',
    description: 'Enter billing details for a DigiCare Web service order.',
    noindex: true,
  },
  '/order-confirmation': {
    title: 'Order Confirmation — DigiCare Web',
    description: 'Review your DigiCare Web order confirmation.',
    noindex: true,
  },
}

export function getPageMetadata(route, service) {
  if (service) {
    return {
      title: `${service.name} — DigiCare Web`,
      description: `${service.name} from DigiCare Web: ${service.scope}`,
    }
  }

  return pageMetadata[route] || {
    title: 'Page not found — DigiCare Web',
    description: 'The requested page could not be found. Explore DigiCare Web services or return to the homepage.',
    noindex: true,
  }
}
