/* eslint-disable jsx-a11y/img-redundant-alt */
import WrapperModel from '~/components/WrapperModel';
import classNames from 'classnames/bind';
import styles from './ModelReview.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarYet } from '@fortawesome/free-regular-svg-icons';
import { useContext, useState } from 'react';
import { ReviewContext } from '~/context/ReviewContext';
import { Link } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';
import InputEmoji from 'react-input-emoji';
import { ProductContext } from '~/context/ProductContext';

const cx = classNames.bind(styles);

function ModelReview({ orderId, showReview, setShowReview, productReview, setProductReview }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);

    const { user } = useState(AuthContext);
    const { createReview, getReviewByOrder } = useContext(ReviewContext);
    const { addProductToRecent } = useContext(ProductContext);

    const handleCompleteReview = async () => {
        try {
            setShowReview(false);
            await createReview(
                { productId: productReview?._id, orderId: orderId, rating: rating, comment: comment },
                user?.token,
            );
            await getReviewByOrder(orderId, user?.token);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <WrapperModel
            show={showReview}
            onClose={() => {
                setShowReview(false);
                setProductReview(null);
            }}
            classNameContent={cx('model-review')}
        >
            <p className={cx('title')}>Đánh giá sản phẩm</p>
            <div className={cx('product')}>
                <Link to={`/product/${productReview?._id}`} onClick={() => addProductToRecent(productReview)}>
                    <img src={productReview?.files?.photos[0]} alt="Image" />
                </Link>
                <Link to={`/product/${productReview?._id}`} onClick={() => addProductToRecent(productReview)}>
                    <h4>{productReview?.name}</h4>
                </Link>
            </div>
            <div className={cx('rating')}>
                <p>Chất lượng sản phẩm</p>
                <div className={cx('stars')}>
                    <FontAwesomeIcon icon={faStarFull} onClick={() => setRating(1)} />
                    <FontAwesomeIcon icon={rating >= 2 ? faStarFull : faStarYet} onClick={() => setRating(2)} />
                    <FontAwesomeIcon icon={rating >= 3 ? faStarFull : faStarYet} onClick={() => setRating(3)} />
                    <FontAwesomeIcon icon={rating >= 4 ? faStarFull : faStarYet} onClick={() => setRating(4)} />
                    <FontAwesomeIcon icon={rating >= 5 ? faStarFull : faStarYet} onClick={() => setRating(5)} />
                </div>
                <span>
                    {(rating === 1 && 'Tệ') ||
                        (rating === 2 && 'Không hài lòng') ||
                        (rating === 3 && 'Bình thường') ||
                        (rating === 4 && 'Hài lòng') ||
                        (rating === 5 && 'Tuyệt vời')}
                </span>
            </div>
            <div className={cx('comment')}>
                <p>Để lại bình luận</p>
                <InputEmoji
                    value={comment}
                    onChange={setComment}
                    borderColor="black"
                    borderRadius={0}
                    placeholder=""
                    language="vi"
                />
            </div>
            <div className={cx('control')}>
                <div className={cx('comback')} onClick={() => setShowReview(false)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại
                </div>
                <div className={cx('complete')} onClick={handleCompleteReview}>
                    Hoàn thành
                </div>
            </div>
        </WrapperModel>
    );
}

export default ModelReview;
