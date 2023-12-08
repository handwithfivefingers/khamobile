import PostHelmet from 'component/PostHelmet'
import CommonLayout from 'component/UI/Layout'
import { Placeholder } from 'rsuite'
import { GlobalHomeService } from 'service/global'
import dynamic from 'next/dynamic'

const PageHeader = dynamic(() => import('component/UI/Content/PageHeader'))

export default function AboutUs(props) {
  return (
    <>
      <PostHelmet seo={props?.seo} />
      <div className="grid grid-cols-12 p-0">
        <div className="col-span-12 px-4">
          <PageHeader type="h3" left>
            Về chúng tôi
          </PageHeader>
        </div>
        <div className="col-span-12 px-4 py-2 border-t">
          <div className="container mx-auto min-h-screen">
            <div className="grid">
              <Placeholder.Paragraph rows={80} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
AboutUs.Layout = CommonLayout

export const getServerSideProps = async (ctx) => {
  const resp = await GlobalHomeService.getAboutUsSeo()

  const data = resp.data
  return {
    props: {
      seo: data.seo,
    },
  }
}
