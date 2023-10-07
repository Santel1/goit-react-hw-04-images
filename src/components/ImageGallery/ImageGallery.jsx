import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

export const ImagaGallery = ({ images, openModal }) => {
  const showImages = Array.isArray(images) && images.length !== 0;

  return (
    <ul className={css.ImageGallery}>
      {showImages &&
        images.map(image => {
          return (
            <ImageGalleryItem
              key={image.id}
              image={image.webformatURL}
              largeImage={image.largeImageURL}
              openModal={openModal}
            />
          );
        })}
    </ul>
  );
};
