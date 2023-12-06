import PostHelmet from 'component/PostHelmet'
// import Card from 'component/UI/Content/Card'
// import ImageBlock from 'component/UI/Content/ImageBlock'
// import NoData from 'component/UI/Content/NoData'
// import PageHeader from 'component/UI/Content/PageHeader'
// import SideFilter from 'component/UI/Content/SideFilter'
import CommonLayout from 'component/UI/Layout'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BsInboxes } from 'react-icons/bs'
import { Button, Divider, Drawer, Pagination } from 'rsuite'
import { GlobalCategoryService, GlobalHomeService } from 'service/global'
import styles from './styles.module.scss'
import dynamic from 'next/dynamic'

const Card = dynamic(() => import('component/UI/Content/Card'))
const ImageBlock = dynamic(() => import('component/UI/Content/ImageBlock'))
const NoData = dynamic(() => import('component/UI/Content/NoData'))
const PageHeader = dynamic(() => import('component/UI/Content/PageHeader'))
const SideFilter = dynamic(() => import('component/UI/Content/SideFilter'))

const PAGE_SIZE = 20
export default function SingleCategory({ seo, slug, page, ...props }) {
  const [drawer, setDrawer] = useState({
    open: false,
    placement: 'left',
  })

  const router = useRouter()

  const [data, setData] = useState([])

  const [activePage, setActivePage] = useState(+page)

  const [filter, setFilter] = useState({})

  useEffect(() => {
    getScreenData()
  }, [filter, slug])

  const onFilterChange = (val) => {
    setFilter(val)
  }

  const getScreenData = async () => {
    try {
      const resp = await GlobalCategoryService.getProdByCategorySlug(slug, { ...filter })
      setData(resp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onChangePage = (page) => {
    setActivePage(page)
    router.push({
      pathname: `/category/${slug}`,
      query: { page },
    })
  }

  const tagClick = useCallback((v) => {
    router.push(`/category/${v.slug}`)
    setFilter({})
  }, [])

  if (!data) {
    return <NoData />
  }

  const renderProduct = useMemo(() => {
    let html = null
    if (data?.product?.items?.length) {
      let currentData = data?.product?.items?.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE)
      html = (
        <div className="row">
          <div className="col-12">
            <div className={styles.grid}>
              {currentData?.map((item) => {
                return (
                  <Card
                    key={item._id}
                    imgSrc={item.image?.[0]?.src || ''}
                    title={item.title}
                    price={item.price}
                    underlinePrice={item?.underlinePrice || null}
                    type={item.type}
                    variable={item.variable}
                    slug={`/product/${item.slug}`}
                    hover
                  />
                )
              })}
            </div>
          </div>
          <div className="col-12">
            <div className={styles.pagi}>
              <Pagination
                prev
                next
                size="sm"
                total={data.product.items?.length}
                limit={PAGE_SIZE}
                activePage={+activePage}
                onChangePage={onChangePage}
              />
            </div>
          </div>
        </div>
      )
    } else {
      html = (
        <div className="d-flex justify-content-center flex-column align-items-center">
          <BsInboxes style={{ fontSize: 36, color: 'var(--rs-blue-800)' }} />
          <p className="text-secondary">Không có sản phẩm phù hợp với tiêu chí bạn tìm</p>
        </div>
      )
    }
    return html
  }, [data.product])

  return (
    <>
      <PostHelmet seo={seo} />
      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Danh mục: {data?.cate?.name}
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container product_detail">
            <div className="row gy-4">
              <div className="col-3">
                <ImageBlock src={data?.cate?.image || ''} engine={data?.cate?.image ? true : false} />
              </div>
              <div className="col-9">
                <p>{data.cate?.description}</p>
              </div>
              <div className="col-24">
                <SideFilter onChange={onFilterChange} filter={filter} tagClick={tagClick} withMemory />
              </div>
              <Divider />

              {renderProduct}
            </div>
          </div>
        </div>
        <Drawer
          placement={drawer.placement}
          open={drawer.open}
          onClose={() => setDrawer({ ...drawer, open: false })}
          size="xs"
        >
          <Drawer.Header>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.Actions>
              <Button onClick={() => setDrawer({ ...drawer, open: false })}>Cancel</Button>
              <Button onClick={() => setDrawer({ ...drawer, open: false })} appearance="primary">
                Confirm
              </Button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            <SideFilter />
          </Drawer.Body>
        </Drawer>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug, page } = ctx.query

  const resp = await GlobalHomeService.getSingleCategorySeo(slug)

  return {
    props: {
      seo: resp.data.seo,
      slug: slug,
      page: page || 1,
    },
  }
}

SingleCategory.Layout = CommonLayout
