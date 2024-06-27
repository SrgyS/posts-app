const LOCAL_STORAGE_KEY = 'postsPerPage';

export const getPostsPerPageFromStorage = (): number => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? Number(stored) : 10;
};

export const setPostsPerPageToStorage = (postsPerPage: number) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, postsPerPage.toString());
};
