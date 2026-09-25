import { useRef, useState } from 'react';
import pineappleIcon from '../../assets/images/kit-picker/pineapple-icon.svg';
import cameraIcon from '../../assets/images/skin-analysis-hero/camera-icon.svg';
import cameraOutlineIcon from '../../assets/images/skin-analysis-quiz/camera-outline-icon.svg';
import uploadIcon from '../../assets/images/skin-analysis-quiz/upload-icon.svg';
import QuizStepIndicator from './QuizStepIndicator';
import './QuizStepPhoto.css';

export default function QuizStepPhoto({ onPhotoSelected }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Envie um arquivo de imagem (JPG, PNG ou similar).');
      return;
    }

    setError('');
    onPhotoSelected(file);
  };

  return (
    <div className="quiz-photo">
      <QuizStepIndicator current={1} />

      <div className="quiz-photo__heading">
        <h2 className="quiz-photo__title">
          <span>TIRE UMA</span>
          <span className="quiz-photo__title-line2">
            <img className="quiz-photo__pineapple quiz-photo__pineapple--left" src={pineappleIcon} alt="" aria-hidden="true" />
            Selfie
            <img className="quiz-photo__pineapple quiz-photo__pineapple--right" src={pineappleIcon} alt="" aria-hidden="true" />
          </span>
        </h2>
        <p className="quiz-photo__subtitle">Rosto limpo, boa iluminação, sem maquiagem</p>
      </div>

      <button type="button" className="quiz-photo__dropzone" onClick={() => galleryInputRef.current?.click()}>
        <img src={cameraOutlineIcon} alt="" aria-hidden="true" />
        <span className="quiz-photo__dropzone-title">Envie sua selfie</span>
        <span className="quiz-photo__dropzone-subtitle">A IA escaneia seu rosto em segundos</span>
      </button>

      {error && <p className="quiz-photo__error" role="alert">{error}</p>}

      <div className="quiz-photo__actions">
        <button type="button" className="quiz-photo__btn quiz-photo__btn--primary" onClick={() => cameraInputRef.current?.click()}>
          <img src={cameraIcon} alt="" aria-hidden="true" />
          Tirar foto agora
        </button>
        <button type="button" className="quiz-photo__btn quiz-photo__btn--secondary" onClick={() => galleryInputRef.current?.click()}>
          <img src={uploadIcon} alt="" aria-hidden="true" />
          Escolher da minha galeria
        </button>
      </div>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="user" onChange={handleFileChange} hidden />
      <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
    </div>
  );
}
