import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '../../api';
import type { OotdItemType } from '../../types/ootd';
import OotdItem from '../home/OotdItem';
import styles from './ootdDetail.module.scss';

const OotdDetail = () => {
    const { ootdId } = useParams<{ ootdId: string }>();

    const { data: ootd } = useQuery({
        queryKey: ['ootd', 'detail', ootdId],
        queryFn: async (): Promise<OotdItemType> =>
            apiClient(API_ENDPOINTS.OOTD.DETAIL.replace('{ootdId}', String(ootdId))),
        enabled: !!ootdId,
    });

    if (!ootd) {
        return <div className={styles.error}>게시물을 찾을 수 없습니다.</div>;
    }

    return (
        <div className={styles.ootd_detail}>
            <OotdItem item={ootd} />
        </div>
    );
};

export default OotdDetail;
