import React, { useEffect, useState } from 'react';

interface StreamProps {
  cameraId: string;
}

export const Stream: React.FC<StreamProps> = ({ cameraId }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStream = async () => {
      try {
        const response = await fetch(`https://localhost:44385/video/stream/${cameraId}`);
        if (!response.ok) {
          throw new Error('Stream konnte nicht geladen werden');
        }
      } catch (error) {
        setError('Es ist ein Problem beim Laden des Streams aufgetreten.');
        console.error('Fehler beim Laden des Streams:', error);
      }
    };

    if (cameraId) {
      checkStream();
    }
  }, [cameraId]);

  return (
    <div>
      {error && <p>{error}</p>}
      <img
        id="videoStream"
        src={`https://localhost:44385/video/stream/${cameraId}`}
        width="640"
        height="480"
        alt="Live Stream"
      />
    </div>
  );
};
