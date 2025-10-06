import styles from './login.module.scss';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useActionState, useEffect, useRef, useState } from 'react';
import { apiClient, API_ENDPOINTS } from '../api';
import { validateEmail, validatePassword } from '../utils/validation';
import useUserStore, { type User } from '../stores/useUserStore';
import type { LayoutContextType } from '../types/context';
import AuthLogoSection from '../components/common/auth/AuthLogoSection.tsx';
import AuthInput from '../components/common/auth/AuthInput.tsx';
import AuthButton from '../components/common/auth/AuthButton.tsx';

type LoginState = {
    success: boolean;
    message: string;
    user?: User;
};

const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const msgRef = useRef<HTMLSpanElement>(null);
    const navigate = useNavigate();
    const login = useUserStore(state => state.login);
    const { setPageTitle } = useOutletContext<LayoutContextType>();

    const action = async (_previousState: LoginState, formData: FormData): Promise<LoginState> => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email) {
            return { success: false, message: '아이디를 입력해주세요' };
        } else if (!password) {
            return { success: false, message: '비밀번호를 입력해주세요' };
        }

        if (!validateEmail(email)) {
            return { success: false, message: '올바른 이메일 형식이 아닙니다' };
        }

        if (!validatePassword(password)) {
            return { success: false, message: '비밀번호는 영문, 숫자, 특수문자 포함 8자 이상이어야 합니다' };
        }

        try {
            const encodedPassword = btoa(password as string);

            const result = await apiClient<{ user: User }>(API_ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                body: {
                    email,
                    password: encodedPassword,
                },
            });

            return {
                success: true,
                message: '로그인 성공!',
                user: result.user,
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
            };
        }
    };

    const [state, formAction, isPending] = useActionState<LoginState, FormData>(action, {
        success: false,
        message: '',
    });

    useEffect(() => {
        setPageTitle('로그인');
    }, [setPageTitle]);

    useEffect(() => {
        setIsActive(validateEmail(email) && validatePassword(password));
    }, [email, password]);

    useEffect(() => {
        if (state.success && state.user) {
            login(state.user);
            navigate('/', { replace: true });
        }
    }, [state.success, state.user, navigate, login]);

    return (
        <div className={styles.login}>
            <AuthLogoSection h2='OOTD' p='오늘의 스타일을 공유해보세요' />

            <section className={styles.login_form_section}>
                <form action={formAction}>
                    <AuthInput
                        type='email'
                        id='email'
                        name='email'
                        label='이메일'
                        placeholder='이메일을 입력하세요'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <div className={styles.password_group}>
                        <AuthInput
                            type='password'
                            id='password'
                            name='password'
                            label='비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)'
                            placeholder='비밀번호를 입력하세요'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        {state.message && (
                            <div>
                                <span className={styles.msg} ref={msgRef}>
                                    {state.message}
                                </span>
                            </div>
                        )}

                        <Link to='/password-find'>비밀번호를 잊으셨나요?</Link>
                    </div>

                    <AuthButton type='submit' disabled={isPending} isActive={isActive}>
                        로그인
                    </AuthButton>
                </form>
                <p className={styles.login_join_link}>
                    계정이 없으신가요? <Link to='/join'>회원가입</Link>
                </p>
            </section>
        </div>
    );
};

export default Login;
