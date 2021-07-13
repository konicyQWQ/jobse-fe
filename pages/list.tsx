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
import { useRouter } from 'next/dist/client/router';
import debounce from 'lodash/debounce';
import Pagination from '../components/Pagination';
import { trans2int } from '../utils';

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
    experience: query.experience != undefined ? trans2int(query.experience) : -1,
    degree: trans2int(query.degree) || Degree.None,
    salary: trans2int(query.salary) || 0,
    title: query.title || '',
    start: trans2int(query.start) || 0,
    limit: trans2int(query.limit) || 10,
    base: query.base == '全部' ? '' : (query.base || ''),
    sortOrder: parseInt(query.sortOrder) || SortOrder.Relevance,
    tags: query.tags || [],
  }
}

export const getServerSideProps : GetServerSideProps = async (req) => {
  const query : QueryType = FillJobQueryByDefault({
    ...req.query,
    tags: (req.query?.tags as string || undefined)?.split(',') || [],
  });

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
    props,
  }
}

export default function List(props: ListProps) {
  const { data, total } = props;
  const router = useRouter();

  const [query, setQuery] = useState(props.query);
  useEffect(() => {
    setQuery(props.query)
  }, [props.query])

  const routerPush = useCallback(debounce((query: QueryType) => router.push({
    pathname: 'list',
    query: {
      ...query,
      tags: query?.tags?.join(',')
    }
  }), 300), [])

  useEffect(() => {
    routerPush({
      ...query,
      start: 0,
      limit: 10,
    });
  }, [query.base, query.degree, query.experience, query.sortOrder, query.salary])

  useEffect(() => {
    routerPush(query)
  }, [query.start, query.limit])

  return (
    <>
      <Header />
      <SearchWrap
        value={{
          title: query.title,
          base: query.base,
          degree: query.degree,
          experience: query.experience,
          salary: query.salary,
          tags: query.tags,
        }}
        onChange={(v) => setQuery({
          ...query,
          ...v
        })}
        onSearch={() => routerPush(query)}
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
              <JobList data={data} />
              <Pagination
                start={query.start}
                limit={query.limit}
                total={total} 
                onChange={(v) => setQuery({
                  ...query,
                  ...v
                })}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer color="black" />
    </>
  )
}