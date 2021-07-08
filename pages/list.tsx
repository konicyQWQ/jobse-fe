import classNames from "classnames"
import Footer from "../components/Footer"
import Header from "../components/Header"
import JobList from "../components/JobList"
import SearchWrap from '../components/SearchWrap'
import styles from '../styles/List.module.css'
import { Degree } from "../type"

export default function List() {
  return (
    <>
      <Header />
      <SearchWrap />
      <main className="body-container">
        <div className="content-container">
          <div className={styles['container']}>
            <JobList data={[
              {
                title: "前端工程师",
                requirement: {
                  base: ['杭州', '上海'],
                  degree: Degree.Master,
                  experience: 12
                },
                salary: {
                  provided: true,
                  amount: {
                    GreaterThan: 1,
                    LessThan: 4
                  }
                },
                rating: 7.2,
                views: 3366,
                updateTime: new Date('2021.7.6'),
                company: {
                  iconUrl: 'http://pic1.jobui.com/companyLogo/10375749/16045652779687.jpg!msq',
                  name: '杭州鸿雁电器有限公司',
                },
              }
            ]} />
          </div>
        </div>
      </main>
      <Footer color="black" />
    </>
  )
}