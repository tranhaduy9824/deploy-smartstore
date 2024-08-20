import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar({ url, className }) {
    return <img className={cx('avatar', { [className]: className })} src={url} alt="Avatar" />;
}

export default Avatar;
