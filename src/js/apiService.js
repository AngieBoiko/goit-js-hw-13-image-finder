const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
const key = '22428506-9ce357bec79fea58fa453e43f';

export default async function fetchImages(search,page) {
    const response = await fetch(`${BASE_URL}&q=${search}&page=${page}&per_page=12&key=${key}`);
    if (!response.ok) {
        throw new Error('Make another request');
    }

    return await response.json();
};
