import Footer from "../components/Footer"
import Header from "../components/Header"
import Search from '../components/Search'
import styles from '../styles/Index.module.css'
import Button from '@material-ui/core/Button'
import Typist from 'react-typist'
import 'react-typist/dist/Typist.css'
import { useState } from "react"
import { useRouter } from "next/dist/client/router"
import { GetHotTags, SearchJob } from "../server"
import { SortOrder } from "../type"
import { useEffect, memo } from "react"
import { FillJobQueryByDefault } from "./list"
import AnimatedNumber from 'react-animated-number'
import { HotTags } from ".."
import ReactWordcloud from "react-wordcloud"

type TagsCloudProps = {
  words?: HotTags[];
}

const TagsCloud = memo(function TagsCloud(props: TagsCloudProps) {
  const { words } = props;
  const router = useRouter();

  return (
    process.browser ? <ReactWordcloud
      options={{
        fontSizes: [14, 32]
      }}
      callbacks={{
        onWordClick: (word) => {
          router.push({
            pathname: 'list',
            query: {
              tags: word.text,
            }
          })
        }
      }}
      words={words?.map(i => ({ text: i.text || '', value: i.value || 0 })) || []}
    /> : <div></div>
  )
}, (pre) => {
  return (pre.words?.length || 0) > 0
})

export default function Home() {
  const [state, setState] = useState({
    title: '',
    tags: [],
  } as {
    title: string;
    tags: string[];
  })
  const title = state.title;
  const tags = state.tags;

  const router = useRouter();

  async function onSearch(searchNull?: boolean) {
    router.push({
      pathname: 'list',
      query: FillJobQueryByDefault({
        title: searchNull ? '' : title,
        start: 0,
        limit: 10,
        tags,
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

  const [hotTags, setHotTags] = useState<HotTags[]>([]);
  const getHotTags = async () => {
    try {
      const data = await GetHotTags({ limit: 20 });
      setHotTags(data);
    } catch (e) {}
  }

  useEffect(() => {
    getTotal();
    const timerId = setInterval(getTotal, 2000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    getHotTags();
  }, [])

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
              setState({
                tags,
                title: text,
              })
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
          <div className={styles['wordcloud']}>
            <TagsCloud words={hotTags} />
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
