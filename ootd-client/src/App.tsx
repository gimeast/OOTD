import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout.tsx';
import Search from './pages/Search.tsx';
import OotdAdd from './pages/ootdAdd/OotdAdd.tsx';
import Likes from './pages/Likes.tsx';
import Profile from './pages/profile/Profile.tsx';
import Login from './pages/login/Login.tsx';
import Home from './pages/home/Home.tsx';
import Join from './pages/join/Join.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { useAuthCheck } from './hooks/useAuthCheck';
import { useScrollToTop } from './hooks/useScrollToTop';
import OotdList from './pages/profile/OotdList.tsx';
import BookmarkedList from './pages/profile/BookmarkedList.tsx';
import TaggedList from './pages/profile/TaggedList.tsx';
import ProfileEdit from './pages/profile/edit/ProfileEdit.tsx';
import ProfileEditBio from './pages/profile/edit/ProfileEditBio.tsx';

function AppContent() {
    const { isChecking } = useAuthCheck();
    useScrollToTop();

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
                    path='profile'
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<OotdList />} />
                    <Route path='bookmarked' element={<BookmarkedList />} />
                    <Route path='tagged' element={<TaggedList />} />
                </Route>
                <Route
                    path='profile/edit'
                    element={
                        <ProtectedRoute>
                            <ProfileEdit />
                        </ProtectedRoute>
                    }
                ></Route>

                <Route
                    path='profile/edit/bio'
                    element={
                        <ProtectedRoute>
                            <ProfileEditBio />
                        </ProtectedRoute>
                    }
                ></Route>
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
