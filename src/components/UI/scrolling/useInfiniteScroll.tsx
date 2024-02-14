import { useEffect } from "react";
const useInfiniteScroll = (callback: () => void, isLoading: boolean) => {
    useEffect(() => {
        if (isLoading) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Проверяем, что элемент пересекается и загрузка не идет
                if (entry.isIntersecting && !isLoading) {
                    callback();
                }
            },
            {
                rootMargin: '0px',
                threshold: 1.0,
            }
        );

        const sentinel = document.getElementById('infinite-scroll-sentinel');

        // Наблюдаем за sentinel элементом, если он есть
        if (sentinel) observer.observe(sentinel);

        // Прекращаем наблюдение, когда компонент размонтирован
        return () => observer.disconnect();
    }, [callback, isLoading]);

    // Здесь нет вызова callback() при инициализации
};

export default useInfiniteScroll;