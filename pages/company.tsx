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
import ReactECharts from 'echarts-for-react';
import { calcTagsArray } from "../utils";
import ReactWordCloud from 'react-wordcloud';

type QueryType = {
  id?: string;
  start?: number;
  limit?: number;
}

type CompanyProps = {
  company?: Company;
  query?: QueryType;
}

const loadingOption = {
  text: '加载中...',
  color: '#4413c2',
  textColor: '#270240',
  zlevel: 0,
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

  const [query, setQuery] = useState<QueryType>(props.query || {});
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


  const [wholeList, setWholeList] = useState<Position[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  useEffect(() => {
    GetCompanyPositions({
      id: company?.id,
      start: 0,
      limit: 999,
    }).then(data => {
      setWholeList(data.positions || []);
      setChartsLoading(false);
    })
  }, [])

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
                  <h2>统计信息</h2>
                  <div className={styles['charts']}>
                    <div className={styles['charts-item']}>
                      <ReactECharts
                        option={{
                          title: {
                            text: '公司四边形'
                          },
                          tooltip: {},
                          legend: {
                            data: ['公司四边形'],
                            padding: 0,
                          },
                          radar: {
                            indicator: [
                              { name: '职位数量', max: 100 },
                              { name: '平均薪水', max: 40000 },
                              { name: '平均评分', max: 5 },
                              { name: '平均浏览量', max: 1000 },
                            ]
                          },
                          series: [{
                            type: 'radar',
                            data: [
                              {
                                value: [
                                  wholeList.length,
                                  wholeList.reduce((prev, curv) =>
                                    prev + (curv.salary?.amount?.greaterThanOrEqualTo || 0), 0) / wholeList.length,
                                  wholeList.reduce((prev, curv) => prev + (curv.rating || 0), 0) / wholeList.length / 2,
                                  wholeList.reduce((prev, curv) => prev + (curv.views || 0), 0) / wholeList.length,
                                ],
                                name: '公司四边形'
                              },
                            ]
                          }]
                        }}
                        loadingOption={loadingOption}
                        showLoading={chartsLoading}
                      />
                    </div>
                    <div className={styles['charts-item']}>
                      {process.browser && <ReactWordCloud
                        words={calcTagsArray(wholeList)}
                      />}
                    </div>
                  </div>
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