import { GetServerSideProps } from "next";
import { Company, Position } from "..";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from '@material-ui/core/Button'
import Rating from '@material-ui/lab/Rating'
import Chip from '@material-ui/core/Chip';
import { GetJobDetail, RatePosition, RelevantJobQuery } from "../server";
import styles from '../styles/Job.module.css'
import { DegreeLabel } from "../type";
import Button3D from '../components/Button3D'
import CompanyCard from "../components/CompanyCard";
import RelevantJobList from "../components/RelevantJobList";
import { salary2text } from "../utils";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

type QueryType = {
  id?: string;
}

type JobProps = {
  position?: Position;
  company?: Company;
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const query : QueryType = req.query || { id: 0 };
  let data : JobProps;
  try {
    data = await GetJobDetail(query);
    // 把 ID 加入进去
    if (data.position && data.company) {
      data.position.id = query.id;
      data.company.id = data.position.companyId;
    }
  } catch (e) {
    data = {
      position: {},
      company: {},
    }
  }

  return {
    props: data
  }
}

export default function Job(props: JobProps) {
  const { position, company } = props;
  const title = position?.title?.split('#')[1];
  const salaryString = salary2text(position?.salary)
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Position[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (position?.id) {
      (async () => {
        const data = await RelevantJobQuery({
          title: position?.title,
          exclude: position?.id,
          limit: 5,
        })
        setList(data);
        setLoading(false);
      })();
    }
  }, [position?.id, position?.title])

  return (
    <>
      <Header />
      <main className="body-container">
        <div className="content-container">
          <div className={styles["container"]}>
            <div className={styles['card']}>
              {/* 工作的头部信息展示 */}
              <div className={styles['job-header']}>
                <div className={styles['title-container']}>
                  <div className={styles['title']}>
                    {title}
                  </div>
                  <div className={styles['extra-container']}>
                    <div className={styles['salary']}>
                      {salaryString}
                    </div>
                    <Rating
                      value={position?.rating / 2}
                      precision={0.1}
                      onChange={(_, v) => {
                        RatePosition({
                          id: position?.id,
                          score: ((v || 0) * 2) || position?.rating,
                        })
                        setOpen(true);
                      }}
                    />
                  </div>
                </div>
                <div className={styles['company-container']}>
                  <div className={styles['company']}>
                    {company?.name}
                  </div>
                  <Button
                    color="primary"
                    onClick={() => {
                      router.push({
                        pathname: 'company',
                        query: {
                          id: company?.id
                        }
                      })
                    }}
                  >
                    查看所有该公司职位
                  </Button>
                </div>
                <div className={styles['bottom-container']}>
                  <div className={styles['left']}>
                    <div className={styles['requirement']}>
                      <div>{position?.requirement?.base?.join(', ')}</div>
                      <div>{position?.requirement?.experience ? `${position?.requirement.experience / 12} 年以上` : '不限经验'}</div>
                      <div>{position?.requirement?.degree ? `${DegreeLabel[position?.requirement.degree]}以上` : '不限学历'}</div>
                    </div>
                    <div className={styles['tags']}>
                      {position?.description?.tags?.map(i => (
                        <div
                          key={i}
                          onClick={() => {
                            router.push({
                              pathname: 'list',
                              query: {
                                tags: [i],
                              }
                            })
                          }}
                        >
                          <Chip
                            size="small"
                            clickable
                            label={i}
                          />
                        </div>
                      ))}
                      <div className={styles['views']}>{position?.views} 次浏览</div>
                    </div>
                  </div>
                  <Button3D
                    text="申请职位"
                    onClick={() => {
                      window.open(position?.description?.url)
                    }}
                  />
                </div>
              </div>
              {/* 工作的简介和公司展示 */}
              <div className={styles['job-content']}>
                <article className={styles['article']}>
                  <h2>职位信息</h2>
                  <p>
                    {position?.description?.description?.replaceAll(/\<br\s*\/?\>/g, "\n") || '暂无简介'}
                  </p>
                </article>
                <aside className={styles['aside']}>
                  <CompanyCard company={company} />
                  <RelevantJobList
                    positions={list}
                    loading={loading}
                    onClickMore={() => {
                      router.push({
                        pathname: 'list',
                        query: {
                          title: position?.title?.split('#').join(' '),
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
      <Snackbar 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="评分成功"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  )
}