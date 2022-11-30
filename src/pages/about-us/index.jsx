import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import { useState } from 'react'
import { Placeholder } from 'rsuite'

export default function AboutUs() {
  const [enabled, setEnabled] = useState(true)
  const [json, setJson] = useState(null)

  return (
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
  )
}
AboutUs.Layout = CommonLayout
