import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const HomeRoute = () => (
  <>
    <Header />
    <div className="home-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="home-discription">
        Millions of people are searching for jobs, salery, information, companey
        reviews .Find the job that fits you abilty and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="find-job-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)
export default HomeRoute
