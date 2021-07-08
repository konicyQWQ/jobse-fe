import IconButton from "@material-ui/core/IconButton";
import Link from 'next/link';
import BusinessOutlined from "@material-ui/icons/BusinessOutlined";
import HistoryIcon from '@material-ui/icons/History';
import styles from '../styles/Header.module.css';
import { useEffect, useState } from "react";
import classNames from "classnames";

export default function Header() {
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.pageYOffset | document.documentElement.scrollTop;
      if (scrollTop >= (53 - 39) / 2) {
        setFixed(true);
      } else {
        setFixed(false);
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll);
  }, [])

  return (
    <>
      <div className={classNames(styles['header'], fixed && styles['fixed'])}>
        <Link href="/" passHref>
          <a className={styles['icon-container']}>
            <BusinessOutlined className={styles['icon']} />
            <span className={styles['text']}>
              Job Search / 工作搜索引擎
            </span>
          </a>
        </Link>
        <div className={styles['header-seperation']}></div>
        <IconButton>
          <HistoryIcon />
        </IconButton>
      </div>
      <div className={classNames(fixed && styles['placeholder'])}></div>
    </>
  )
}