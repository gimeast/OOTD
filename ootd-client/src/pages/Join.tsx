import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import type { LayoutContextType } from '../types/context.ts';
import styles from './login.module.scss';
import LogoIcon from '../components/icons/LogoIcon.tsx';

const Join = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();

    useEffect(() => {
        setPageTitle('회원가입');
    }, [setPageTitle]);

    return (
        <div>
            <section className={styles.logo_section}>
                <h1>
                    <LogoIcon className={styles.logo} />
                </h1>
                <h2>OOTD 시작하기</h2>
                <p>나만의 스타일을 세상에 공유해보세요</p>
            </section>

            <section className={styles.login_form_section}>
                <form>
                    <div>
                        <label htmlFor='username'>사용자명</label>
                        <input type='text' id='username' name='username' placeholder='사용자명을 입력하세요' />
                    </div>
                    <div>
                        <label htmlFor='nickname'>닉네임</label>
                        <input type='text' id='nickname' name='nickname' placeholder='닉네임을 입력하세요' />
                    </div>
                    <div>
                        <label htmlFor='email'>이메일</label>
                        <input type='text' id='email' name='email' placeholder='이메일을 입력하세요' />
                    </div>
                    <div>
                        <label htmlFor='password'>비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)</label>
                        <input type='password' id='password' name='password' placeholder='비밀번호를 입력하세요' />
                    </div>
                    <div>
                        <label htmlFor='password'>비밀번호 확인</label>
                        <input type='password' id='password' name='password' placeholder='비밀번호를 다시 입력하세요' />
                    </div>
                    <div>
                        <input type='checkbox' id='agree' name='agree' />
                        <label htmlFor='password'>이용약관 및 개인정보처리방침에 동의합니다</label>
                    </div>

                    <button type='submit'>로그인</button>
                </form>
            </section>
        </div>
    );
};

export default Join;
