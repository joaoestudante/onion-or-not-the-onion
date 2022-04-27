import axios from 'axios';

export interface Post {
  title: string;
  url: string;
}

export function getTheOnionRandom() {
  return axios.get('https://old.reddit.com/r/theonion/random.json')
    .then(function(response) {
      const postItself = response.data[0].data.children[0].data;
      console.log('New onion post: ');
      console.log(postItself.title);
      return {title: postItself.title, url: postItself.url};
    }).catch(function(error) {
      return Promise.reject(error);
  })
}


export function getNotTheOnionRandom() {
  return axios.get('https://old.reddit.com/r/nottheonion/random.json')
    .then(function(response) {
      const postItself = response.data[0].data.children[0].data;
      console.log('New NotTheOnion post: ');
      console.log(postItself.title);
      return {title: postItself.title, url: postItself.url};
    }).catch(function(error) {
      return Promise.reject(error);
    })
}
