import classNames from 'classnames/bind';
import styles from './RatingStar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarFull, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarYet } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function RatingStar({ rating, className }) {
    const fullStar = Math.trunc(rating);
    const halfStar = rating - fullStar;

    return (
        <div className={cx('wrapper', { [className]: className })}>
            {[...Array(5)].map((_, index) => {
                if (index < fullStar) {
                    return (
                        <span className={cx('star-icon')} key={index}>
                            <FontAwesomeIcon icon={faStarFull} />
                        </span>
                    );
                } else if (index === fullStar && halfStar > 0.7) {
                    return (
                        <span className={cx('star-icon')} key={index}>
                            <FontAwesomeIcon icon={faStarFull} />
                        </span>
                    );
                } else if (index === fullStar && halfStar >= 0.3 && halfStar <= 0.7) {
                    return (
                        <span className={cx('star-icon')} key={index}>
                            <FontAwesomeIcon icon={faStarHalfAlt} />
                        </span>
                    );
                } else {
                    return (
                        <span className={cx('star-icon')} key={index}>
                            <FontAwesomeIcon icon={faStarYet} />
                        </span>
                    );
                }
            })}
        </div>
    );
}

export default RatingStar;
