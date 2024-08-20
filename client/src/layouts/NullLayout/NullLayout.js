import classNames from 'classnames/bind';
import styles from './NullLayout.module.scss';
import { Link } from 'react-router-dom';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function NullLayout({ className, children }) {
    return (
        <div className={cx('wrapper', { className: className })}>
            <div className={cx('circle1')}></div>
            <div className={cx('circle2')}></div>
            <Link to="/" className={cx('logo')}>
                <img src={images.logo_no_background} alt="Logo" />
            </Link>
            <div className={cx('content')}>{children}</div>
        </div>
    );
}

export default NullLayout;
