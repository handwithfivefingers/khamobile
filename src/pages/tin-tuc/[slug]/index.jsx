import React from 'react'
import axios from 'configs/axiosInstance'
import PostHelmet from 'component/PostHelmet'
import Heading from 'component/UI/Content/Heading'
import styles from './styles.module.scss'
import clsx from 'clsx'
import parse from 'html-react-parser'
import CardBlock from 'component/UI/Content/CardBlock'
import PageHeader from 'component/UI/Content/PageHeader'
export default function PostDetail(props) {
  const { seo, data } = props
  return (
    <>
      <PostHelmet seo={props.seo} />

      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            {data?.title}
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div
                  className={styles.heading}
                  style={{
                    backgroundImage: `url(${process.env.API}${data?.image?.src})`,
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                />
              </div>
              <div className={clsx([styles.vr, 'col-lg-8 col-md-12'])}>
                <CardBlock className="border-0" style={{ minHeight: '50vh' }}>
                  {parse(data?.content)}
                </CardBlock>
              </div>

              <div className={clsx([styles.vr, 'col-lg-4 col-md-12'])}>
                <CardBlock className="border-0">....</CardBlock>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
  return (
    <>
      <PostHelmet seo={seo} />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className={styles.heading} style={{ backgroundImage: `url(${process.env.API}${data?.image?.src})` }}>
              <Heading type="h3" left divideClass={styles.divideLeft}>
                {data?.title}
              </Heading>
            </div>
          </div>

          <div className="col-12">
            <div className="container">
              <div className="row">
                <div className={clsx([styles.vr, 'col-lg-8 col-md-12'])}>
                  <CardBlock style={{ minHeight: '50vh' }}>{parse(data?.content)}</CardBlock>
                </div>

                <div className={clsx([styles.vr, 'col-lg-4 col-md-12'])}>
                  <CardBlock>....</CardBlock>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query
  const response = await axios.get(`/post/${slug}`)
  return {
    props: {
      data: response.data.data,
      seo: response.data.seo,
    },
  }
}
