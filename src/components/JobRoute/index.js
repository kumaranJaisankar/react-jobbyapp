import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {BsSearch, BsStarFill} from 'react-icons/bs'

import {MdLocationOn, MdWork} from 'react-icons/md'

import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const appConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobRoute extends Component {
  state = {
    searchInput: '',
    profileData: null,
    checkboxArray: [],
    radioValue: '',
    appStatus: appConstants.initial,
    jobData: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const newData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileData: newData})
    }
  }

  successProfile = () => {
    const {profileData, searchInput} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <>
        <div className="sm-searchbar-holder">
          <input
            type="search"
            className="search-bar"
            value={searchInput}
            placeholder="Search"
            onChange={this.searchChange}
            onKeyDown={this.searchKeyDown}
          />
          <button
            type="button"
            className="search-button"
            onClick={this.getJobDetails}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <div className="success-profile-container">
          <img src={profileImageUrl} className="profile-image" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      </>
    )
  }

  retryAgain = () => this.getProfileDetails()

  failureProfile = () => (
    <div className="failure-profile-container">
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.retryAgain}
      >
        Retry
      </button>
    </div>
  )

  getJobDetails = async () => {
    const {checkboxArray, radioValue, searchInput} = this.state
    const checkboxString =
      checkboxArray.length !== 0 ? checkboxArray.join(',') : ''
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxString}&minimum_package=${radioValue}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const {jobs} = data
      const jobDetails = jobs.map(eachValue => ({
        companyLogoUrl: eachValue.company_logo_url,
        employmentType: eachValue.employment_type,
        id: eachValue.id,
        jobDescription: eachValue.job_description,
        location: eachValue.location,
        packagePerAnnum: eachValue.package_per_annum,
        rating: eachValue.rating,
        title: eachValue.title,
      }))
      this.setState({appStatus: appConstants.success, jobData: jobDetails})
    } else {
      this.setState({appStatus: appConstants.failure, jobData: ''})
    }
  }

  searchKeyDown = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  searchChange = event => {
    this.setState({searchInput: event.target.value})
  }

  tryAgain = () => {
    this.setState({appStatus: appConstants.initial}, this.getJobDetails)
  }

  successJobView = () => {
    const {jobData} = this.state
    return (
      <ul className="job-success-container">
        {jobData.map(eachValue => (
          <li className="job-item" key={eachValue.id}>
            <Link to={`/jobs/${eachValue.id}`} className="link">
              <div className="icon-container">
                <img
                  src={eachValue.companyLogoUrl}
                  className="company-logo"
                  alt="company logo"
                />
                <div className="role-holder">
                  <h1 className="role">{eachValue.title}</h1>
                  <div className="rating-holder">
                    <BsStarFill className="star-image" />
                    <p className="rating">{eachValue.rating}</p>
                  </div>
                </div>
              </div>
              <div className="job-middle-container">
                <div className="location-holder">
                  <div className="icon-holder">
                    <MdLocationOn />
                    <p className="icon-name">{eachValue.location}</p>
                  </div>
                  <div className="icon-holder">
                    <MdWork />
                    <p className="icon-name">{eachValue.employmentType}</p>
                  </div>
                </div>
                <p className="salary">{eachValue.packagePerAnnum}</p>
              </div>
              <hr />
              <h1 className="description">Description</h1>
              <p className="description-para">{eachValue.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  failureJobView = () => (
    <div className="main-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.tryAgain}
      >
        Retry
      </button>
    </div>
  )

  loaderView = () => (
    <div className="main-loader-container">
      <div className="loader-container" testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  checkboxEvent = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          checkboxArray: [...prevState.checkboxArray, event.target.value],
        }),
        this.getJobDetails,
      )
    } else {
      this.setState(
        prevState => ({
          checkboxArray: prevState.checkboxArray.filter(
            eachValue => eachValue !== event.target.value,
          ),
        }),
        this.getJobDetails,
      )
    }
  }

  radioEvent = e => {
    if (e.target.checked) {
      this.setState({radioValue: e.target.value}, this.getJobDetails)
    }
  }

  noJobView = () => (
    <div className="main-no-job-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-job-image"
        alt="no jobs"
      />
      <h1 className="no-job-heading">No Jobs Found</h1>
      <p className="no-job-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  getJobView = () => {
    const {appStatus, jobData} = this.state
    switch (appStatus) {
      case appConstants.success:
        if (jobData.length !== 0) {
          return this.successJobView()
        }
        return this.noJobView()
      case appConstants.failure:
        return this.failureJobView()
      default:
        return this.loaderView()
    }
  }

  render() {
    const {searchInput, profileData} = this.state
    return (
      <div className="main-jobs-container">
        <Header />
        <div className="jobs-container">
          <div className="jobs-filter-container">
            {profileData !== null
              ? this.successProfile()
              : this.failureProfile()}
            <hr />
            <h1 className="filter-name">Type of Employment</h1>
            <ul className="ul-list">
              {employmentTypesList.map(eachValue => (
                <li
                  className="check-box-holder"
                  key={eachValue.employmentTypeId}
                >
                  <input
                    type="checkbox"
                    className="check-box"
                    id={eachValue.employmentTypeId}
                    value={eachValue.employmentTypeId}
                    onChange={this.checkboxEvent}
                  />
                  <label htmlFor={eachValue.employmentTypeId} className="label">
                    {eachValue.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="filter-name">Salary Range</h1>
            <ul className="ul-list">
              {salaryRangesList.map(eachValue => (
                <li className="radio-holder" key={eachValue.salaryRangeId}>
                  <input
                    type="radio"
                    className="radio"
                    id={eachValue.salaryRangeId}
                    value={eachValue.salaryRangeId}
                    name="salary-radio"
                    onChange={this.radioEvent}
                  />
                  <label htmlFor={eachValue.salaryRangeId} className="label">
                    {eachValue.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="main-job-view-container">
            <div className="lg-searchbar-holder">
              <input
                type="search"
                className="search-bar"
                value={searchInput}
                placeholder="Search"
                onChange={this.searchChange}
                onKeyDown={this.searchKeyDown}
              />
              <button
                type="button"
                className="search-button"
                testid="searchButton"
                onClick={this.getJobDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getJobView()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobRoute
