import { fetchGlobalStyles } from '@/src/services/GlobalStylesService';
import { useEffect, useState } from 'react';

const useGlobalStyles = () => {
    const [styles, setStyles] = useState({
        color: '#ffffff',
        logo: '',
        slogan: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStyles = async () => {
            try {
                const data = await fetchGlobalStyles();
                setStyles(data);
            } catch (error) {
                console.error('Error loading global styles:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStyles();
    }, []);

    return { styles, loading };
};

export default useGlobalStyles;
