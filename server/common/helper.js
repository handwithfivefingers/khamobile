import currencyFormat from 'currency-formatter'
import { MetadataGenerator } from 'metatags-generator'

const formatCurrency = (str, options) => {
  //   let result;

  const option = {
    symbol: 'VNĐ',
    precision: 0,
    thousang: ',',
    format: '%v %s',
    ...options,
  }
  const result = currencyFormat.format(str, option)
  return result
}

const generateSeoTag = (data) => {
  const settings = {
    structuredData: true,
    androidChromeIcons: true,
    msTags: true,
    safariTags: true,
    appleTags: true,
    openGraphTags: true,
    twitterTags: true,
    facebookTags: true,
  }

  const generator = new MetadataGenerator()

  const seoFromPost = {
    title: data.title,
    description: data.description,
    url: data.url || process.env.CANONICAL,

    keywords: data.keywords || 'mobile, app mobile, kha mobile, khamobile post',
    locale: 'vi_VI',
  }

  if (data?.image) {
    seoFromPost.image = `${process.env.API}${data?.image}`
  }

  const preparedData = generator
    .configure(settings)
    .setRobots('index, follow')
    // .setShortLink('https://bit.ly/1ahy')
    // .setLocalVersion('en_US', 'https://example.com', true)
    // .setAlternateHandheld('https://m.example.com')
    .setProjectMeta({
      name: process.env.APP_NAME,
      url: process.env.CANONICAL,
      logo: process.env.LOGO,
      primaryColor: '#333333',
      backgroundColor: '#ffffff',
    })
    .setPageMeta(seoFromPost)
    // .openGraphData('video.movie')
    .setCanonical(process.env.CANONICAL)
    .breadcrumb(data?.breadcrumb || [])
    // .setIcons(icons)
    // .setTwitterMeta({
    // 	card: 'summary_large_image',
    // 	site: '@nytimesbits',
    // 	creator: '@nickbilton',
    // })
    .setFacebookMeta(5233)
    .build()
  return preparedData
}

export { formatCurrency, generateSeoTag }
