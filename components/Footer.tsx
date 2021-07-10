import GitHub from '@material-ui/icons/GitHub';
import classNames from 'classnames';
import styles from '../styles/Footer.module.css'

type FooterProps = {
  fixed?: boolean;
  color?: string;
}

export default function Footer(props: FooterProps) {
  const { fixed = false, color = 'white' } = props;
  const textColor = color === 'white' ? 'black' : 'white';

  return (
    <footer
      className={classNames(styles['footer'], fixed && styles['fixed'])}
      style={{
        color: textColor,
        background: color
      }}
    >
      <div className={styles['code']}>
        <GitHub className={styles['icon']} />
        <a
          href="https://github.com/konicyQWQ/jobse-fe"
          className={styles['link']}
          target="_blank"
          rel="noreferrer"
        >
          前端
        </a>
        <a
          href="https://github.com/DWTwilight/JobSEServer"
          className={styles['link']}
          target="_blank"
          rel="noreferrer"
        >
          后端
        </a>
      </div>
      <div className={styles['copyright']}>Copyright © 2021 ZJU SE</div>
      <div className={styles['placeholder']}></div>
    </footer>
  )
}