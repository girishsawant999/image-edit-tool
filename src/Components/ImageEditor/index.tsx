import React, { SyntheticEvent, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import RotateLeft from '../../Icons/RotateLeft';
import RotateRight from '../../Icons/RotateRight';
import './style.scss';
interface PixelCropData {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px' | '%';
}

interface ImageEditorProps {
  src: string;
  // eslint-disable-next-line no-unused-vars
  onSave?(url: string): void;
  maxWidth?: number;
  saveButtonText?: React.ReactNode;
  containerClassName?: string;
  imgClassName?: string;
  toolbarClassName?: string;
}

const ImageEditor = ({
  src,
  onSave,
  maxWidth = 600,
  saveButtonText = 'Save',
  containerClassName = '',
  imgClassName = '',
  toolbarClassName = ''
}: ImageEditorProps): JSX.Element => {
  const [pixelCropData, setPixelCropData] = useState<PixelCropData>({
    unit: 'px', // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [scale, setScale] = useState({
    x: 1,
    y: 1
  });
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageElement = useRef<HTMLImageElement | null>(null);

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>): void => {
    const { naturalHeight, naturalWidth, height, width } = e.target as HTMLImageElement;
    imageElement.current = e.target as HTMLImageElement;
    setIsImageLoaded(true);
    setScale({
      x: naturalWidth / width,
      y: naturalHeight / height
    });
    setPixelCropData({
      unit: 'px',
      x: 10,
      y: 10,
      width: width - 20,
      height: height - 20
    });
  };

  const onCropChange = (cropData: PixelCropData): void => {
    setPixelCropData(cropData);
  };

  const cropImage = (pixelCrop: PixelCropData): string => {
    const image = imageElement.current;
    if (!image) throw new Error('Image file not present');
    const canvas = document.createElement('canvas');

    const imageRatio = maxWidth / pixelCrop.width;
    canvas.width = maxWidth;
    canvas.height = pixelCrop.height * imageRatio;
    const ctx = canvas.getContext('2d');
    ctx &&
      ctx.drawImage(
        image,
        pixelCrop.x * scale.x,
        pixelCrop.y * scale.y,
        pixelCrop.width * scale.x,
        pixelCrop.height * scale.y,
        0,
        0,
        pixelCrop.width * imageRatio,
        pixelCrop.height * imageRatio
      );

    return canvas.toDataURL('image/jpeg', '1.0');
  };

  const onRotate = (counterClockWise = false): void => {
    const getRotatedImageURL = (): string => {
      const image = imageElement.current;
      if (!image) throw new Error('Image file not present');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.naturalHeight;
      canvas.height = image.naturalWidth;
      ctx && ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx && ctx.rotate(((counterClockWise ? 90 : -90) * Math.PI) / 180);
      ctx && ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      return canvas.toDataURL('image/jpeg', '1.0');
    };
    setImageSrc(getRotatedImageURL());
  };

  const onReset = (): void => {
    if (imageElement.current) {
      const { width, height } = imageElement.current;
      setPixelCropData({
        unit: 'px',
        x: 10,
        y: 10,
        width: width - 20,
        height: height - 20
      });
    }
    setImageSrc(src);
  };

  const handleSave = (): void => {
    onSave && onSave(cropImage(pixelCropData));
  };

  return (
    <div className={`image-edit-tool-container ${containerClassName}`}>
      <ReactCrop crop={pixelCropData} onChange={onCropChange}>
        <img
          loading="lazy"
          src={imageSrc}
          onLoad={onImageLoad}
          crossOrigin="anonymous"
          className={imgClassName}
        />
      </ReactCrop>
      <div className={`toolbar ${toolbarClassName}`}>
        <button data-button-name="reset" disabled={!isImageLoaded} onClick={onReset}>
          Reset
        </button>
        <button
          data-button-name="rotate-counter-clockwise"
          disabled={!isImageLoaded}
          onClick={(): void => onRotate()}
        >
          <RotateLeft />
        </button>
        <button
          data-button-name="rotate-clockwise"
          disabled={!isImageLoaded}
          onClick={(): void => onRotate(true)}
        >
          <RotateRight />
        </button>
        <button data-button-name="save" disabled={!isImageLoaded} onClick={handleSave}>
          <>{saveButtonText}</>
        </button>
      </div>
    </div>
  );
};
export default ImageEditor;
