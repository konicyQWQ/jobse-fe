import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { Company, Position } from "..";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "../components/Image";
import { GetCompanyDetail, GetCompanyPositions } from "../server";
import styles from '../styles/Company.module.css'
import Chip from '@material-ui/core/Chip'
import Button3D from "../components/Button3D";
import { useEffect, useState } from "react";
import JobList from '../components/JobList'
import Pagination from '../components/Pagination'
import { positions } from "@material-ui/system";

type QueryType = {
  id?: string;
  start?: number;
  limit?: number;
}

type CompanyProps = {
  company?: Company;
  query?: QueryType;
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const query: QueryType = {
    id: (req.query.id || 0) as string,
    start: parseInt(req.query.start || 0) || 0,
    limit: parseInt(req.query.end || 5) || 5
  };
  let data: Company;
  try {
    data = await GetCompanyDetail(query);
    // 把 ID 加入进去
    if (data) {
      data.id = query.id;
    }
  } catch (e) {
    data = {}
  }

  return {
    props: {
      company: data,
      query,
    } as CompanyProps
  }
}

export default function CompanyDetail(props: CompanyProps) {
  const { company } = props;
  const router = useRouter();

  const [query, setQuery] = useState<QueryType>(props.query);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Position[]>([]);
  const [total, setTotal] = useState(0);

  const getCompanyPositions = async () => {
    if (query.id) {
      setLoading(true);
      try {
        const data = await GetCompanyPositions({
          ...query
        });
        setList(data.positions?.map(i => ({
          ...i,
          title: i.title?.split('#')[1],
        })) || []);
        setTotal(data.total || 0);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getCompanyPositions();
  }, [query.id, query.start, query.limit])

  return (
    <>
      <Header />
      <main className="body-container">
        <div className="content-container">
          <div className={styles['container']}>
            <div className={styles['card']}>
              <div className={styles['header']}>
                <div className={styles['header-top']}>
                  <Image src={company?.iconUrl} className="icon" />
                  <div className={styles['title-container']}>
                    <div className={styles['title']}>
                      {company?.name}
                    </div>
                    <div className={styles['location']}>
                      {company?.location}
                    </div>
                    <div className={styles['tags']}>
                      {company?.tags?.map(i => (
                        <div
                          key={i}
                          onClick={() => {
                            router.push({
                              pathname: 'clist',
                              query: {
                                name: i,
                              }
                            })
                          }}
                        >
                          <Chip size="small" clickable label={i} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles['header-bottom']}>
                  <div className={styles['description']}>
                    {company?.description}
                  </div>
                  <Button3D
                    text={"更多信息"}
                    className={styles['button']}
                    onClick={() => {
                      window.open(`https://www.tianyancha.com/company/${company?.id}`)
                    }}
                  />
                </div>
              </div>
              <div className={styles['company-content']}>
                <article className={styles['article']}>
                  <h2>公司职位</h2>
                  <JobList data={list} loading={loading} />
                  <Pagination
                    start={query.start}
                    limit={query.limit}
                    total={total}
                    onChange={(v) => setQuery({
                      ...query,
                      ...v
                    })}
                  />
                </article>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer color="black" />
    </>
  )
}