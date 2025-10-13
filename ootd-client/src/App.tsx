import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout.tsx';
import Search from './pages/Search.tsx';
import OotdAdd from './pages/OotdAdd.tsx';
import Likes from './pages/Likes.tsx';
import Mypage from './pages/Mypage.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Join from './pages/Join.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { useAuthCheck } from './hooks/useAuthCheck';

function AppContent() {
    const { isChecking } = useAuthCheck(); // 인증 상태 확인

    // 인증 확인 중이면 로딩 표시
    if (isChecking) {
        return <div>로딩 중...</div>;
    }

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='search' element={<Search />} />
                <Route
                    path='ootd/add'
                    element={
                        <ProtectedRoute>
                            <OotdAdd />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='likes'
                    element={
                        <ProtectedRoute>
                            <Likes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='mypage'
                    element={
                        <ProtectedRoute>
                            <Mypage />
                        </ProtectedRoute>
                    }
                />
                <Route path='login' element={<Login />} />
                <Route path='join' element={<Join />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
