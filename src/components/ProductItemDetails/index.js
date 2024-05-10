// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    count: 1,
    itemsData: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getUpdatedDate = each => ({
    id: each.id,
    imageUrl: each.image_url,
    title: each.title,
    brand: each.brand,
    totalReviews: each.total_reviews,
    rating: each.rating,
    availability: each.availability,
    price: each.price,
    description: each.description,
  })

  getItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getUpdatedDate(data)
      const similar = data.similar_products.map(each =>
        this.getUpdatedDate(each),
      )
      this.setState({
        itemsData: updatedData,
        similarProducts: similar,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  descreasingCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  increasingCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderProductDetails = () => {
    const {itemsData, similarProducts, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = itemsData

    return (
      <>
        <div className="products-container">
          <img src={imageUrl} alt="product" className="image" />
          <div className="first-container">
            <h1 className="titles">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="second-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="available">
              Available: <span> {availability}</span>
            </p>
            <p className="brand">
              Brand: <span>{brand}</span>
            </p>
            <hr className="hr" />
            <div className="btn-container">
              <button
                type="button"
                className="btn"
                data-testid="minus"
                onClick={this.descreasingCount}
              >
                <BsDashSquare />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                className="btn2"
                onClick={this.increasingCount}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="btns">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="heading">Similar Products</h1>
          <ul className="list-container">
            {similarProducts.map(each => (
              <SimilarProductItem key={each.id} itemDetails={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error"
      />
      <h1 className="head">Product Not Found</h1>
      <Link to="/products">
        <button className="btnss" type="button">
          Continue Shopping
        </button>
      </Link>
    </>
  )

  renderDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header /> <div className="bg-container">{this.renderDetails()}</div>
      </>
    )
  }
}
export default ProductItemDetails
