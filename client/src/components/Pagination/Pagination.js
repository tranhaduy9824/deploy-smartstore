import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Pagination({ limit, data, children }) {
    const [currentPage, setCurrentPage] = useState(1);

    const startNumber = (currentPage - 1) * limit;
    const toNumber = startNumber + limit;

    return (
        <>
            {data?.slice(startNumber, toNumber).map((item, index) => children({ item, index }))}
            {data?.length > limit && (
                <div className={cx('list-page')}>
                    {[...Array(Math.ceil(data.length / limit))].map((_, index) => (
                        <div
                            className={cx('btn-page-change', { 'current-page': index + 1 === currentPage })}
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Pagination;
