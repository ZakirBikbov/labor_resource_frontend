import { getOrder, setIsModalOrderMap, updateCreateOrderFormField } from "@/app/order.slice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { ModalOrderMap } from "@/components/UI/Modal/ModalOrderMap";
import { useEffect, useState } from "react";

import {
    Map,
    YMapsApi,
    Placemark,
    MapState,
    MapStateBounds,
    MapStateCenter
} from "react-yandex-maps";

const AddressMap = () => {
    const { createOrderForm } = useAppSelector(store => store.order);
    const { orderData } = useAppSelector(store => store.order);
    const [geo, setGeo] = useState<(MapState & MapStateBounds) | null>();
    const [api, setApi] = useState<YMapsApi>();
    const [city, setCity] = useState<(MapState & MapStateBounds) | null>();
    const [bounds, setBounds] = useState<MapStateBounds | null>();
    const [isGeoLoaded, setIsGeoLoaded] = useState(false); // Добавленное состояние

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!api || !isGeoLoaded) {
            return;
        }
        api.geocode(createOrderForm.address, {
            boundedBy: bounds
        }).then((response: any) => {
            if (response.geoObjects.getLength() > 0) {
                setGeo(response.geoObjects.get(0));
            } else {
                setGeo(null);
            }
        });
    }, [api, createOrderForm.address, bounds, isGeoLoaded]);

    useEffect(() => {
        if (!api) {
            return;
        }
        api.geolocation.get().then((response: any) => {
            const cityGeoObject = response.geoObjects.get(0);
            setCity(cityGeoObject);
            setBounds(cityGeoObject.properties.get('boundedBy'));
            setIsGeoLoaded(true);
            console.log('geo: ', geo!.geometry.getCoordinates())
            const [lattitude, longitude] = geo!.geometry.getCoordinates();
            setGeoPosition(lattitude, longitude);
        });

    }, [api, createOrderForm.address]);

    let state: MapStateCenter = {
        center: [0, 0],
        zoom: 15
    };

    if (geo) {
        state.center = geo.geometry.getCoordinates();
    } else if (city) {
        state.center = city.geometry.getCoordinates();
    }

    const setGeoPosition = (newLat: string, newLng: string) => {
        dispatch(updateCreateOrderFormField({ field: 'lat', value: newLat }));
        dispatch(updateCreateOrderFormField({ field: 'lng', value: newLng }));
    }

    const handlePlacemarkDrag = (e: any) => {
        const newCoordinates = e.get('target').geometry.getCoordinates();
        const [newLat, newLng] = newCoordinates;

        if (api) {
            api.geocode(newCoordinates)
                .then((geoResponse: any) => {
                    const newGeoObject = geoResponse.geoObjects.get(0);
                    const newAddress = newGeoObject.properties.get('name');
                    dispatch(updateCreateOrderFormField({ field: 'address', value: newAddress }));
                    setGeoPosition(newLat, newLng);
                })
                .catch((error: any) => {
                    console.error('Ошибка при запросе адреса:', error);
                });
        }
    }

    const handlePlacemarkClick = async (id: number) => {
        await dispatch(getOrder(id.toString()));
        dispatch(setIsModalOrderMap(true));
    }

    return (
        <>
            <ModalOrderMap />
            <Map
                height={"100vh"}
                width={"100lvw"}
                state={state}
                onLoad={setApi}
            >
                {createOrderForm.address !== '' && geo && <Placemark
                    geometry={geo.geometry.getCoordinates()}
                    options={{ draggable: true, iconColor: '#FF5733' }}
                    onDragEnd={(e: Event) => handlePlacemarkDrag(e)}
                />}
                {typeof orderData.orders !== 'undefined' && orderData.orders.map(order =>
                    <Placemark
                        key={order.id}
                        geometry={[order.lat, order.lng]}
                        onClick={() => handlePlacemarkClick(order.id)} />
                )}
            </Map>
        </>
    );
};

export default AddressMap;
