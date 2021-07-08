import Footer from "../components/Footer"
import Header from "../components/Header"
import Search from '../components/Search'
import styles from '../styles/Index.module.css'
import Button from '@material-ui/core/Button'
import Typist from 'react-typist'
import 'react-typist/dist/Typist.css'

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles['main']}>
        <Typist
          className={styles['title']}
          avgTypingDelay={150}
          stdTypingDelay={50}
          cursor={{
            blink: true,
            show: true,
          }}
        >
          让找工作不再困难
        </Typist>
        <h3 className={styles['description']}>
          Job Search 为您提供最新，最全的全网工作聚合信息
        </h3>
        <div>
          <Search className={styles['search']} />
          <div className={styles['extra-search']}>
            <Button>条件搜索?</Button>
          </div>
        </div>
      </main>
      <Footer fixed />
    </>
  )
}
