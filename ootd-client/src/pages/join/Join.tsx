import { useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { LayoutContextType } from '../../types/context.ts';
import styles from './join.module.scss';
import LogoSection from '../../components/common/LogoSection.tsx';
import AuthInput from '../../components/common/auth/AuthInput.tsx';
import BasicButton from '../../components/common/button/BasicButton.tsx';
import useDebounce from '../../hooks/useDebounce.ts';
import { API_ENDPOINTS, apiClient } from '../../api';
import { validateEmail, validatePassword } from '../../utils/validation.ts';
import useUserStore from '../../stores/useUserStore.ts';
import useModalStore from '../../stores/useModalStore.ts';

type JoinResponse = {
    isSuccess: boolean;
    message?: string;
};

const Join = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const { isLoggedIn } = useUserStore();
    const { openModal, onClose } = useModalStore();

    const [name, setName] = useState('');

    const [nickname, setNickname] = useState('');
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
    const debouncedNickname = useDebounce(nickname, 500);

    const [email, setEmail] = useState('');
    const [emailCheckMessage, setEmailCheckMessage] = useState('');
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
    const debouncedEmail = useDebounce(email, 500);

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState('');
    const [isPasswordAvailable, setIsPasswordAvailable] = useState<boolean | null>(null);
    const debouncedPassword = useDebounce(password, 500);
    const debouncedPasswordConfirm = useDebounce(passwordConfirm, 500);

    const [isAgree, setIsAgree] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    const handleTermsClick = () => {
        // TODO: 이용약관 모달 열기
    };

    const handlePrivacyClick = () => {
        // TODO: 개인정보처리방침 모달 열기
    };

    const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
        try {
            const result = await apiClient<{ available: boolean }>(`${API_ENDPOINTS.AUTH.CHECK_NICKNAME}`, {
                method: 'POST',
                body: {
                    nickname,
                },
            });

            return result.available;
        } catch (error) {
            console.error(error);
            return false;
        }
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

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        const encodedPassword = btoa(password as string);

        setIsPending(true);
        try {
            const result = await apiClient<JoinResponse>(`${API_ENDPOINTS.AUTH.JOIN}`, {
                method: 'POST',
                body: {
                    name,
                    nickname,
                    email,
                    password: encodedPassword,
                    allAgreed: isAgree,
                },
            });

            if (result.isSuccess) {
                openModal({
                    title: '환영합니다!',
                    subTitle: 'OOTD 회원가입이 완료되었습니다!',
                    confirmText: '시작하기',
                    closeOnBackdropClick: false,
                    onConfirm: () => {
                        navigate('/', { replace: true });
                        onClose();
                    },
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        setPageTitle('회원가입');
    }, [setPageTitle]);

    useEffect(() => {
        if (debouncedNickname) {
            checkNicknameDuplicate(debouncedNickname).then(available => {
                if (available) {
                    setNicknameCheckMessage('✓ 사용 가능한 닉네임입니다');
                    setIsNicknameAvailable(true);
                } else {
                    setNicknameCheckMessage('✗ 이미 사용 중인 닉네임입니다');
                    setIsNicknameAvailable(false);
                }
            });
        } else if (debouncedNickname === '') {
            setNicknameCheckMessage('');
            setIsNicknameAvailable(null);
        }
    }, [debouncedNickname]);

    useEffect(() => {
        if (debouncedEmail && validateEmail(debouncedEmail)) {
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

    useEffect(() => {
        if (debouncedPassword && debouncedPasswordConfirm) {
            if (!validatePassword(debouncedPassword)) {
                setPasswordCheckMessage('✗ 비밀번호는 영문, 숫자, 특수문자 포함 8자 이상이어야 합니다');
                setIsPasswordAvailable(false);
            } else if (debouncedPassword !== debouncedPasswordConfirm) {
                setPasswordCheckMessage('✗ 비밀번호가 일치하지 않습니다');
                setIsPasswordAvailable(false);
            } else {
                setPasswordCheckMessage('✓ 사용 가능한 비밀번호입니다');
                setIsPasswordAvailable(true);
            }
        } else if (debouncedPasswordConfirm === '') {
            setPasswordCheckMessage('');
            setIsPasswordAvailable(null);
        }
    }, [debouncedPassword, debouncedPasswordConfirm]);

    useEffect(() => {
        setIsActive(
            name.length > 0 &&
                isNicknameAvailable === true &&
                isEmailAvailable === true &&
                isPasswordAvailable === true &&
                isAgree
        );
    }, [name, isNicknameAvailable, isEmailAvailable, isPasswordAvailable, isAgree]);

    useEffect(() => {
        if (isLoggedIn) navigate('/', { replace: true });
    }, [navigate, isLoggedIn]);

    return (
        <div className={styles.join}>
            <div className={styles.logo_section}>
                <LogoSection h2='OOTD 시작하기' p='나만의 스타일을 세상에 공유해보세요' />
            </div>

            <section className={styles.join_form_section}>
                <form onSubmit={handleJoin}>
                    <AuthInput
                        type='text'
                        id='username'
                        name='username'
                        label='사용자명'
                        placeholder='사용자명을 입력하세요'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <div>
                        <AuthInput
                            type='text'
                            id='nickname'
                            name='nickname'
                            label='닉네임'
                            placeholder='닉네임을 입력하세요'
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                        />
                        {nicknameCheckMessage && (
                            <p className={`${styles.msg} ${isNicknameAvailable ? styles.success : styles.fail}`}>
                                {nicknameCheckMessage}
                            </p>
                        )}
                    </div>
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
                    <div>
                        <AuthInput
                            type='password'
                            id='passwordConfirm'
                            name='passwordConfirm'
                            label='비밀번호 확인'
                            placeholder='비밀번호를 다시 입력하세요'
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                        />
                        {passwordCheckMessage && (
                            <p className={`${styles.msg} ${isPasswordAvailable ? styles.success : styles.fail}`}>
                                {passwordCheckMessage}
                            </p>
                        )}
                    </div>

                    <div className={styles.checkbox_wrapper}>
                        <input
                            type='checkbox'
                            id='agree'
                            name='agree'
                            checked={isAgree}
                            onChange={e => setIsAgree(e.target.checked)}
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

                    <BasicButton type='submit' disabled={isPending || !isActive} isActive={isActive}>
                        회원가입
                    </BasicButton>
                </form>
            </section>
        </div>
    );
};

export default Join;
