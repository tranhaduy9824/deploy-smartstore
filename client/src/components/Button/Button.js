import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Button({ div, state, iconLeft, iconRight, to, onClick, className, classNameIcon, classNameSub, children }) {
    let Component = 'div';

    if (onClick) {
        Component = 'button';
    } else if (to) {
        Component = Link;
    } else {
        Component = 'div';
    }

    if (div) {
        Component = 'div';
    }

    return (
        <div className={cx('wrapper', { [className]: className, 'wrapper-icon': iconLeft || iconRight })}>
            {iconLeft && (
                <span className={cx('icon', 'icon-left', { [classNameIcon]: classNameIcon })}>{iconLeft}</span>
            )}
            <Component
                to={to}
                onClick={onClick}
                className={cx('button', {
                    [classNameSub]: classNameSub,
                    'icon-left': iconLeft,
                    'icon-right': iconRight,
                })}
                state={state}
            >
                {children}
            </Component>
            {iconRight && (
                <span className={cx('icon', 'icon-right', { [classNameIcon]: classNameIcon })}>{iconRight}</span>
            )}
        </div>
    );
}

export default Button;
