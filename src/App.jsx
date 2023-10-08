import { Modal } from 'components/Modal/Modal';
import { Searchbar } from './components/SearchBar/Searchbar';
import { ImagaGallery } from 'components/ImageGallery/ImageGallery';
import { useEffect, useState } from 'react';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { findImages } from 'services/api';
import { Error } from 'components/Error/Error';

export const App = () => {
  const [imagesState, setImagesState] = useState(null);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [searchedImagesState, setSearchedImagesState] = useState(null);
  const [pageState, setPageState] = useState(1);
  const [loadMoreState, setLoadMoreState] = useState(false);
  const [modalObjectState, setModalObjectState] = useState({
    isOpen: false,
    data: null,
  });

  useEffect(() => {
    const searchImages = async () => {
      await setImagesState(null);
      setSearchedImagesState(searchedImagesState);
      setPageState(1);
      try {
        setIsLoadingState(true);
        const images = await findImages(searchedImagesState, 1);
        setImagesState(images.hits);
        setLoadMoreState(images.hits.length < images.totalHits);
      } catch (error) {
        setErrorState(error.message);
      } finally {
        setIsLoadingState(false);
      }
    };
    searchImages();
  }, [searchedImagesState]);

  const loadMore = async () => {
    setIsLoadingState(true);
    try {
      const newImages = await findImages(searchedImagesState, pageState + 1);

      setImagesState(prevState => {
        setIsLoadingState(false);
        const updatedImages = [...prevState, ...newImages.hits];
        return updatedImages;
      });
      setPageState(pageState + 1);
    } catch (error) {
      setErrorState(error.message);
      setIsLoadingState(false);
    }
  };

  const handleSearchSubmit = event => {
    event.preventDefault();

    const searchedImages =
      event.currentTarget.elements.searchImages.value.toLowerCase();

    setSearchedImagesState(searchedImages);
    event.currentTarget.reset();
  };

  const openModal = modalData => {
    setIsLoadingState(true);
    setModalObjectState({
      isOpen: true,
      data: modalData,
    });
    window.addEventListener('keydown', onKeyDown);
  };

  const closeModal = () => {
    setIsLoadingState(false);
    setModalObjectState({
      isOpen: false,
      data: null,
    });

    window.removeEventListener('keydown', onKeyDown);
  };

  const onOverlayClick = event => {
    if (event.currentTarget === event.target) {
      closeModal();
    }
  };

  const onKeyDown = event => {
    if (event.code === 'Escape') {
      closeModal();
    }
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} />
      {isLoadingState && <Loader />}
      {errorState && <Error>{errorState}</Error>}
      <ImagaGallery images={imagesState} openModal={openModal} />
      {modalObjectState.isOpen && (
        <Modal closeModal={onOverlayClick} largeImage={modalObjectState.data} />
      )}
      {loadMoreState && <Button onClick={loadMore} />}
    </div>
  );
};
