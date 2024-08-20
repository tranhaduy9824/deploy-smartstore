import classNames from 'classnames/bind';
import styles from './ManageReview.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState, useEffect, useCallback } from 'react';
import RatingStar from '~/components/RatingStar';
import { ReviewContext } from '~/context/ReviewContext';
import { AuthContext } from '~/context/AuthContext';
import { Link } from 'react-router-dom';
import moment from 'moment';

const cx = classNames.bind(styles);

function ManageReview({ ordersShop }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [selectedStars, setSelectedStars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const { user } = useContext(AuthContext);
    const { getReviewsByShopId } = useContext(ReviewContext);

    const fetchReviews = useCallback(async () => {
        try {
            const fetchedReviews = await getReviewsByShopId(user?.token);
            setReviews(fetchedReviews);
        } catch (error) {
            console.log(error);
        }
    }, [getReviewsByShopId, user]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        let filtered = reviews;

        if (startDate && endDate) {
            filtered = filtered.filter((review) => {
                const reviewDate = new Date(review.createdAt);
                return reviewDate >= startDate && reviewDate <= endDate;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter((review) =>
                review.productId.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (selectedStars.length > 0) {
            filtered = filtered.filter((review) => review.items.some((item) => selectedStars.includes(item.rating)));
        }

        setFilteredReviews(filtered);
    }, [reviews, startDate, endDate, searchTerm, selectedStars]);

    const handleStarChange = (star) => {
        setSelectedStars((prev) => (prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]));
    };

    const handleOptionChange = (e) => {
        const option = e.target.value;
        let start, end;

        switch (option) {
            case 'today':
                start = new Date();
                end = new Date();
                break;
            case 'last7days':
                start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                end = new Date();
                break;
            case 'last30days':
                start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                end = new Date();
                break;
            default:
                start = null;
                end = null;
                break;
        }

        setStartDate(start);
        setEndDate(end);
        setSelectedOption(option);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const totalReviews = reviews?.reduce((acc, review) => acc + review.items.length, 0);
    const positiveReviews = reviews?.reduce((acc, review) => {
        return acc + review.items.filter((item) => item.rating >= 4).length;
    }, 0);
    const negativeReviews = reviews?.reduce((acc, review) => {
        return acc + review.items.filter((item) => item.rating <= 2).length;
    }, 0);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('review-shop')}>
                <p className={cx('title')}>Đánh giá Shop</p>
                <div className={cx('box-top')}>
                    <div className={cx('item')}>
                        <span>Tổng lượt đánh giá</span>
                        <span>{totalReviews}</span>
                    </div>
                    <div className={cx('item')}>
                        <span>Tỷ lệ đánh giá đơn hàng</span>
                        <span>{(totalReviews / ordersShop?.length) * 100}%</span>
                    </div>
                    <div className={cx('item')}>
                        <span>Tỷ lệ đánh giá tốt</span>
                        <span>{totalReviews > 0 ? ((positiveReviews / totalReviews) * 100).toFixed(2) : '0%'}%</span>
                    </div>
                </div>
                <div className={cx('box-bottom')}>
                    <div className={cx('item')}>
                        <span>Đánh giá tiêu cực cần phản hồi</span>
                        <span>
                            {negativeReviews}{' '}
                            <span>
                                Xem <FontAwesomeIcon icon={faChevronRight} />
                            </span>
                        </span>
                        <p>Các đánh giá có 1 & 2 sao cần bạn cải thiện</p>
                    </div>

                    <div className={cx('item')}>
                        <span>Đánh giá gần đây</span>
                        <span>
                            {totalReviews}{' '}
                            <span>
                                Xem <FontAwesomeIcon icon={faChevronRight} />
                            </span>
                        </span>
                        <p>Đánh giá mới được cập nhật từ lần truy cập trước</p>
                    </div>
                </div>
            </div>
            <div className={cx('list-review')}>
                <p className={cx('title')}>Danh sách đánh giá shop</p>
                <div className={cx('number-star')}>
                    <span>Số sao đánh giá</span>
                    <div className={cx('item-star')}>
                        <input
                            id="all-star"
                            type="checkbox"
                            value="all"
                            checked={selectedStars.length === 0}
                            onChange={() => setSelectedStars([])}
                        />
                        <label htmlFor="all-star">Tất cả</label>
                    </div>
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div className={cx('item-star')} key={star}>
                            <input
                                id={`${star}-star`}
                                type="checkbox"
                                value={star}
                                checked={selectedStars.includes(star)}
                                onChange={() => handleStarChange(star)}
                            />
                            <label htmlFor={`${star}-star`}>{`${star} sao (${
                                reviews.filter((r) => r.items.some((item) => item.rating === star)).length
                            })`}</label>
                        </div>
                    ))}
                </div>
                <div className={cx('search')}>
                    <input
                        id="search"
                        placeholder="Nhập tên sản phẩm"
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className={cx('select-time')}>
                        <label>Thời gian đánh giá</label>
                        <div className={cx('quick-select')}>
                            <select value={selectedOption} onChange={handleOptionChange}>
                                <option value="">Chọn thời gian</option>
                                <option value="today">Hôm nay</option>
                                <option value="last7days">7 ngày</option>
                                <option value="last30days">30 ngày</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={cx('reviews')}>
                    <table>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Đánh giá</th>
                                <th>Nội dung đánh giá</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((review) =>
                                    review?.items?.filter((item) => selectedStars.includes(item.rating)).map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Link to={`/product/${review?.productId?._id}`}>
                                                    <img src={review?.productId?.files?.photos[0]} alt="Ảnh" />
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`/product/${review?.productId?._id}`}>
                                                    <p className={cx('name')}>{review?.productId?.name}</p>
                                                </Link>
                                            </td>
                                            <td>
                                                <RatingStar rating={item.rating} />
                                            </td>
                                            <td>
                                                <p className={cx('review-text')}>{item.comment}</p>
                                            </td>
                                            <td>
                                                <span className={cx('time')}>
                                                    {moment(review?.createdAt).calendar()}
                                                </span>
                                            </td>
                                        </tr>
                                    )),
                                )
                            ) : (
                                <tr>
                                    <td colSpan="5">Không có đánh giá nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageReview;
