import styles from '../styles/Clist.module.css'
import { SearchCompany, SearchCompanyRequest, SearchCompanyResponse } from '../server';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { SortOrder } from '../type';
import { Arrow } from './list';
import { useRouter } from 'next/router';
import { Pagination, BlockSelect, CompanyList, Header, Footer, CompanySearchWrap, Seo } from '../components'
import { trans2int } from '../utils';
import debounce from 'lodash/debounce';

type QueryType = SearchCompanyRequest;
type ClistProps = SearchCompanyResponse & {
  query: QueryType
};

export function FillCompanyQueryByDefault(query: QueryType): QueryType {
  return {
    limit: trans2int(query.limit) || 10,
    start: trans2int(query.start) || 0,
    title: query.title || '',
    tags: typeof query.tags == 'string' ? [query.tags] : (query.tags || []),
  }
}

export const getServerSideProps: GetServerSideProps = async (req) => {
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

  const props: ClistProps = {
    ...data,
    query,
  }

  return {
    props
  }
}

export default function Clist(props: ClistProps) {
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
      <Seo
        title={"找工作, 就看JobSearch"}
        description={"最新最全的全网工作聚合信息"}
        image={"/company.jpeg"}
      />
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