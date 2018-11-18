import React  from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { POS_KEY } from '../constants';
import { AroundMarker} from './AroundMarker.js';

class AroundMap extends React.Component {
    reloadMarkers = () => {
        const center = this.map.getCenter();
        const location = { lat: center.lat(), lon: center.lng() };
        const range = this.getRange();
        console.log("location: ");
        console.log(location);
        console.log("range: ");
        console.log(range);
        this.props.loadNearbyPosts(location, range);
    }

    getRange = () => {
        const google = window.google;
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }



    getMapRef = (map) => {
        this.map = map;
        window.map = map;
    }



    render(){

        console.log("posts:");
        console.log(this.props.posts);
        console.log("posts222:");

        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap
                ref={this.getMapRef}
                onDragEnd={this.reloadMarkers}
                onZoomChanged={this.reloadMarkers}
                defaultZoom={3}
                defaultCenter={{ lat: lat, lng: lon }}
            >

                {
                    this.props.posts.map(
                        (post) =>( <AroundMarker
                            key = {post.url}
                            post = {post}
                        />)
                    )
                }


            </GoogleMap>
        );
    }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));