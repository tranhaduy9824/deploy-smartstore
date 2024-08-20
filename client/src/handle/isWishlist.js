export const isWishlist = (wishlist, productId) => {
    return wishlist?.products?.some((product) => product._id.toString() === productId?.toString());
};
