import classNames from 'classnames/bind';
import styles from './ItemHover.module.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import WrapperHover from '~/components/WrapperHover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ItemHover({ contentHover, index, children, to, category }) {
    const navigate = useNavigate();

    return (
        <>
            {contentHover ? (
                <WrapperHover
                    right
                    noIcon
                    content={
                        <ul>
                            {contentHover.map((item, index) => {
                                let Component = NavLink;
                                if (item?.categorySub) Component = 'div';
                                return (
                                    <li key={index}>
                                        <Component
                                            to={!item?.categorySub && item.to}
                                            onClick={() => {
                                                item?.categorySub &&
                                                    navigate('/product', {
                                                        state: {
                                                            category: item.category,
                                                            categorySub: item.categorySub,
                                                        },
                                                    });
                                            }}
                                        >
                                            {item.categorySub || item}
                                        </Component>
                                    </li>
                                );
                            })}
                        </ul>
                    }
                    classNameWrapper={cx('wrapper-hover')}
                    className={cx('wrapper-item-hover')}
                >
                    <li key={index}>
                        {category ? (
                            <div
                                onClick={() => {
                                    navigate('/product', {
                                        state: {
                                            category: children,
                                        },
                                    });
                                }}
                            >
                                {children}
                            </div>
                        ) : (
                            <NavLink to={to}>{children}</NavLink>
                        )}
                        <FontAwesomeIcon icon={faChevronRight} className={cx('right-icon')} />
                    </li>
                </WrapperHover>
            ) : (
                <li key={index}>
                    <NavLink to={to}>{children}</NavLink>
                </li>
            )}
        </>
    );
}

export default ItemHover;
