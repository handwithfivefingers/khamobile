import clsx from 'clsx'
import Link from 'next/link'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import Card from '../Card'
import ImageBlock from '../ImageBlock'
import CustomSlider from '../Slider'
import styles from './styles.module.scss'
const Catalog = (props) => {
  console.log(props.data)

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

  return (
    <div className={className}>
      <div className={clsx(styles.col, styles.firstCol)}>
        <div className={styles.title}>
          <h5>{props.data?.name}</h5>
          <div className="title__divider" />
        </div>
        <div className={styles.content}>
          <ImageBlock src="https://www.journal-theme.com/1/image/cache/catalog/journal3/categories/demo09-260x260.jpg.webp" />

          <div className={styles.listLink}>
            <ul>
              <li>
                <a>Accessories</a>
              </li>
              <li>
                <a>Dresses</a>
              </li>
              <li>
                <a>Pants</a>
              </li>
              <li>
                <a>T-Shirts</a>
              </li>
            </ul>
          </div>
          <button className={'btn btn-primary'}>See All</button>
        </div>
      </div>

      <div className={clsx(styles.lastCol, styles.col)}>
        <div className={styles.title}>
          <h5>New in Fashion</h5>
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
            {props.data?.child?.map((item) => {
              return (
                <Card
                  imgSrc={item.img?.[0]?.filename}
                  title={item.title}
                  price={item.price}
                  underlinePrice={item?.underlinePrice || null}
                  type={item.type}
                  variable={item.variable}
                  slug={`/product/${item.slug}`}
                  key={item._id}
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
