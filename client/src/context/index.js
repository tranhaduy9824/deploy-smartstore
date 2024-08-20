import { AuthContextProvider } from './AuthContext';
import { CartContextProvider } from './CartContext';
import { CategoryContextProvider } from './CategoryContext';
import { OrderContextProvider } from './OrderContext';
import { ProductContextProvider } from './ProductContext';
import { ReviewContextProvider } from './ReviewContext';
import { ShopContextProvider } from './ShopContext';
import { WishlistContextProvider } from './WishlistContext';

function ContextProvider({ children }) {
    return (
        <AuthContextProvider>
            <CategoryContextProvider>
                <ProductContextProvider>
                    <ReviewContextProvider>
                        <CartContextProvider>
                            <WishlistContextProvider>
                                <OrderContextProvider>
                                    <ShopContextProvider>{children}</ShopContextProvider>
                                </OrderContextProvider>
                            </WishlistContextProvider>
                        </CartContextProvider>
                    </ReviewContextProvider>
                </ProductContextProvider>
            </CategoryContextProvider>
        </AuthContextProvider>
    );
}

export default ContextProvider;
