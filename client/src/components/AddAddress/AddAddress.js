import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import classNames from 'classnames/bind';
import styles from './AddAddress.module.scss';
import BoxInput from '../BoxInput';
import Button from '../Button';
import { AuthContext } from '~/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AddAddress({ updateAddress, onSuccess, comeback }) {
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [address, setAddress] = useState({ city: '', district: '', ward: '' });
    const [mapCenter, setMapCenter] = useState({ lat: 21.028511, lng: 105.804817 });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [isDefault, setIsDefault] = useState(false);

    const { handleUpdate } = useContext(AuthContext);

    useEffect(() => {
        if (updateAddress) {
            setFullname(updateAddress.fullname);
            setPhone(updateAddress.phone);
            setAddressDetail(updateAddress.specificAddress);
            setIsDefault(updateAddress.isDefault);

            const city = cities.find((city) => updateAddress.address.includes(city.Name));
            if (city) {
                const district = city.Districts.find((district) => updateAddress.address.includes(district.Name));
                if (district) {
                    const ward = district.Wards.find((ward) => updateAddress.address.includes(ward.Name));
                    setAddress({
                        city: city.Id || '',
                        district: district.Id || '',
                        ward: ward.Id || '',
                    });
                    setDistricts(city.Districts || []);
                    setWards(district.Wards || []);
                }
            }
        } else {
            setFullname('');
            setPhone('');
            setAddressDetail('');
            setIsDefault(false);
            setAddress({
                city: '',
                district: '',
                ward: '',
            });
            setDistricts([]);
            setWards([]);
        }
    }, [updateAddress, cities]);

    useEffect(() => {
        axios
            .get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then((response) => setCities(response.data))
            .catch((error) => console.error('Error fetching the data:', error));
    }, []);

    const getLocationName = (id, list) => list.find((item) => item.Id === id)?.Name || '';

    const updateMapCenter = async (locationName) => {
        if (!locationName) return;

        try {
            const { data } = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${
                    process.env.REACT_APP_GOOGLE_MAP_API_KEY
                }`,
            );
            if (data.status === 'OK') {
                const location = data.results[0].geometry.location;
                setMapCenter(location);
                setMarkerPosition(location);
            } else {
                throw new Error(`Geocoding API Error: ${data.status}`);
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    };

    const handleChange = (type, id) => {
        const updatedAddress = { ...address, [type]: id };
        setAddress(updatedAddress);

        if (type === 'city') {
            const city = cities.find((city) => city.Id === id);
            setDistricts(city?.Districts || []);
            setWards([]);
            updateMapCenter(city?.Name);
        } else if (type === 'district') {
            const district = districts.find((district) => district.Id === id);
            setWards(district?.Wards || []);
            updateMapCenter(district?.Name);
        } else if (type === 'ward') {
            updateMapCenter(getLocationName(id, wards));
        }
    };

    const cityOptions = useMemo(() => cities.map((city) => ({ value: city.Id, label: city.Name })), [cities]);
    const districtOptions = useMemo(
        () => districts.map((district) => ({ value: district.Id, label: district.Name })),
        [districts],
    );
    const wardOptions = useMemo(() => wards.map((ward) => ({ value: ward.Id, label: ward.Name })), [wards]);

    return (
        <div className={cx('wrapper')}>
            <p className={cx('header')}>{updateAddress ? 'Cập nhập địa chỉ' : 'Địa chỉ mới'}</p>
            <div className={cx('fullname-phone')}>
                <BoxInput
                    onFocus={updateAddress}
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    label="Họ và tên"
                    className={cx('input')}
                />
                <BoxInput
                    onFocus={updateAddress}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    label="Số điện thoại"
                    className={cx('input')}
                    disabled
                />
            </div>
            <p className={cx('title')}>Địa chỉ</p>
            <div className={cx('address')}>
                <select id="city" value={address.city} onChange={(e) => handleChange('city', e.target.value)}>
                    <option value="">Chọn tỉnh thành</option>
                    {cityOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <select
                    id="district"
                    value={address.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    disabled={!address.city}
                >
                    <option value="">Chọn quận huyện</option>
                    {districtOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <select
                    id="ward"
                    value={address.ward}
                    onChange={(e) => handleChange('ward', e.target.value)}
                    disabled={!address.district}
                >
                    <option value="">Chọn phường xã</option>
                    {wardOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
            <BoxInput
                onFocus={updateAddress}
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                label="Địa chỉ cụ thể"
                className={cx('input')}
                disabled
            />
            <div className={cx('google-map')}>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}>
                    <GoogleMap mapContainerStyle={{ height: '100%', width: '100%' }} center={mapCenter} zoom={15}>
                        {markerPosition && <Marker position={markerPosition} />}
                    </GoogleMap>
                </LoadScript>
            </div>
            {onSuccess && !updateAddress?.isDefault && (
                <div className={cx('set-default')}>
                    <input
                        type="checkbox"
                        id="set-default"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <label htmlFor="set-default">Đặt làm địa chỉ mặc định</label>
                </div>
            )}
            {comeback && (
                <Button
                    className={cx('btn-comeback')}
                    onClick={comeback}
                    iconLeft={<FontAwesomeIcon icon={faArrowLeft} />}
                >
                    Quay lại
                </Button>
            )}
            <Button
                onClick={() => {
                    handleUpdate({
                        address: {
                            fullname,
                            phone,
                            address: `${getLocationName(address.city, cities)}, ${getLocationName(
                                address.district,
                                districts,
                            )}, ${getLocationName(address.ward, wards)}`,
                            specificAddress: addressDetail,
                            isDefault: isDefault,
                        },
                        ...(updateAddress && { addressId: updateAddress._id }),
                    });
                    onSuccess();
                    setFullname('');
                    setPhone('');
                    setAddressDetail('');
                    setIsDefault(false);
                    setAddress({ city: '', district: '', ward: '' });
                }}
            >
                Hoàn thành
            </Button>
        </div>
    );
}

export default AddAddress;
