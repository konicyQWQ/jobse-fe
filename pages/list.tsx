import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { GetServerSideProps } from 'next';
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { Position } from '..';
import BlockSelect from "../components/BlockSelect"
import Footer from "../components/Footer"
import Header from "../components/Header"
import JobList from "../components/JobList"
import SearchWrap from '../components/SearchWrap'
import { JobSearchRequest, SearchJob } from '../server';
import styles from '../styles/List.module.css'
import { Degree, SortOrder } from '../type';
import debounce from 'lodash/debounce'
import { useRouter } from 'next/dist/client/router';
import qs from 'qs';

export const Arrow = (text: React.ReactNode) => (
  <div className={styles['middle']}>
    {text}
    <ArrowDropDownIcon className={styles['icon']} />
  </div>
)

type QueryType = JobSearchRequest;
type ListProps = {
  query: QueryType;
  total?: number;
  data?: Position[];
}

export function FillJobQueryByDefault(query: QueryType) : QueryType {
  return {
    experience: query.experience || -1,
    degree: query.degree || Degree.None,
    salary: query.salary || 0,
    title: query.title || '',
    start: query.start || 0,
    limit: query.limit || 10,
    base: query.base == '全部' ? '' : (query.base || ''),
    sortOrder: SortOrder.Relevance,
  }
}

export const getServerSideProps : GetServerSideProps = async (req) => {
  const query : QueryType = FillJobQueryByDefault(req.query);
  
  let data;
  try {
    data = await SearchJob(query);
  } catch (e) {
    data = {
      positions: [],
      total: 0,
    };
  }

  const props : ListProps = {
    data: data.positions,
    total: data.total,
    query,
  }

  return {
    props
  }
}

export default function List(props: ListProps) {
  const [query, setQuery] = useState(props.query);
  const [data, setData] = useState(props.data);
  const [total, setTotal] = useState(props.total);
  const [first, setFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchJob = useCallback(debounce(async (query: JobSearchRequest) => {
    setLoading(true);
    try {
      const data = await SearchJob(query);
      setData(data.positions);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, 300), []);

  useEffect(() => {
    setFirst(false);
  }, [])

  useEffect(() => {
    if (!first) {
      searchJob(query);
    }
  }, [JSON.stringify({ ...query, title: '' })])

  return (
    <>
      <Header />
      <SearchWrap
        value={{
          title: query.title,
          base: query.base,
          degree: query.degree,
          experience: query.experience,
          salary: query.salary
        }}
        onChange={(v) => setQuery({
          ...query,
          ...v
        })}
        onSearch={() => searchJob(query)}
      />
      <main className="body-container">
        <div className="content-container">
          <div className={styles['container']}>
            <div className={styles['card']}>
              <div className={styles['sort-title']}>
                <BlockSelect
                  label="结果排序"
                  value={query?.sortOrder}
                  onChange={(sortOrder) => setQuery({...query, sortOrder})}
                  options={[
                    { value: SortOrder.Relevance, label: Arrow('相关度') },
                    { value: SortOrder.UpdateTime, label: Arrow('更新时间') },
                    { value: SortOrder.Views, label: Arrow('浏览量') },
                    { value: SortOrder.Rating, label: Arrow('评分') },
                  ]}
                />
                <div className={styles['sort-statistic']}>
                  找到 <span className={styles['number']}>{total}</span> 条结果
                </div>
              </div>
              <JobList data={data} loading={loading} />
            </div>
          </div>
        </div>
      </main>
      <Footer color="black" />
    </>
  )
}