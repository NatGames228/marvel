import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=1cbe2bf98e68c6fed4c49e2cc5ec10c0';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter)
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  }
  
  const _transformCharacter = (result) => {
    return {
      id: result.id,
      name: result.name,
      description: result.description ?
        result.description.length >= 210 ?
          `${result.description.slice(0, 210)}...`
          : result.description
        : 'There is no description for this character',
      thumbnail: result.thumbnail.path + '.' + result.thumbnail.extension,
      homepage: result.urls[0].url,
      wiki: result.urls[1].url,
      comics: result.comics.items,
    }
  }

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
    console.log(res)
    return res.data.results.map(_transformComics);
  }

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  }

  const _transformComics = (result) => {
    return {
      id: result.id,
      title: result.title,
      thumbnail: result.thumbnail.path + '.' + result.thumbnail.extension,
      price: result.prices[0].price ?
        `${result.prices[0].price}$`
        : 'NOT AVAILABLE',
      homepage: result.urls[0].url,
    }
  }

  return { loading, error, getAllCharacters, getAllComics, getCharacter, clearError };
}

export default useMarvelService;
