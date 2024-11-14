import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Station from './components/Station';
import { StationInfoContextProvider } from './contexts/StationInfoContext';
import SearchPage from './pages/SearchPage';
import StationsPage from './pages/StationsPage';

const App = () => (
    <BrowserRouter>
        <div className = "App">
            <Routes>
                <Route path = "/stations">
                    <Route path = ":id" element = { <Station/> }/>
       
                    <Route index element = { <StationsPage/> }/>
                </Route>
                <Route path = "/search">
                    <Route index element = {
                        <StationInfoContextProvider>
                            <SearchPage/>
                        </StationInfoContextProvider>
                    }/>
                </Route>
            </Routes>
            <footer>
                <hr/>
                <nav aria-label = "Main navigation">
                    <Link to = "/stations">Stations</Link>
                    <Link to = "/search">Search</Link>
                </nav>
            </footer>
        </div>
    </BrowserRouter>
);

export default App;
