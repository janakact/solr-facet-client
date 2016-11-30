import React from "react";
import {Map, CircleMarker, Popup, TileLayer} from "react-leaflet";

const position = [0, 0];

const DocMarker = ({children, doc, field, fields}) => (
    <CircleMarker
        color='red'
        fillColor='red'
        center={doc[field].split(",").map(parseFloat)}
        radius={5}>
        <Popup>
            <ul>
                { fields.map((fieldName) =>
                    <li key={fieldName}>
                        <b>{fieldName}</b>:{doc[fieldName]}
                    </li>)
                }
            </ul>
        </Popup>

    </CircleMarker>
)


var DataMap = ({data}) => {
    let locationSelect = "Location";
    return (<div>
        <select ref={node => {
            locationSelect = node
        }}
                defaultValue="Location">
            {data.columnNames.map((field, index) => <option key={field} value={field}>{field}</option>)}
        </select>

        <Map
            center={position}
            zoom={1}
            animate={true}
            id='map'>
            <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {data.docs.map((doc, index) =>
                <DocMarker
                    key={index}
                    doc={doc}
                    field={locationSelect}
                    fields={data.columnNames}
                />
            )}

        </Map>
    </div>)
}

export default DataMap;
