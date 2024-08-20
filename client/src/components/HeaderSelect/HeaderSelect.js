import classNames from 'classnames/bind';
import styles from './HeaderSelect.module.scss';

const cx = classNames.bind(styles);

function HeaderSelect({ listHeader, contentSelected, setContentSelected }) {
    return (
        <div className={cx('wrapper')}>
            {listHeader.map((item, index) => (
                <div
                    key={index}
                    className={cx('header-item', { selected: item.content === contentSelected })}
                    onClick={() => setContentSelected(item.content)}
                >
                    {item.title}
                </div>
            ))}
        </div>
    );
}

export default HeaderSelect;
