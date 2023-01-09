import clsx from 'clsx'
import PostHelmet from 'component/PostHelmet'
import CardPost from 'component/UI/Content/CardPost'
import PageHeader from 'component/UI/Content/PageHeader'
import SideFilter from 'component/UI/Content/SideFilter'
import SidePost from 'component/UI/Content/SidePost'
import CommonLayout from 'component/UI/Layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Col, Divider, Pagination, Panel, Row } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import GlobalHomeService from 'service/global/Home.service'
import PostService from 'service/global/Post.service'
import { useMessageStore } from 'src/store/messageStore'
import styles from './styles.module.scss'
import { FcDeleteDatabase } from 'react-icons/fc'
import NoData from 'component/UI/Content/NoData'
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
      setPosts(res.data.data)
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
          <Row gutter={12} ref={cardRef}>
            <Col md={24}>
              <div className={styles.grid}>
                {/* {loading && renderSkeleton} */}
                {posts?.map((post) => {
                  return (
                    <Link href={`/tin-tuc/${post.slug}`} passHref>
                      <div className="col-12">
                        <CardPost
                          border
                          hover
                          shadow
                          imgSrc={`${post.postImg?.[0]?.filename}`}
                          title={post?.title}
                          description={post?.description}
                        />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </Col>
          </Row>

          <div className={styles.pagi}>
            <Pagination
              prev
              last
              next
              first
              size="sm"
              total={100}
              limit={10}
              activePage={activePage}
              onChangePage={(page) => setActivePage(page)}
            />
          </div>
        </>
      )
    }

    return html
  }

  const onFilterChange = (v) => console.log(v)
  let filter = null
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
                <Row gutter={12}>
                  <Col md={24}>
                    <p>
                      The category description can be positioned anywhere on the page via the layout page builder inside
                      the
                    </p>
                  </Col>

                  <Col md={24}>
                    <SideFilter onChange={onFilterChange} filter={filter} />
                  </Col>
                </Row>
                <Divider />

                {renderPost()}

                {/* <Row gutter={12} ref={cardRef}>
                  <Col md={24}>
                    <div className={styles.grid}>
                      {loading && renderSkeleton}

                      {!loading &&
                        product?.data?.map((prod) => {
                          return (
                            <Link href={`/product/${prod.slug}`} passHref key={prod._id}>
                              <div className={styles.gridItem}>
                                <Card
                                  imgSrc={prod.image?.[0]?.src ? prod.image?.[0]?.src : ''}
                                  title={prod.title}
                                  price={prod.price}
                                  underlinePrice={prod?.underlinePrice || null}
                                  type={prod.type}
                                  variable={prod.variable}
                                  hover
                                />
                              </div>
                            </Link>
                          )
                        })}
                    </div>
                  </Col>
                </Row>

                <div className={styles.pagi}>
                  <Pagination
                    prev
                    last
                    next
                    first
                    size="sm"
                    total={product?.total}
                    limit={20}
                    activePage={activePage}
                    onChangePage={(page) => {
                      setActivePage(page)
                    }}
                  />
                </div>
                 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
  return (
    <>
      <PostHelmet seo={props?.seo} />

      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left>
            Tin tức
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container">
            <div className="row gy-4">{renderPost()}</div>
            <div className="col-lg-2 col-md-12">
              <SidePost />
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
