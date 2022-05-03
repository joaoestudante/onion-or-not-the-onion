import axios from 'axios';

export interface Post {
  title: string;
  url: string;
}

function normalizeTitle(title: string) {
  return title.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export function getTheOnionRandom() {
  return axios.get('https://old.reddit.com/r/theonion/random.json')
    .then(function(response) {
      const postItself = response.data[0].data.children[0].data;
      // console.log('New onion post: ');
      // console.log(postItself.title);
      return {title: normalizeTitle(postItself.title), url: postItself.url};
    }).catch(function(error) {
      return Promise.reject(error);
  })
}


export function getNotTheOnionRandom() {
  return axios.get('https://old.reddit.com/r/nottheonion/random.json')
    .then(function(response) {
      const postItself = response.data[0].data.children[0].data;
      // console.log('New NotTheOnion post: ');
      // console.log(postItself.title);
      return {title: normalizeTitle(postItself.title), url: postItself.url};
    }).catch(function(error) {
      return Promise.reject(error);
    })
}
