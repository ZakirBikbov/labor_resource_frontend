import { useState } from 'react';
import { Card, Button } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../../node_modules/swiper/swiper-bundle.min.css';


const serviceCardStyle: React.CSSProperties = {
    width: 300,
    margin: '10px',
    textAlign: 'center',
    cursor: 'pointer',
};

const iconStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
};

const serviceSelectionContainerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    flexWrap: 'wrap',
};

interface ServiceSelectionProps {
    onSelectService: (service: ServiceType) => void;
}

type ServiceType = 'loader' | 'transport';


const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelectService }) => {
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

    const handleSelectService = (service: ServiceType) => {
        setSelectedService(service);
        onSelectService(service);
    };

    return (
        <div style={serviceSelectionContainerStyle}>
            <Swiper
                effect={'coverflow'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                slidesPerView={1.2}
                centeredSlides={true}
            >
                <SwiperSlide>
                    <Card
                        hoverable
                        style={serviceCardStyle}
                        onClick={() => handleSelectService('loader')}
                    >
                        <Card.Meta
                            avatar={<img src="/worker_icon.svg" alt="Грузчик" style={iconStyle} />}
                            title="Грузчик"
                            description={
                                <div>
                                    <div>Стоимость:</div>
                                    <div style={{ fontWeight: 'bold', fontSize: 'larger' }}>5000 тг/час</div>
                                </div>
                            }
                        />
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card
                        hoverable
                        style={serviceCardStyle}
                        onClick={() => handleSelectService('transport')}
                    >
                        <Card.Meta
                            avatar={<img src="/truck_icon.svg" alt="Грузовой транспорт" style={iconStyle} />}
                            title="Грузовой транспорт"
                            description={
                                <div>
                                    <div>Стоимость:</div>
                                    <div style={{ fontWeight: 'bold', fontSize: 'larger' }}>8000 тг/час</div>
                                </div>
                            }
                        />
                    </Card>
                </SwiperSlide>
            </Swiper>

            {selectedService && (
                <Button type="primary" onClick={() => onSelectService(selectedService)}>Далее</Button>
            )}
        </div>
    );
};

export default ServiceSelection;