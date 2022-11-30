import React from 'react'
import LOGO from 'assets/img/logo.png'
import ImageBlock from '../../Content/ImageBlock'
import { Panel, Placeholder } from 'rsuite'
import Image from 'next/image'
import styles from './styles.module.scss'
export default function Footer() {
  return (
    <div className="container-fluid border-top mt-4">
      <div className="row p-0">
        <div className="col-12 p-0">
          <div className="container p-0">
            <div className="row p-0">
              <div className="col-12 col-lg-3 col-md-6 col-sm-12">
                <Panel>
                  <Image src={LOGO} alt="Kha mobile" priority />
                </Panel>
              </div>
              <div className="col-12 col-lg-3  col-md-4 col-sm-6">
                <Placeholder.Paragraph rows={5} />
              </div>
              <div className="col-12 col-lg-3  col-md-4 col-sm-6">
                <Placeholder.Paragraph rows={5} />
              </div>
              <div className="col-12 col-lg-3  col-md-4 col-sm-6">
                <Placeholder.Paragraph rows={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
