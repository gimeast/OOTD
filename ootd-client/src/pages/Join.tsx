import { useOutletContext } from 'react-router-dom';
import { useActionState, useEffect, useState } from 'react';
import type { LayoutContextType } from '../types/context.ts';
import styles from './join.module.scss';
import AuthLogoSection from '../components/common/auth/AuthLogoSection.tsx';
import AuthInput from '../components/common/auth/AuthInput.tsx';
import AuthButton from '../components/common/auth/AuthButton.tsx';
import useDebounce from '../hooks/useDebounce';
import { API_ENDPOINTS, apiClient } from '../api';

type JoinState = {
    success: boolean;
    message: string;
};

const Join = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [agree, setAgree] = useState(false);
    const [emailCheckMessage, setEmailCheckMessage] = useState('');
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
    const debouncedEmail = useDebounce(email, 800);

    const action = async (_previousState: JoinState, formData: FormData): Promise<JoinState> => {};

    const [state, formAction, isPending] = useActionState<JoinState, FormData>(action, {
        success: false,
        message: '',
    });

    const handleTermsClick = () => {
        // TODO: 이용약관 모달 열기
    };

    const handlePrivacyClick = () => {
        // TODO: 개인정보처리방침 모달 열기
    };

    const checkEmailDuplicate = async (email: string): Promise<boolean> => {
        try {
            const result = await apiClient<{ available: boolean }>(`${API_ENDPOINTS.AUTH.CHECK_EMAIL}`, {
                method: 'POST',
                body: {
                    email,
                },
            });

            return result.available;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    useEffect(() => {
        setPageTitle('회원가입');
    }, [setPageTitle]);

    useEffect(() => {
        if (debouncedEmail && debouncedEmail.includes('@')) {
            checkEmailDuplicate(debouncedEmail).then(available => {
                if (available) {
                    setEmailCheckMessage('✓ 사용 가능한 이메일입니다');
                    setIsEmailAvailable(true);
                } else {
                    setEmailCheckMessage('✗ 이미 사용 중인 이메일입니다');
                    setIsEmailAvailable(false);
                }
            });
        } else if (debouncedEmail === '') {
            setEmailCheckMessage('');
            setIsEmailAvailable(null);
        }
    }, [debouncedEmail]);

    return (
        <div className={styles.join}>
            <AuthLogoSection h2='OOTD 시작하기' p='나만의 스타일을 세상에 공유해보세요' />

            <section className={styles.join_form_section}>
                <form>
                    <AuthInput
                        type='text'
                        id='username'
                        name='username'
                        label='사용자명'
                        placeholder='사용자명을 입력하세요'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <AuthInput
                        type='text'
                        id='nickname'
                        name='nickname'
                        label='닉네임'
                        placeholder='닉네임을 입력하세요'
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                    />
                    <div>
                        <AuthInput
                            type='email'
                            id='email'
                            name='email'
                            label='이메일'
                            placeholder='이메일을 입력하세요'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        {emailCheckMessage && (
                            <p className={`${styles.msg} ${isEmailAvailable ? styles.success : styles.fail}`}>
                                {emailCheckMessage}
                            </p>
                        )}
                    </div>
                    <AuthInput
                        type='password'
                        id='password'
                        name='password'
                        label='비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)'
                        placeholder='비밀번호를 입력하세요'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <AuthInput
                        type='password'
                        id='passwordConfirm'
                        name='passwordConfirm'
                        label='비밀번호 확인'
                        placeholder='비밀번호를 다시 입력하세요'
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                    />

                    <div className={styles.checkbox_wrapper}>
                        <input
                            type='checkbox'
                            id='agree'
                            name='agree'
                            checked={agree}
                            onChange={e => setAgree(e.target.checked)}
                        />
                        <label htmlFor='agree'>
                            <button type='button' onClick={handleTermsClick} className={styles.agree}>
                                이용약관
                            </button>{' '}
                            및{' '}
                            <button type='button' onClick={handlePrivacyClick} className={styles.agree}>
                                개인정보처리방침
                            </button>
                            에 동의합니다
                        </label>
                    </div>

                    <AuthButton type='submit' disabled={isPending}>
                        회원가입
                    </AuthButton>
                </form>
            </section>
        </div>
    );
};

export default Join;
