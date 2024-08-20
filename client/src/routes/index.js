// Layouts
import Home from '~/pages/Home';
import Product from '~/pages/Product';
import Cart from '~/pages/Cart';
import Profile from '~/pages/Profile';
import Login from '~/pages/Login';
import Signup from '~/pages/Signup';
import ResetPassword from '~/pages/ResetPassword';
import NullLayout from '~/layouts/NullLayout';
import ProductDetail from '~/pages/ProductDetail';
import WishList from '~/pages/WishList';
import Payment from '~/pages/Payment';
import Shop from '~/pages/Shop';
import MyShop from '~/pages/MyShop';

export const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/product',
        component: Product,
    },
    {
        path: '/product/:id',
        component: ProductDetail,
    },
    {
        path: '/shop',
        component: Shop,
    },
    {
        path: '/login',
        component: Login,
        layout: NullLayout,
    },
    {
        path: '/signup',
        component: Signup,
        layout: NullLayout,
    },
    {
        path: '/reset-password/:id/:token',
        component: ResetPassword,
        layout: NullLayout,
    },
    {
        path: '/myshop',
        component: MyShop,
    },
    {
        path: '/cart',
        component: Cart,
        private: true,
    },
    {
        path: '/profile',
        component: Profile,
        private: true,
    },
    {
        path: '/wishlist',
        component: WishList,
        private: true,
    },
    {
        path: '/payment',
        component: Payment,
        private: true,
    },
];
