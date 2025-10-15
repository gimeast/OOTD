import styles from './noResult.module.scss';

const NoResult = ({ icon, content1, content2 }: { icon: any; content1: string; content2: string }) => {
    return (
        <div className={styles.no_content}>
            {icon}
            <p>{content1}</p>
            <p>{content2}</p>
        </div>
    );
};

export default NoResult;
