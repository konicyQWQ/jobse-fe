import Footer from "../components/Footer"
import Header from "../components/Header"
import Search from '../components/Search'
import styles from '../styles/Index.module.css'
import Button from '@material-ui/core/Button'
import Typist from 'react-typist'
import 'react-typist/dist/Typist.css'
import { useState } from "react"
import { useRouter } from "next/dist/client/router"
import { SearchJob } from "../server"
import { SortOrder } from "../type"
import { useEffect } from "react"
import { FillJobQueryByDefault } from "./list"
import AnimatedNumber from 'react-animated-number'

export default function Home() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([])
  const router = useRouter();

  async function onSearch(searchNull?: boolean) {
    router.push({
      pathname: 'list',
      query: FillJobQueryByDefault({
        sortOrder: SortOrder.Relevance,
        title: searchNull ? '' : title,
        start: 0,
        limit: 10,
      }) as unknown as null // 取消typescript报错
    })
  }

  const [total, setTotal] = useState(0);
  const getTotal = async () => {
    try {
      const data = await SearchJob(FillJobQueryByDefault({
        start: 0,
        limit: 0,
      }));
      setTotal(data.total || 0);
    } catch (e) {

    }
  }

  useEffect(() => {
    getTotal();
    const timerId = setInterval(getTotal, 2000);
    return () => clearInterval(timerId);
  }, []);

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
          <Search
            className={styles['search']}
            onValueChange={([tags, text]) => {
              setTitle(text);
              setTags(tags);
            }}
            value={title}
            tags={tags}
            onSearch={onSearch}
          />
          <div className={styles['extra-search']}>
            <Button onClick={() => {
              onSearch(true)
            }}>
              条件搜索?
            </Button>
          </div>
          <div className={styles['number']}>
            <span>当前已收录 </span>
            <AnimatedNumber component="text" value={total}
              style={{
                transition: '0.8s ease-out',
                fontSize: 36,
              }}
              duration={1000}
              stepPrecision={0}
            />
            <span> 条工作</span>
          </div>
        </div>
      </main>
      <Footer fixed />
    </>
  )
}
