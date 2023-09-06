import React, { useRef, useEffect, useState } from "react";
import 'ol/ol.css';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import {Style, Fill, Stroke } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from "ol/layer/Vector";
import OSM from 'ol/source/OSM';
import VectorSource from "ol/source/Vector";
import DragBox from 'ol/interaction/DragBox';
import Draw from "ol/interaction/Draw";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import kotabandung from '../assets/3273-kota-bandung.json';
import { MdOutlinePolyline } from "react-icons/md";
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import { TbPointFilled } from "react-icons/tb";
import { BsHexagon, BsPencil } from "react-icons/bs";
import { ImUndo } from "react-icons/im";

function MainMap() {
    const mapRef = useRef();  
    const [map, setMap] = useState(null);
    const [draw, setDraw] = useState(null);
    const [source] = useState(new VectorSource());
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        const olMap = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            new VectorLayer({
              source: source
            }),
          ],
          view: new View({
            center: fromLonLat([118.8186111, -1.15]),
            zoom: 5.34,
          }),
        });

        const storedPolyline = localStorage.getItem('drawPolyline');
        if (storedPolyline) {
            const coords = JSON.parse(storedPolyline);
            const features = new Feature({
                geometry: new LineString(coords)
            });
            source.addFeature(features);
        }

        const storedPoint = localStorage.getItem('drawPoint');
        if (storedPoint) {
            const coords = JSON.parse(storedPoint);
            const features = new Feature({
                geometry: new Point(coords)
            });
            source.addFeature(features);
        }

        const storedPolygon = localStorage.getItem('drawPolygon');
        if (storedPolygon) {
            const coords = JSON.parse(storedPolygon);
            const features = new Feature({
                geometry: new Polygon(coords)
            });
            source.addFeature(features);
        }
    
        setMap(olMap);

        const bandungStyle = new Style({
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.5)'
            }),
            stroke: new Stroke({
                color: 'blue',
                width: 2
            })
        })

        const bandungLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(kotabandung, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }),
            }),
            style: bandungStyle
        });

        olMap.addLayer(bandungLayer);
      
        return () => olMap.setTarget(undefined);
    },[source]);


    const startZoomArea = () => {
        setIsZooming(!isZooming);
        if(!isZooming) {
            const dragBox = new DragBox();
            map.addInteraction(dragBox);
            dragBox.on('boxend', () => {
                const extent = dragBox.getGeometry().getExtent();
                map.getView().fit(extent,{ 
                    size: map.getSize(),
                    duration: 250,
                    Zoom: 7.5
                });
                setIsZooming(false);
                map.removeInteraction(dragBox);
            });
        } else {
            map.removeInteraction(
                map
                    .getInteractions()
                    .getArray()
                    .find((interaction) => interaction instanceof DragBox)
            );
        }
    }

    const startDrawingPolyline = () => {
        if (draw) {
            map.removeInteraction(draw);
        }
        const newDraw = new Draw({
            source: source,
            type: 'LineString',
        });
        newDraw.on('drawend', (event) => {
            const coords = event.feature.getGeometry().getCoordinates();
            localStorage.setItem('drawPolyline', JSON.stringify(coords));
        });
        map.addInteraction(newDraw);
        setDraw(newDraw);
    }

    const startDrawingPoint = () => {
        if (draw) {
            map.removeInteraction(draw);
        }
        const newDraw = new Draw({
            source: source,
            type: 'Point',
        });
        newDraw.on('drawend', (event) => {
            const coords = event.feature.getGeometry().getCoordinates();
            localStorage.setItem('drawPoint', JSON.stringify(coords));
        });
        map.addInteraction(newDraw);
        setDraw(newDraw);
    }

    const startDrawingPolygon = () => {
        if (draw) {
            map.removeInteraction(draw);
        }
        const newDraw = new Draw({
            source: source,
            type: 'Polygon',
        });
        newDraw.on('drawend', (event) => {
            const coords = event.feature.getGeometry().getCoordinates();
            localStorage.setItem('drawPolygon', JSON.stringify(coords));
        });
        map.addInteraction(newDraw);
        setDraw(newDraw);
    }

    const stopDrawing = () => {
        if (draw) {
            map.removeInteraction(draw);
            setDraw(null);
        }
    }

    const undoDrawing = () => {
        const features = source.getFeatures();
        if (features.length > 0) {
            source.removeFeature(features[features.length - 1]);
        }
    }

    return (
        <div className="w-full h-full">
            <div ref={mapRef} className="absolute top-0 left-0 right-0 bottom-0"/>
            <aside className="z-30 text-white absolute right-6 top-14 sm:top-14 md:top-14 lg:top-14">
                <nav className="absolute right-0 w-fit p-1 flex flex-col justify-center items-center gap-1 rounded-large">
                    <button 
                        onClick={startZoomArea} 
                        className="bg-blue-500 text-white p-2 rounded">
                        <HiOutlinePlusCircle size={20}/>
                    </button>
                    <button onClick={stopDrawing} className="bg-red-500 text-white p-2 rounded">
                        <BsPencil size={20}/>
                    </button>
                    <button onClick={undoDrawing} className="bg-gray-500 text-white p-2 rounded">
                        <ImUndo size={20}/> 
                    </button>
                    <button onClick={startDrawingPolyline} className="bg-green-500 text-white p-2 rounded">
                        <MdOutlinePolyline size={20} />
                    </button>
                    <button onClick={startDrawingPoint} className="bg-green-500 text-white p-2 rounded">
                        <TbPointFilled size={20} />
                    </button>
                    <button onClick={startDrawingPolygon} className="bg-green-500 text-white p-2 rounded">
                        <BsHexagon size={20}/>
                    </button>
                </nav>
            </aside>
        </div>
    );
};

export default MainMap;
