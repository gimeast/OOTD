import styles from './home.module.scss';
import ProfileIcon from '../components/icons/ProfileIcon.tsx';
import testImg from '../assets/test.jpeg';
import test2Img from '../assets/test2.png';
import LikeIcon from '../components/icons/LikeIcon.tsx';
import ShareIcon from '../components/icons/ShareIcon.tsx';
import CommentIcon from '../components/icons/CommentIcon.tsx';
import BookmarkIcon from '../components/icons/BookmarkIcon.tsx';
import ImageNavIcon from '../components/icons/ImageNavIcon.tsx';

const Home = () => {
    return (
        <div className={styles.home}>
            <div className={styles.filter_btn_group}>
                <button className={styles.active}>최신순</button>
                <button>인기순</button>
            </div>

            <article className={styles.ootd_box}>
                <div className={styles.ootd_header}>
                    <ProfileIcon />
                    <span className={styles.nickname}>모델 민지</span>
                </div>

                <div className={styles.ootd_img_box}>
                    <ul className={styles.ootd_img_list}>
                        <li>
                            <img src={testImg} alt='OOTD 이미지' />
                        </li>
                        <li>
                            <img src={test2Img} alt='OOTD 이미지' />
                        </li>
                    </ul>

                    <ul className={styles.ootd_img_nav}>
                        <li>
                            <button>
                                <ImageNavIcon isActive={true} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <ImageNavIcon />
                            </button>
                        </li>
                    </ul>
                </div>

                <div className={styles.ootd_btn_group}>
                    <button>
                        <LikeIcon />
                    </button>
                    <button>
                        <CommentIcon />
                    </button>
                    <button>
                        <ShareIcon />
                    </button>
                    <button>
                        <BookmarkIcon />
                    </button>
                </div>
                <span className={styles.ootd_like}>좋아요 0개</span>

                <div className={styles.ootd_content}>
                    프로필을 만들고 나만의 OOTD를 공유해보세요! 🌟 다양한 스타일링 팁과 패션 아이디어를 만나보실 수
                    있어요.
                </div>

                <div className={styles.ootd_hashtags}>
                    <span>#OOTD</span>
                    <span>#패션</span>
                    <span>#스타일링</span>
                    <span>#데일리룩</span>
                    <span>#회원가입</span>
                </div>
            </article>
        </div>
    );
};

export default Home;
