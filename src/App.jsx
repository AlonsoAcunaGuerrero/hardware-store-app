import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import InfoProductPage from './pages/InfoProductPage';
import ProductsByTypePage from './pages/ProductsByTypePage';
import RegisterPage from './pages/RegisterPage';
import SearchProductsPage from './pages/SearchProductsPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute, { HighAccessProtectedRoute } from './components/ProtectedRoute';
import useUserJWT from './hooks/UseUserJWT';
import config from './config';
import axios from 'axios';
import ServicesPage from './pages/ServicesPage';
import AdminPage from './pages/admin/AdminPage';
import UsersControlPage from './pages/admin/UsersControlPage';
import ProductsControlPage from './pages/admin/ProductsControlPage';
import { ShoppingCartProvider } from './context/ShoppingCartProvider';
import { PagProductsProvider } from './context/PagProductsProvider';
import OrdersControlPage from './pages/admin/OrdersControlPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  document.title = "Home";
  
  const {refreshToken, isLoged, updateAccessToken} = useUserJWT();

  useEffect(() => {
    const fetchUpdateAccessToken = async () => {
      const configuration = {
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
      };

      await axios.get(`${config.userApiURL}/refresh_access_token`, configuration)
      .then((res) => {
        updateAccessToken(res.data?.newAccesToken);
      }).catch((err) => {});
    }

    const fetchVerifyAccessToken = async () => {
      await axios.get(`${config.userApiURL}/verify_access_token`)
      .then((res) => {}).catch((err) => {fetchUpdateAccessToken()});
    }

    if(isLoged){
      fetchVerifyAccessToken();
    }
  }, [])
  
  return (
    <div className='flex flex-col min-h-screen'>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to='/products?page=1&limit=12&display=G'/>} />
            <Route path='/products' element={
              <PagProductsProvider>
                <ProductsPage />
              </PagProductsProvider>} />
            <Route path='/products/type/:type' element={
              <PagProductsProvider>
                <ProductsByTypePage />
              </PagProductsProvider>} />
            <Route path='/products/search' element={
              <PagProductsProvider>
                <SearchProductsPage />
              </PagProductsProvider>} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/services' element={<ServicesPage />}/>
            <Route path='/product/find/:name' element={<InfoProductPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          

          <Route path='/user/*' element={<ProtectedRoute isAllowed={isLoged} redirectTo='/' />}>
            <Route path='profile' element={<UserProfilePage />} />
            <Route path='shopping_cart' element={
            <ShoppingCartProvider>
              <ShoppingCartPage />
            </ShoppingCartProvider>
            } />
          </Route>

          <Route path='/admin/*' element={<HighAccessProtectedRoute />}>
            <Route path='panel' element={<AdminPage />} />
            <Route path='panel/users' element={<UsersControlPage />} />
            <Route path='panel/products' element={<ProductsControlPage />} />
            <Route path='panel/orders' element={<OrdersControlPage />} />
            <Route path='*' element={<Navigate to={'/admin/panel'} />} />
          </Route>

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
