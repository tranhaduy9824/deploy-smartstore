import classNames from 'classnames/bind';
import styles from './WrapperHover.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function WrapperHover({
    onClick = () => {},
    to,
    noIcon,
    start,
    end,
    right,
    content,
    children,
    className,
    classNameContent,
    classNameWrapper,
}) {
    return (
        <div className={cx('wrapper', { [classNameWrapper]: classNameWrapper })}>
            {children}
            {!noIcon && <div className={cx('icon')}></div>}
            <div
                className={cx('content-hover', {
                    start: start,
                    end: end,
                    right: right,
                    [classNameContent]: classNameContent,
                })}
            >
                <div className={cx('content', { [className]: className })}>
                    {Array.isArray(content) ? (
                        <ul>
                            {content.map((item, index) => {
                                let Component = Link;
                                if (item?.onClick) Component = 'div';
                                return<li key={index} onClick={() => onClick(index) || (item.onClick && item.onClick())}>
                                    <Component to={item?.to || to} state={item?.state}>{item?.title || item}</Component>
                                </li>
                            })}
                        </ul>
                    ) : (
                        content
                    )}
                </div>
            </div>
        </div>
    );
}

export default WrapperHover;
