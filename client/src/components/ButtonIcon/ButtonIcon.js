import classNames from "classnames/bind";
import styles from './ButtonIcon.module.scss';
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

function ButtonIcon({ count, onClick, to, className, children }) {
    let Component = NavLink
    const props = {
        onClick,
        to
    }

    if (onClick) {
        Component = 'div'
    }

    return (
        <div {...props} className={cx('wrapper', { [className]: className })}>
            <Component {...props}>{children}</Component>
            {count && <div className={cx('count')}>{count}</div>}
        </div>
    );
}

export default ButtonIcon;