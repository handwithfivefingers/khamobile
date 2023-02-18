import clsx from 'clsx'
import PostHelmet from 'component/PostHelmet'
import CardPost from 'component/UI/Content/CardPost'
import NoData from 'component/UI/Content/NoData'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Col, Divider, Pagination, Row } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import { GlobalHomeService, PostService } from 'service/global'
import styles from './styles.module.scss'
export default function Category(props) {
  const [activePage, setActivePage] = useState(1)
  const [data, setData] = useState([])
  const [posts, setPosts] = useState([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCateData()
    getPostData()
  }, [])

  const getCateData = async () => {
    try {
      setLoading(true)
      const res = await CategoryService.getCate({ type: 'post' })
      setData(res.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const getPostData = async () => {
    try {
      setLoading(true)
      const res = await PostService.getPosts()
      const postData = res.data.data
      setPosts([...postData, ...postData, ...postData])
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const renderPost = () => {
    let html = null
    if (!posts.length) {
      html = <NoData />
    } else {
      html = (
        <>
          <div className={styles.grid}>
            {posts?.map((post, index) => {
              return (
                <Link href={`/tin-tuc/${post.slug}`} passHref key={post._id}>
                  <article
                    className={clsx('col-12', styles.gridItem, {
                      [styles.firstItem]: index === 0,
                      [styles.secondItem]: index === 1,
                      [styles.thirdItem]: index === 2,
                    })}
                  >
                    <CardPost
                      border
                      hover
                      shadow
                      imgSrc={`${process.env.API}${post.image?.src}`}
                      title={post?.title}
                      description={post?.description}
                      cardType={index <= 2 ? 'horizontal' : 'vertical'}
                      imgHeight={index > 2 ? '75%' : index > 0 ? '200px' : '50%'}
                    />
                  </article>
                </Link>
              )
            })}
          </div>
        </>
      )
    }

    return html
  }

  return (
    <>
      <PostHelmet seo={props.seo} />

      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Tin tức
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container">
            <div className="row">
              <div className={clsx([styles.vr, 'col-12'])}>
                <Row gutter={[12, 12]}>
                  <Col md={24}>
                    <p>
                      The category description can be positioned anywhere on the page via the layout page builder inside
                      the
                    </p>
                  </Col>
                </Row>

                <Divider />

                {renderPost()}

                <div className="col-12">
                  <div className={styles.pagi}>
                    <Pagination
                      prev
                      last
                      next
                      first
                      size="sm"
                      total={posts.length}
                      limit={10}
                      activePage={activePage}
                      onChangePage={(page) => setActivePage(page)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Category.Layout = CommonLayout

export const getServerSideProps = async (ctx) => {
  const resp = await GlobalHomeService.getPostSeo()

  const data = resp.data
  return {
    props: {
      seo: data.seo,
    },
  }
}
