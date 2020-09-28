import Amplify, { API, graphqlOperation } from '@aws-amplify/api';
import awsConfig from './aws-exports';
import { createGif, updateGif } from './graphql/mutations';
import { listGifs } from './graphql/queries';
Amplify.configure(awsConfig);

let currentGifId = '';
const createNewGif = async (e) => {
  e.preventDefault();
  const gif = {
    altText: document.getElementById('altText').value,
    url: document.getElementById('url').value
  };

  try {
    const newGif = await API.graphql(
      graphqlOperation(createGif, { input: gif })
    );
    getGifs();
    document.getElementById('create-form').reset();
  } catch (err) {
    console.error(err);
  }
  getGifs();
};

const editGif = async (e) => {
  e.preventDefault();

  try {
    await API.graphql(
      graphqlOperation(updateGif, {
        input: {
          id: currentGifId,
          altText: document.getElementById('edit-altText').value,
          url: document.getElementById('edit-url').value
        }
      })
    );
  } catch (err) {
    console.error(err);
  }
  document.getElementById('edit-form').reset();
  getGifs();
};

const getGifs = async () => {
  const container = document.querySelector('.container');
  container.innerHTML = '';
  const gifs = await API.graphql(graphqlOperation(listGifs));
  gifs.data.listGifs.items.map((gif) => {
    const img = document.createElement('img');
    img.setAttribute('src', gif.url);
    img.setAttribute('alt', gif.altText);
    img.addEventListener('click', () => {
      currentGifId = gif.id;
      document.getElementById('edit-altText').value = gif.altText;
      document.getElementById('edit-url').value = gif.url;
      document.getElementById('edit-title').innerText = `Update ${gif.altText}`;
    });
    document.querySelector('.container').appendChild(img);
  });
};

document.getElementById('create-form').addEventListener('submit', createNewGif);
document.getElementById('edit-form').addEventListener('submit', editGif);
getGifs();
