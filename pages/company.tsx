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
import RelevantJobList from "../components/RelevantJobList";
import { useEffect, useState } from "react";

type QueryType = {
  id?: string;
}

type CompanyProps = {
  company?: Company;
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const query: QueryType = req.query || { id: 0 };
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
      company: data
    } as CompanyProps
  }
}

export default function CompanyDetail(props: CompanyProps) {
  const { company } = props;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Position[]>([]);

  useEffect(() => {
    if (company?.id) {
      (async () => {
        const data = await GetCompanyPositions({
          id: company.id,
          start: 0,
          limit: 5,
        })
        setList(data.positions || []);
        setLoading(false);
      })();
    }
  }, [company?.id])

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
                  123
                </article>
                <aside className={styles['aside']}>
                  <RelevantJobList
                    positions={list}
                    loading={loading}
                    onClickMore={() => {
                      router.push({
                        pathname: 'list',
                        query: {
                          title: company?.name,
                        }
                      })
                    }}
                  />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer color="black" />
    </>
  )
}