import styles from './login.module.scss';
import LogoIcon from '../components/icons/LogoIcon.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useActionState, useEffect, useRef, useState } from 'react';
import { apiClient, API_ENDPOINTS } from '../api';
import { validateEmail, validatePassword } from '../utils/validation';

type LoginState = {
    success: boolean;
    message: string;
};

const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const msgRef = useRef<HTMLSpanElement>(null);
    const navigate = useNavigate();

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

            await apiClient(API_ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                body: {
                    email,
                    mpw: encodedPassword,
                },
            });

            return {
                success: true,
                message: '로그인 성공!',
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

    // 이메일과 비밀번호 실시간 검증
    useEffect(() => {
        setIsActive(validateEmail(email) && validatePassword(password));
    }, [email, password]);

    // 로그인 성공 시 홈으로 이동
    useEffect(() => {
        if (state.success) {
            navigate('/', { replace: true });
        }
    }, [state.success, navigate]);

    return (
        <div className={styles.login}>
            <section className={styles.logo_section}>
                <h1>
                    <LogoIcon className={styles.logo} />
                </h1>
                <h2>OOTD</h2>
                <p>오늘의 스타일을 공유해보세요</p>
            </section>

            <section className={styles.login_form_section}>
                <form action={formAction}>
                    <div className={styles.login_form_group}>
                        <label htmlFor='email'>이메일</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='이메일을 입력하세요'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.login_form_group}>
                        <label htmlFor='password'>비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
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

                    <button type='submit' className={isActive ? styles.login_btn_active : ''} disabled={isPending}>
                        로그인
                    </button>
                </form>
                <p className={styles.login_join_link}>
                    계정이 없으신가요? <Link to='/join'>회원가입</Link>
                </p>
            </section>
        </div>
    );
};

export default Login;
