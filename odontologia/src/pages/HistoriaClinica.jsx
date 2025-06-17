import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistoriaClinica = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    enfermedadesActuales: '',
    medicamentos: '',
    alergias: '',
    antecedentesFamiliares: '',
    apreciacionGeneral: '',
    apreciacionGeneralDetalle: '',
    examenRegional: '',
    examenRegionalDetalle: '',
    examenLocal: '',
    examenLocalDetalle: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/historia-clinica', formData);
      showNotification('success', 'Historia clínica guardada con éxito');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      showNotification('error', 'Error al guardar la historia clínica');
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          {/* Notificación */}
          {notification.show && (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white z-50`}>
              {notification.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Antecedentes Médicos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Antecedentes Médicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enfermedades Actuales
                  </label>
                  <textarea
                    value={formData.enfermedadesActuales}
                    onChange={(e) => handleInputChange('enfermedadesActuales', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicamentos
                  </label>
                  <textarea
                    value={formData.medicamentos}
                    onChange={(e) => handleInputChange('medicamentos', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergias
                  </label>
                  <textarea
                    value={formData.alergias}
                    onChange={(e) => handleInputChange('alergias', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Antecedentes Familiares
                  </label>
                  <textarea
                    value={formData.antecedentesFamiliares}
                    onChange={(e) => handleInputChange('antecedentesFamiliares', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Apreciación General/Examen Clínico */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Apreciación General/Examen Clínico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apreciación General
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="apreciacionGeneralNormal"
                        checked={formData.apreciacionGeneral === 'normal'}
                        onChange={() => handleInputChange('apreciacionGeneral', 'normal')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="apreciacionGeneralNormal" className="ml-2 block text-sm text-gray-700">
                        Normal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="apreciacionGeneralAlterado"
                        checked={formData.apreciacionGeneral === 'alterado'}
                        onChange={() => handleInputChange('apreciacionGeneral', 'alterado')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="apreciacionGeneralAlterado" className="ml-2 block text-sm text-gray-700">
                        Alterado
                      </label>
                    </div>
                    {formData.apreciacionGeneral === 'alterado' && (
                      <textarea
                        value={formData.apreciacionGeneralDetalle}
                        onChange={(e) => handleInputChange('apreciacionGeneralDetalle', e.target.value)}
                        placeholder="Detalle de la alteración"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Examen Regional
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="examenRegionalNormal"
                        checked={formData.examenRegional === 'normal'}
                        onChange={() => handleInputChange('examenRegional', 'normal')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="examenRegionalNormal" className="ml-2 block text-sm text-gray-700">
                        Normal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="examenRegionalAlterado"
                        checked={formData.examenRegional === 'alterado'}
                        onChange={() => handleInputChange('examenRegional', 'alterado')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="examenRegionalAlterado" className="ml-2 block text-sm text-gray-700">
                        Alterado
                      </label>
                    </div>
                    {formData.examenRegional === 'alterado' && (
                      <textarea
                        value={formData.examenRegionalDetalle}
                        onChange={(e) => handleInputChange('examenRegionalDetalle', e.target.value)}
                        placeholder="Detalle de la alteración"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Examen Local
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="examenLocalNormal"
                        checked={formData.examenLocal === 'normal'}
                        onChange={() => handleInputChange('examenLocal', 'normal')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="examenLocalNormal" className="ml-2 block text-sm text-gray-700">
                        Normal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="examenLocalAlterado"
                        checked={formData.examenLocal === 'alterado'}
                        onChange={() => handleInputChange('examenLocal', 'alterado')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="examenLocalAlterado" className="ml-2 block text-sm text-gray-700">
                        Alterado
                      </label>
                    </div>
                    {formData.examenLocal === 'alterado' && (
                      <textarea
                        value={formData.examenLocalDetalle}
                        onChange={(e) => handleInputChange('examenLocalDetalle', e.target.value)}
                        placeholder="Detalle de la alteración"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200 mt-8">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica; 