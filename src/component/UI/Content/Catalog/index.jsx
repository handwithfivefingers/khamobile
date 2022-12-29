import clsx from 'clsx'
import Link from 'next/link'
import { Button } from 'rsuite'
import { useRouter } from 'next/router'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import Card from '../Card'
import ImageBlock from '../ImageBlock'
import CustomSlider from '../Slider'
import styles from './styles.module.scss'
const Catalog = (props) => {
  const router = useRouter()
  const IMG = [
    'https://www.journal-theme.com/1/image/cache/catalog/journal3/products/fashion/f1-250x250.jpg.webp',
    'https://www.journal-theme.com/1/image/cache/catalog/journal3/products/fashion/additional/8549539065_78e985be0c_o-250x250.jpg.webp',
    'https://www.journal-theme.com/1/image/cache/catalog/journal3/products/fashion/r2-250x250.jpg.webp',
    'https://www.journal-theme.com/1/image/cache/catalog/journal3/products/fashion/j1-250x250.jpg.webp',
  ]
  const className = clsx([
    styles.grid,
    {
      [styles.rtl]: props?.direction === 'rtl',
    },
  ])

  const handleRedirect = (group) => {
    // console.log(group)
    return router.push('/category/' + group.slug + '?page=1')
  }

  return (
    <div className={className}>
      <div className={clsx(styles.col, styles.firstCol)}>
        <div className={styles.title}>
          <h5>{props.data?.name}</h5>
          <div className="title__divider" />
        </div>
        <div className={styles.content}>
          <ImageBlock
            src="https://www.journal-theme.com/1/image/cache/catalog/journal3/categories/demo09-260x260.jpg.webp"
            height={'200px'}
            className={styles.imgCatalog}
          />

          <div className={styles.listLink}>
            <ul className={styles.list}>
              {props.data?.categories?.map((cateItem) => (
                <li key={[cateItem._id, cateItem.slug]} className={styles.subCateItem}>
                  <Link href={`/category/${cateItem.slug}?page=1`} passHref>
                    <a className="text-truncate w-100" alt={cateItem.name}>
                      {cateItem.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Button
            appearance="primary"
            onClick={() => handleRedirect(props.data)}
            style={{ background: 'var(--rs-blue-800)' }}
          >
            Xem tất cả
          </Button>
        </div>
      </div>

      <div className={clsx(styles.lastCol, styles.col)}>
        <div className={styles.title}>
          <h5>{props.data?.name} Nổi bật </h5>
          <div className="title__divider" />
        </div>

        <div className={clsx(styles.listCatelog)}>
          <CustomSlider
            type={TYPE_CAROUSEL.MUTI}
            slidesToShow={4}
            configs={{
              autoplay: true,
            }}
          >
            {props.data?.child?.map((item, index) => {
              return (
                <Card
                  imgSrc={item.image?.[0]?.src ? item.image?.[0]?.src : ''}
                  title={item.title}
                  price={item.price}
                  underlinePrice={item?.underlinePrice || null}
                  type={item.type}
                  variable={item.variable}
                  slug={`/product/${item.slug}`}
                  key={[index, item._id]}
                  _id={item._id}
                />
              )
            })}
          </CustomSlider>
        </div>
      </div>
    </div>
  )
}

export default Catalog
