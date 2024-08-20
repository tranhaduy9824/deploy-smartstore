export const highestShippingCost = (items) => {
    return items?.length > 0 ? Math.max(...items?.map((item) => item?.productId?.shippingCost || 0)) : 0;
};
