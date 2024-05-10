// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  const {imageUrl, price, rating, title, brand} = itemDetails

  return (
    <li className="list-items">
      <img src={imageUrl} alt={`similar product ${title}`} className="img" />
      <h1 className="title">{title}</h1>
      <p className="brands">by {brand}</p>
      <div className="container">
        <p className="prices">Rs {price}/-</p>
        <div className="rating-cont">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
