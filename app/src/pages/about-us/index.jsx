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

      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left>
            Về chúng tôi
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container">
            <div className="row">
              <Placeholder.Paragraph rows={20} />
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
