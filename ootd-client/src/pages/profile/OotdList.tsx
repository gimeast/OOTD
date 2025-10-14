import styles from './ootdList.module.scss';
import testImg1 from '../../assets/test.png';
import testImg2 from '../../assets/test2.png';
import testImg3 from '../../assets/test3.jpg';
import testImg4 from '../../assets/test4.jpg';
import ProfileOotdAddIcon from '../../components/icons/ProfileOotdAddIcon.tsx';

const OotdList = () => {
    const imgList = [testImg1, testImg2, testImg3, testImg4];

    return (
        <>
            <h2 className='sr-only'>내가 올린 게시물 조회</h2>
            {imgList?.length ? (
                <ul className={styles.ootd_grid}>
                    {imgList.map((testImg, index) => (
                        <li key={index} className={styles.ootd_item}>
                            <img src={testImg} alt='' />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={styles.no_content}>
                    <ProfileOotdAddIcon />
                    <p>업로드한 게시물이 없어요</p>
                    <p>OOTD를 업로드해보세요!</p>
                </div>
            )}
        </>
    );
};

export default OotdList;
