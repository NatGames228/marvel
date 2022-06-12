import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const { request, clearError, process, setProcess } = useHttp();

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

  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
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
    return res.data.results.map(_transformComics);
  }

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  }

  const _transformComics = (result) => {
    return {
      id: result.id,
      title: result.title,
      description: result.description || 'There is no description',
      thumbnail: result.thumbnail.path + '.' + result.thumbnail.extension,
      pageCount: result.pageCount ? `${result.pageCount} p.` : 'No information about the number of pages',
      language: result.textObjects.language || 'en-us',
      price: result.prices[0].price ?
        `${result.prices[0].price}$`
        : 'NOT AVAILABLE',
      homepage: result.urls[0].url,
    }
  }

  return { process, setProcess, getAllCharacters, getAllComics, getCharacter, getCharacterByName, getComic, clearError };
}

export default useMarvelService;
