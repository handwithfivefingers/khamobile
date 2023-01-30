import GlobalProductService from 'service/global/Product.service'
import GlobalCategoryService from 'service/global/Category.service'
const EXTERNAL_DATA_URL = process.env.CANONICAL
function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--Sitemap provider-->
     ${posts
       .map(({ slug }) => {
         return `
       <url>
           <loc>${slug}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const productResponse = await GlobalProductService.getProduct({ all: true })

  const categoriesResponse = await GlobalCategoryService.getProdCate({ all: true })

  const products = productResponse.data.data

  const categories = categoriesResponse.data.data

  const formatProduct = products.map(({ slug }) => ({ slug: process.env.CANONICAL + '/product/' + slug }))

  const formatCategories = categories.map(({ slug }) => ({ slug: process.env.CANONICAL + '/category/' + slug }))

  const baseSiteMap = [
    {
      slug: process.env.CANONICAL,
    },
    {
      slug: process.env.CANONICAL + '/about-us',
    },
    {
      slug: process.env.CANONICAL + '/tin-tuc',
    },
    {
      slug: process.env.CANONICAL + '/tin-tuc/category',
    },
    {
      slug: process.env.CANONICAL + '/category',
    },
    {
      slug: process.env.CANONICAL + '/chinh-sach',
    },
  ]

  const listSiteMap = [...baseSiteMap, ...formatProduct, ...formatCategories]

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(listSiteMap)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
