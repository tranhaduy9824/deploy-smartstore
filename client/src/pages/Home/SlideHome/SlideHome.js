import classNames from "classnames/bind";
import styles from './SlideHome.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import WrapperSlide from "~/components/WrapperSlide";

const cx = classNames.bind(styles);

function SlideHome({ title, subTitle, link, data, setCurrentIndex, showNumber, classNameWrapper, classNameSlide, children }) {
    const handlePrev = () => {
        setCurrentIndex((prev) => {
            let newIndex = prev - 1;
            if (newIndex < 0) {
                newIndex = data.length - (showNumber + 1);
            }
            return newIndex;
        });
    };

    const handleNext = () => {
        setCurrentIndex((prev) => {
            let newIndex = prev + 1;
            if (newIndex >= data.length) {
                newIndex = 0;
            } else if (newIndex >= data.length - showNumber) {
                newIndex = newIndex - (data.length - showNumber);
            }
            return newIndex;
        });
    };

    return (
        <div className={cx('wrapper', { [classNameWrapper]: classNameWrapper })}>
            <div className={cx('cat-header')}>
                <div className={cx('box-title')}>
                    <h3>{title}</h3>
                    <NavLink to={link}>
                        <span>{subTitle}</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </NavLink>
                </div>
                <div className={cx('controls')}>
                    <button className={cx('prev')} onClick={handlePrev}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button className={cx('next')} onClick={handleNext}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
            <WrapperSlide
                data={data}
                setCurrentIndex={setCurrentIndex}
                className={cx('list-item',{ [classNameSlide]: classNameSlide })}
                handlePrev={handlePrev}
                handleNext={handleNext}
            >
                {children}
            </WrapperSlide>
        </div>
    );
}

export default SlideHome;
