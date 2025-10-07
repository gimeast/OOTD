import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout.tsx';
import Search from './pages/Search.tsx';
import OotdAdd from './pages/OotdAdd.tsx';
import Likes from './pages/Likes.tsx';
import Mypage from './pages/Mypage.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Join from './pages/Join.tsx';
import useUserStore from './stores/useUserStore.ts';

function App() {
    const { isLoggedIn } = useUserStore();

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='search' element={<Search />} />
                    <Route path='ootd/add' element={isLoggedIn ? <OotdAdd /> : <Login />} />
                    <Route path='likes' element={isLoggedIn ? <Likes /> : <Login />} />
                    <Route path='login' element={<Login />} />
                    <Route path='mypage' element={isLoggedIn ? <Mypage /> : <Login />} />
                    <Route path='join' element={isLoggedIn ? <Home /> : <Join />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
