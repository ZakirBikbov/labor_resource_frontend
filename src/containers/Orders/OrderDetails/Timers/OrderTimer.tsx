import React, { useEffect, useState } from 'react';

interface TimerProps {
    startTime: number; 
}

const Timer: React.FC<TimerProps> = ({ startTime }) => {
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    useEffect(() => {
        const tick = () => {
            setElapsedTime(new Date().getTime() - new Date(startTime).getTime());
        };

        const timerId = setInterval(tick, 1000);

        tick();

        return () => clearInterval(timerId);
    }, [startTime]);

    const formatElapsedTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
            .map((val) => (val < 10 ? `0${val}` : `${val}`))
            .join(':');
    };

    return (
        <div>
            Отработано: {formatElapsedTime(elapsedTime)}
        </div>
    );
};

export default Timer;