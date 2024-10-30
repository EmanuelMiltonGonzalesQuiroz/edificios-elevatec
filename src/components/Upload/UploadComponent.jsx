import React, { useState } from 'react';
import Modal from 'react-modal';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../connection/firebase';
import { doc, setDoc, query, orderBy, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import MapComponent from '../Maps/MapComponent';

const UploadComponent = ({ triggerUpdate, collectionName, folderName, area }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [amount, setAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [contact, setContact] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const storage = getStorage();
  const { currentUser } = useAuth();

  const handleFilesChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleMapClick = (clickedLocation) => {
    setCoordinates(clickedLocation);
  };

  const handleUpload = async () => {
    const trimmedName = fileName.trim();
    const trimmedDescription = fileDescription.trim();
    const trimmedLocation = locationName.trim();
    const trimmedAmount = amount.trim();
    const trimmedContact = contact.trim();

    if (selectedFiles.length > 0 && trimmedName && trimmedDescription && coordinates && trimmedLocation) {
      setIsUploading(true);
      const collectionRef = collection(db, collectionName);
      const fileQuery = query(collectionRef, orderBy('id', 'desc'));
      const fileSnapshot = await getDocs(fileQuery);
      let nextId = 1;

      if (!fileSnapshot.empty) {
        const lastFileDoc = fileSnapshot.docs[0];
        const lastId = lastFileDoc.data().id.split('-').pop();
        nextId = parseInt(lastId) + 1;
      }

      const fileId = `ID-${collectionName}-${nextId.toString().padStart(3, '0')}`;
      const currentDate = new Date().toISOString().split('T')[0];

      try {
        const imageUrls = await Promise.all(
          selectedFiles.map(async (file) => {
            const fileRef = ref(storage, `${folderName}/${fileId}/${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
          })
        );

        await setDoc(doc(db, collectionName, fileId), {
          id: fileId,
          name: trimmedName,
          description: trimmedDescription,
          uploadedAt: currentDate,
          uploadedBy: currentUser.id,
          amount: trimmedAmount,
          expiryDate: expiryDate || null,
          contact: trimmedContact,
          state: 'active',
          imageUrls: imageUrls,
        });

        await setDoc(doc(db, 'locations', fileId), {
          locationName: trimmedLocation,
          coordinates: coordinates,
          state: collectionName
        });

        setSelectedFiles([]);
        setFileName('');
        setFileDescription('');
        setLocationName('');
        setCoordinates(null);
        setAmount('');
        setExpiryDate('');
        setContact('');
        triggerUpdate();
        setModalIsOpen(false);
      } catch (error) {
        console.error('Error uploading data:', error);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('Please fill in all required fields, including a valid location.');
    }
  };

  return (
    <div className="text-black">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalIsOpen(true)}
      >
        Agregar {area}
      </button>
  
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel={`Agregar ${area}`}
        className="fixed inset-0 bg-white border border-gray-300 shadow-lg p-6 rounded-lg max-w-[80vw] max-h-[100vh] overflow-auto mx-auto my-20 text-black"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-1"
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Agregar {area}</h2>
  
        {/* Aquí se aplica el overflow a ambas columnas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Título</label>
            <input
              type="text"
              placeholder="Título"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="mb-2 p-2 border border-gray-400 rounded w-full"
            />
  
            <label className="block font-bold mb-1">Descripción</label>
            <textarea
              placeholder="Descripción"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              className="mb-2 p-2 border border-gray-400 rounded w-full"
            />
  
            <label className="block font-bold mb-1">Monto</label>
            <input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-2 p-2 border border-gray-400 rounded w-full"
            />
  
            <label className="block font-bold mb-1">Fecha de Caducidad</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mb-2 p-2 border border-gray-400 rounded w-full"
            />
  
            <label className="block font-bold mb-1">Contacto</label>
            <input
              type="text"
              placeholder="Contacto"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mb-2 p-2 border border-gray-400 rounded w-full"
            />
  
            <label className="block font-bold mb-1">Imágenes</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              className="mb-2 p-2 border border-gray-400 rounded w-full"
            />
          </div>
  
          {/* Mapa y ubicación */}
          <div className="overflow-auto">
            <label className="block font-bold mb-1">Ubicación (Nombre del lugar)</label>
            <input
              type="text"
              placeholder="Ubicación (Nombre del lugar)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="mb-2 p-2 border border-gray-400 rounded w-full"
            />
  
            <MapComponent
              markerPosition={coordinates}
              handleMapClick={handleMapClick}
              isInteractive={true} // Permitir la selección de ubicación en este caso
            />
          </div>
        </div>
  
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4 flex items-center justify-center"
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="loader"></div>
          ) : (
            `Guardar ${area}`
          )}
        </button>
  
        <style jsx>{`
          .loader {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #ffffff;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
          }
  
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
  
        <button
          onClick={() => setModalIsOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
        >
          Cancelar
        </button>
      </Modal>
    </div>
  );
  
};

export default UploadComponent;
