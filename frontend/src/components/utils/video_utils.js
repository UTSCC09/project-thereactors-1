import axios from "axios";
import { getConfig } from "environments";

// const googleApiKey = "AIzaSyBnQYcaj09zjH_6qY1vHuMBPGcNk0Dw7aw";
const googleApiKey = getConfig("googleApiKey");

export const getVideoId = (url) => {
    /**
     * Returns a valid video id from various youtube URLs for the same video
     * source: https://gist.github.com/takien/4077195
     */
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    return ID;
}

export const getVideoThumbnail = (url) => {
    return "https://img.youtube.com/vi/" + getVideoId(url) + "/0.jpg";
}

export const getValidLink = (url) => {
    return "https://www.youtube.com/watch?v=" + getVideoId(url);
}

export const isYtLink = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

export const getVideoTitle = async (url) => {
    let id = getVideoId(url);

    return await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
            part: 'snippet',
            id: id,
            key: googleApiKey,
        }
    }).then(res => res.data.items[0].snippet.title).catch((err)=>{console.log(err)});
}