const API_KEY = 'c116db33258d690ea68498890b6b24d7';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

/**
 * JSDoc-комментарий:
 * Fetches data from the Last.fm API.
 * @async
 * @param {Record<string, string>} params - API method parameters.
 * @returns {Promise<any>} The JSON response from the API.
 * @throws {Error} If the network response is not ok or API returns an error.
 */
export async function fetchData(params: Record<string, string>): Promise<any> {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    format: 'json',
    ...params,
  });

  const url = `${BASE_URL}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) {
      console.error(`Last.fm API Error ${data.error}: ${data.message}`);
      throw new Error(`Last.fm API error: ${data.message}`);
    }
    return data;
  } catch (error) {
    console.error('Fetch error details:', error);
    throw error;
  }
}

export const getImageUrl = (imageArray: any[], size: string): string => {
    if (imageArray && Array.isArray(imageArray)) {
        const image = imageArray.find(img => img.size === size);
        if (image && image['#text']) {
            return image['#text'];
        }
    }
    return 'https://placehold.co/170x170/282828/ffffff?text=?';
};