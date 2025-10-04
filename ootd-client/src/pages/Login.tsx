import styles from './login.module.scss';
import LogoIcon from '../components/icons/LogoIcon.tsx';
import { Link } from 'react-router-dom';
import { useActionState, useRef } from 'react';
import { apiClient, API_ENDPOINTS } from '../api';

type LoginState = {
    success: boolean;
    message: string;
};

const Login = () => {
    const msgRef = useRef<HTMLSpanElement>(null);

    const action = async (_previousState: LoginState, formData: FormData): Promise<LoginState> => {
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email) {
            return { success: false, message: '아이디를 입력해주세요' };
        } else if (!password) {
            return { success: false, message: '비밀번호를 입력해주세요' };
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
                        <input type='email' id='email' name='email' placeholder='이메일을 입력하세요' />
                    </div>

                    <div className={styles.login_form_group}>
                        <label htmlFor='password'>비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)</label>
                        <input type='password' id='password' name='password' placeholder='비밀번호를 입력하세요' />

                        {state.message && (
                            <div>
                                <span className={styles.msg} ref={msgRef}>
                                    {state.message}
                                </span>
                            </div>
                        )}

                        <Link to='/password-find'>비밀번호를 잊으셨나요?</Link>
                    </div>

                    <button type='submit' disabled={isPending}>
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
