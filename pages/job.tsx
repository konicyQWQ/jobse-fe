import { GetServerSideProps } from "next";
import { Company, Position } from "..";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from '@material-ui/core/Button'
import Rating from '@material-ui/lab/Rating'
import Chip from '@material-ui/core/Chip';
import { GetJobDetail } from "../server";
import styles from '../styles/Job.module.css'
import { DegreeLabel } from "../type";
import Button3D from '../components/Button3D'
import CompanyCard from "../components/CompanyCard";
import RelevantJobList from "../components/RelevantJobList";
import { salary2text } from "../utils";

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
    if (data.position) {
      data.position.id = query.id;
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
                    <Rating value={position?.rating} readOnly precision={0.1} />
                  </div>
                </div>
                <div className={styles['company-container']}>
                  <div className={styles['company']}>
                    {company?.name}
                  </div>
                  <Button color="primary">
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
                        <Chip size="small" clickable label={i} key={i} />
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
                    {position?.description?.description}
                  </p>
                </article>
                <aside className={styles['aside']}>
                  <CompanyCard company={company} />
                  <RelevantJobList position={position} />
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