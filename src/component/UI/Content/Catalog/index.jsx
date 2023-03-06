import clsx from 'clsx'
import Link from 'next/link'
import { Button } from 'rsuite'
import { useRouter } from 'next/router'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import Card from '../Card'
import ImageBlock from '../ImageBlock'
import CustomSlider from '../Slider'
import styles from './styles.module.scss'
import { useEffect, useMemo, useState } from 'react'
const Catalog = ({ data, direction }) => {
  const [imgSrc, setImgSrc] = useState(data?.image)
  const router = useRouter()
  const className = clsx([
    styles.grid,
    {
      [styles.rtl]: direction === 'rtl',
    },
  ])

  useEffect(() => {
    onGetImage(data?.image)
  }, [data])

  const onGetImage = (image) => {
    if (image) {
      setImgSrc(image)
    } else {
      setImgSrc('/400.png')
    }
  }

  const handleRedirect = (slug) => {
    return router.push('/category/' + slug + '?page=1')
  }

  return (
    <div className={className}>
      <div className={clsx(styles.col, styles.firstCol)}>
        <div className={styles.title}>
          <h5>{data?.name}</h5>
          <div className="title__divider" />
        </div>
        <div className={styles.content}>
          <ImageBlock
            src={imgSrc || '/400.png'}
            engine={imgSrc !== '/400.png' ? true : false}
            height={'200px'}
            className={styles.imgCatalog}
            objectFit="contain"
          />
          <div className={styles.listLink}>
            <ul className={styles.list}>
              {data?.categories?.map((cateItem) => (
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
            onClick={() => handleRedirect(data?.slug)}
            style={{ background: 'var(--rs-blue-800)' }}
          >
            Xem tất cả
          </Button>
        </div>
      </div>

      <div className={clsx(styles.lastCol, styles.col)}>
        <div className={styles.title}>
          <h5>{data?.name} Nổi bật </h5>
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
            {data?.child?.map((item, index) => {
              let { image, title, price, underlinePrice, type, variable, _id, slug } = item
              return (
                <Card
                  imgSrc={image?.[0]?.src ? image[0]?.src : ''}
                  title={title || undefined}
                  price={price || undefined}
                  underlinePrice={underlinePrice || undefined || null}
                  type={type || undefined}
                  variable={variable || undefined}
                  slug={`/product/${slug || undefined}`}
                  key={[index, _id || undefined]}
                  _id={_id || undefined}
                  border
                  hover
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
