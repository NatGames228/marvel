

class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=1cbe2bf98e68c6fed4c49e2cc5ec10c0';

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  }

  getAllCharacters = async () => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    return res.data.results.map(this._transformCharacter)
  }

  getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    return this._transformCharacter(res.data.results[0]);
  }

  _transformCharacter = (result) => {
    return {
      name: result.name,
      description: result.description ? 
        result.description.length >= 210 ?
          `${result.description.slice(0, 210)}...`
          : result.description 
        : 'There is no description for this character',
      thumbnail: result.thumbnail.path + '.' + result.thumbnail.extension,
      homepage: result.urls[0].url,
      wiki: result.urls[1].url
    }
  }
}

export default MarvelService;
