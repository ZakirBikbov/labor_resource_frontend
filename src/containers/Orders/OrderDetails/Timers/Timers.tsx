
import React from 'react';
import Timer from './OrderTimer';
import { Statistic, Typography } from 'antd';
const { Countdown } = Statistic;
interface CountdownComponentProps {
    deadline?: number;
    orderDetails: { details?: any };
}

const CountdownComponent: React.FC<CountdownComponentProps> = ({ deadline, orderDetails }) => {
    if (!orderDetails.details || !deadline) {
        return null;
    }

    return (
        <>
            <Typography.Title level={5} style={{ marginBottom: '-20px' }}>Оставшееся время до начала работ</Typography.Title>
            <Countdown
                value={deadline}
                format={`HH:mm:ss`}
                valueStyle={{
                    textAlign: 'center',
                    fontSize: '64px'
                }}
                onFinish={() => console.log('Countdown finished!')}
            />
        </>
    );
};

interface CountUpComponentProps {
    responseId?: {
        end?: string;
        start?: string;
    };
}

const CountUpComponent: React.FC<CountUpComponentProps> = ({ responseId }) => {
    const endTime = responseId?.end;
    const startTime = responseId?.start;

    const getDurationString = (): string => {
        const start = new Date(startTime!).getTime();
        const end = new Date(endTime!).getTime();
        const duration = end - start;

        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration / (1000 * 60)) % 60);

        return `${hours} : ${minutes}`;
    };

    if (endTime && startTime) {
        const durationString = getDurationString();
        return <div>Отработано: {durationString}</div>;
    } else if (startTime) {
        const duration = new Date(startTime).getTime();
        return <Timer startTime={duration} />;
    }

    return null;
};

export { CountdownComponent, CountUpComponent };