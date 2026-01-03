/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://menulink.xyz', // ✅ your live domain
  generateRobotsTxt: true,         // also create robots.txt
  sitemapSize: 7000,               // split large sitemaps if needed
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/404', '/_not-found'], // pages to skip
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://menulink.xyz/sitemap.xml',
    ],
  },
};
