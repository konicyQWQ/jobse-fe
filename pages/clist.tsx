import Header from '../components/Header'
import Footer from '../components/Footer'
import CompanySearchWrap from '../components/CompanySearchWrap'
import styles from '../styles/Clist.module.css'
import { SearchCompany, SearchCompanyRequest, SearchCompanyResponse } from '../server';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useState } from 'react';
import CompanyList from '../components/CompanyList'
import { SortOrder } from '../type';
import { Arrow } from './list';
import BlockSelect from '../components/BlockSelect';
import { useRouter } from 'next/dist/client/router';
import debounce from 'lodash/debounce';
import Pagination from '../components/Pagination'

type QueryType = SearchCompanyRequest;
type ClistProps = SearchCompanyResponse & {
  query: QueryType
};

export function FillCompanyQueryByDefault(query: QueryType) : QueryType {
  return {
    limit: parseInt(query.limit) || 10,
    start: parseInt(query.start) || 0,
    name: query.name || ''
  }
}

export const getServerSideProps : GetServerSideProps = async (req) => {
  const query = FillCompanyQueryByDefault(req.query);
  
  let data;
  try {
    data = await SearchCompany(query);
  } catch (e) {
    data = {
      companyList: [],
      total: 0,
    };
  }

  const props : ClistProps = {
    ...data,
    query,
  }

  return {
    props
  }
}

export default function Clist(props:ClistProps) {
  const { companyList, total } = props;
  const router = useRouter();
  
  const [query, setQuery] = useState(props.query);
  useEffect(() => {
    setQuery(props.query);
  }, [props.query])

  const routerPush = useCallback(debounce((query: QueryType) => router.push({
    pathname: 'clist',
    query: {
      ...query
    }
  }), 300), [])

  useEffect(() => {
    routerPush(query);
  }, [query.start, query.limit])
  
  return (
    <>
      <Header />
      <CompanySearchWrap value={query} onChange={setQuery} onSearch={() => routerPush(query)} />
      <main className="body-container">
        <div className="content-container">
          <div className={styles['container']}>
            <div className={styles['card']}>
              <div className={styles['sort-title']}>
                <BlockSelect
                  label="结果排序"
                  value={SortOrder.Relevance}
                  options={[
                    { value: SortOrder.Relevance, label: Arrow('相关度') },
                  ]}
                />
                <div className={styles['sort-statistic']}>
                  找到 <span className={styles['number']}>{total}</span> 条结果
                </div>
              </div>
              <CompanyList data={companyList} />
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