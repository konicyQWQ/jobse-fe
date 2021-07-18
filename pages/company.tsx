import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Company, Position } from "..";
import { CompanyStatistics, GetCompanyDetail, GetCompanyPositions, GetStatistics } from "../server";
import styles from '../styles/Company.module.css'
import { Chip } from '@material-ui/core'
import { useEffect, useState } from "react";
import { Pagination, JobList, Button3D, Image, Header, Footer, Seo } from '../components'
import ReactECharts from 'echarts-for-react';
import { calcTagsArray, splitTitle, trans2int } from "../utils";
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
    start: trans2int(req.query.start as string || 0) || 0,
    limit: trans2int(req.query.end as string || 5) || 5
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
          company,
          title: splitTitle(i.title),
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


  const [statistics, setStatistics] = useState<CompanyStatistics>();
  const [chartsLoading, setChartsLoading] = useState(true);
  useEffect(() => {
    GetStatistics(company?.id).then(data => {
      setStatistics(data);
      setChartsLoading(false);
    }).catch();
  }, [])


  return (
    <>
      <Seo
        title={company?.name || 'jobSearch'}
        description={company?.description}
        image={company?.iconUrl}
      />
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
                          legend: {
                            data: ['公司四边形'],
                            padding: 0,
                            show: false,
                          },
                          tooltip: {},
                          radar: {
                            indicator: [
                              { name: '职位数量', max: 2000 },
                              { name: '平均薪水', max: 80000 },
                              { name: '平均评分', max: 5 },
                              { name: '总浏览量', max: 10000 },
                            ]
                          },
                          series: [{
                            type: 'radar',
                            data: [
                              {
                                value: [
                                  statistics?.totalCount || 0,
                                  statistics?.averageSalary || 0,
                                  (statistics?.averageRating || 0) / 2,
                                  statistics?.totalViewCount
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
                        options={{
                          fontSizes: [14, 32]
                        }}
                        callbacks={{
                          onWordClick: (word) => {
                            router.push({
                              pathname: 'list',
                              query: {
                                title: company?.name,
                                tags: word.text,
                              }
                            })
                          }
                        }}
                        words={statistics?.tags?.map(i => ({ text: i.key, value: i.value })) || []}
                      />}
                    </div>
                  </div>
                  <div>
                    <ReactECharts
                      option={{
                        title: {
                          text: '薪资范围表'
                        },
                        tooltip: {},
                        legend: {
                          data: ['薪水'],
                          show: false,
                        },
                        xAxis: {
                          data: ['0~3K', '3K~5K', '5K~10K', '10K~15K', '15K~25K', '25K以上', '面议']
                        },
                        yAxis: {},
                        series: [{
                          name: '薪水',
                          type: 'bar',
                          data: statistics?.salaryRange?.slice(1).concat(statistics.salaryRange[0]),
                        }]
                      }}
                      style={{ height: 400 }}
                      opts={{ renderer: 'svg' }}
                    />
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