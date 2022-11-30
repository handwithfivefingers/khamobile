import React from 'react'

export default function Tragop() {
  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Trả góp
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
