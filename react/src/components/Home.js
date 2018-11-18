import React from 'react';
import $ from 'jquery';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY, API_ROOT } from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import { WrappedAroundMap } from './AroundMap'

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;



export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
        loadingPosts: false,
        error: '',
        posts: [],
    }

    componentDidMount() {
        this.setState({ loadingGeoLocation: true, error: '' });
        this.getGeolocation();
    }

    getGeolocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS,
            );
        } else {
            console.log('No Geolocation');
        }
    }


    onSuccessLoadGeoLocation = (position) => {
        console.log(position);

        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));
        this.setState({ loadingGeoLocation: false, error: '' });
        // console.log('onsuccess');
        this.loadNearbyPosts();
    }


    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geo location..."/>;
        } else if (this.state.loadingPosts) {
            return <Spin tip="Loading posts..."/>;
        } else if (this.state.posts && this.state.posts.length > 0) {
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                }
            });
            return <Gallery images={images}/>;

        }
    }

    loadNearbyPosts = (location, range) => {
        this.setState({loadingPosts: true, error: ''});
        const { lat, lon } = location || JSON.parse(localStorage.getItem(POS_KEY));
        const radius = range || 20;

        return $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${radius}`,
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            },
        }).then((response) => {
            this.setState({ posts: response || [], loadingPosts: false, error: '' });
            console.log(response);
        }, (error) => {
            this.setState({ loadingPosts: false, error: error.responseText });
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });

    }


    onFailedLoadGeolocation = (error) => {
        console.log(error);
        this.setState({ loadingGeoLocation: false, error: 'Failed to load geo location!' });
    }


    render() {
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;

        return (
            <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    <WrappedAroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        posts={this.state.posts}
                        loadNearbyPosts={this.loadNearbyPosts}
                    />
                </TabPane>
            </Tabs>
        );
    }
}


const imageList = [
    {   user: 'user1',
        src: "https://c7.staticflickr.com/9/8106/28941228886_86d1450016_b.jpg",
        thumbnail: "https://c7.staticflickr.com/9/8106/28941228886_86d1450016_n.jpg",
        thumbnailWidth: 271,
        thumbnailHeight: 320,
        caption: "Orange Macro (Tom Eversley - isorepublic.com)"
    },
    {   user: 'user2',
        src: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg",
        thumbnail: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 190,
        caption: "286H (gratisography.com)"
    },
    {   user: 'user3',
        src: "https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg",
        thumbnail: "https://c7.staticflickr.com/9/8569/28941134686_d57273d933_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 148,
        caption: "315H (gratisography.com)"
    },
    {   user: 'user4',
        src: "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg",
        thumbnail: "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 213,
        caption: "201H (gratisography.com)"
    },
    {   user: 'user5',
        src: "https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_n.jpg",
        thumbnailWidth: 248,
        thumbnailHeight: 320,
        caption: "Big Ben (Tom Eversley - isorepublic.com)"
    },
    {
        user: 'user6',
        src: "https://c1.staticflickr.com/9/8785/28687743710_870813dfde_h.jpg",
        thumbnail: "https://c1.staticflickr.com/9/8785/28687743710_3580fcb5f0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 113,
        caption: "Red Zone - Paris (Tom Eversley - isorepublic.com)"
    },
    {
        user: 'user7',
        src: "https://c6.staticflickr.com/9/8520/28357073053_cafcb3da6f_b.jpg",
        thumbnail: "https://c6.staticflickr.com/9/8520/28357073053_cafcb3da6f_n.jpg",
        thumbnailWidth: 313,
        thumbnailHeight: 320,
        caption: "Wood Glass (Tom Eversley - isorepublic.com)"
    },
    {
        user: 'user8',
        src: "https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_b.jpg",
        thumbnail: "https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 213,
        caption: "Flower Interior Macro (Tom Eversley - isorepublic.com)"
    }
]

