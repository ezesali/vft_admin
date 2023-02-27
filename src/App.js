import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Login } from "./screens/Login/Login";
import { Home } from "./screens/PrincipalPage/Dashboard";
import {PrivatedRoutes} from './Auth/PrivatedRoutes';

import './App.css'
import { Profile } from "./screens/Profile";
import { ManageUsers } from "./screens/ManageUsers";
import { ViewUsers } from "./screens/ManageUsers/ViewUsers";
import { DeleteAccount } from "./screens/DeleteAccount";
import { ManageContent } from "./screens/ManageContent";
import { ManageCity } from "./screens/ManageCity";
import { EditCity } from "./screens/ManageCity/EditCity";
import { AddCity } from "./screens/ManageCity/AddCity";
import PageNotFound  from "./screens/PageNotFound";
import { CityReport } from "./screens/TabularReport/CityReport";
import { UsersReport } from "./screens/TabularReport/UsersReport";
import { ViewCity } from "./screens/ManageCity/ViewCity";
import { ContactUs } from "./screens/ContactUs";
import { Reply } from "./screens/ContactUs/Reply";
import { ManageTours } from "./screens/ManageTours";
import { ViewTour } from "./screens/ManageTours/ViewTours";
import { AddTour } from "./screens/ManageTours/AddTour";
import { EditTour } from "./screens/ManageTours/EditTour";
import { EditTourImage } from "./screens/ManageTours/EditTourImage";
import { ManageTourImages } from "./screens/ManageTours/ManageImages";
import { ManageRestaurants } from "./screens/ManageRestaurants";
import { ViewRestaurant } from "./screens/ManageRestaurants/ViewRestaurants";
import { EditRestaurant } from "./screens/ManageRestaurants/EditRestaurant";
import { ManageRestaurantsImages } from "./screens/ManageRestaurants/ManageRestaurantImages";
import { EditRestaurantImage } from "./screens/ManageRestaurants/EditRestaurantsImages";
import { AddRestaurant } from "./screens/ManageRestaurants/AddRestaurant";
import { ManageToken } from "./screens/ManageToken";
import { HomeContent } from "./screens/HomeContent";
import { ManageEarnings } from "./screens/ManageEarnings";
import { TourReport } from "./screens/TabularReport/TourReport";
import { RestaurantsReport } from "./screens/TabularReport/RestaurantsReport";
import { DeletedUsersReport } from "./screens/TabularReport/DeletedUsersReport";
import { EarningsReport } from "./screens/TabularReport/EarningsReport";




function App() {

  return (
  
    <div className="masterCointainer">
      <Router>
          <Routes>
            <Route element={<PrivatedRoutes/>}>
                <Route path='/' element={<Home/>} />
                <Route path='/profile' element={<Profile/>} />
                <Route path='/manage_users' element={<ManageUsers/>} />
                <Route path='/view_user/:id' element={<ViewUsers/>} />
                <Route path='/deleted_users' element={<DeleteAccount/>} />
                <Route path='/manage_content' element={<ManageContent/>} />
                <Route path='/manage_contact' element={<ContactUs/>} />
                <Route path='/send_reply/:id' element={<Reply/>} />
                <Route path='/manage_city' element={<ManageCity/>} />
                <Route path='/manage_tours' element={<ManageTours/>} />
                <Route path='/view_tour/:id' element={<ViewTour/>} />
                <Route path='/edit_tour/:id' element={<EditTour/>} />
                <Route path='/edit_tour_image/:id' element={<EditTourImage/>} />
                <Route path='/manage_tour_img/:id' element={<ManageTourImages/>} />
                <Route path='/add_tour' element={<AddTour/>} />
                <Route path='/edit_city/:id' element={<EditCity/>} />
                <Route path='/add_city' element={<AddCity/>} />
                <Route path='/view_city/:id' element={<ViewCity/>} />
                <Route path='/manage_restaurants' element={<ManageRestaurants/>} />
                <Route path='/view_restaurant/:id' element={<ViewRestaurant/>} />
                <Route path='/edit_restaurant/:id' element={<EditRestaurant/>} />
                <Route path='/add_restaurant' element={<AddRestaurant/>} />
                <Route path='/manage_resto_img/:id' element={<ManageRestaurantsImages/>} />
                <Route path='/edit_resto_image/:id' element={<EditRestaurantImage/>} />
                <Route path='/manage_token' element={<ManageToken/>} />
                <Route path='/manage_home' element={<HomeContent/>} />
                <Route path='/manage_earnings' element={<ManageEarnings/>} />
                <Route path='/city_report' element={<CityReport/>} />
                <Route path='/users_report' element={<UsersReport/>} />
                <Route path='/tours_report' element={<TourReport/>} />
                <Route path='/restaurants_report' element={<RestaurantsReport/>} />
                <Route path='/deleted_users_report' element={<DeletedUsersReport/>} />
                <Route path='/earnings_report' element={<EarningsReport/>} />
                <Route path="*" element={<PageNotFound />} />
            </Route>
            <Route caseSensitive path='/login' element={<Login/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;