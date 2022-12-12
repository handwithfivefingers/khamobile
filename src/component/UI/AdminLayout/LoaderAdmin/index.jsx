import { Loader, Placeholder, Animation } from 'rsuite'
import styles from './styles.module.scss'

const LoaderAdmin = ({ loading }) => {
  return (
    <Animation.Fade in={loading} unmountOnExit transitionAppear>
      {(props, ref) => (
        <div {...props} ref={ref}>
          <Loader backdrop center content="loading..." vertical />
        </div>
      )}
    </Animation.Fade>
  )
}

export default LoaderAdmin
