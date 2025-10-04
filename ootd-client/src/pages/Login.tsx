import styles from './login.module.scss';
import LogoIcon from '../components/icons/LogoIcon.tsx';
import { Link } from 'react-router-dom';

const Login = () => {
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
                <form>
                    <div className={styles.login_form_group}>
                        <label htmlFor='email'>이메일</label>
                        <input type='email' id='email' placeholder='이메일을 입력하세요' />
                    </div>

                    <div className={styles.login_form_group}>
                        <label htmlFor='password'>비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)</label>
                        <input type='password' id='password' placeholder='비밀번호를 입력하세요' />

                        <Link to='/password-find'>비밀번호를 잊으셨나요?</Link>
                    </div>

                    <button type='submit'>로그인</button>
                </form>
                <p className={styles.login_join_link}>
                    계정이 없으신가요? <Link to='/join'>회원가입</Link>
                </p>
            </section>
        </div>
    );
};

export default Login;
