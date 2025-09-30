import React, { useState } from 'react';
import { 
  Close, 
  Download, 
  Print, 
  Visibility, 
  Description, 
  Image, 
  PictureAsPdf,
  Medication,
  LocalHospital,
  Assignment,
  Schedule
} from '@mui/icons-material';
import { MedicalRecord, MedicalPrescription, EmergencyContact, PregnancyRecord } from '../services/api';

interface MedicalRecordViewerProps {
  record: MedicalRecord;
  onClose: () => void;
  onExport?: (record: MedicalRecord) => void;
}

const MedicalRecordViewer: React.FC<MedicalRecordViewerProps> = ({ 
  record, 
  onClose, 
  onExport 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'attachments'>('content');

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <LocalHospital className="w-5 h-5" />;
      case 'laboratory':
        return <Assignment className="w-5 h-5" />;
      case 'ultrasound':
        return <Image className="w-5 h-5" />;
      case 'prescription':
        return <Medication className="w-5 h-5" />;
      default:
        return <Description className="w-5 h-5" />;
    }
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'Consultation';
      case 'laboratory':
        return 'Analyses de laboratoire';
      case 'ultrasound':
        return 'Échographie';
      case 'prescription':
        return 'Prescription';
      default:
        return 'Autre';
    }
  };

  const renderConsultationContent = (content: any) => (
    <div className="space-y-4">
      {content.chiefComplaint && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Motif de consultation</h4>
          <p className="text-gray-700">{content.chiefComplaint}</p>
        </div>
      )}
      
      {content.history && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Antécédents</h4>
          <p className="text-gray-700">{content.history}</p>
        </div>
      )}
      
      {content.examination && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Examen clinique</h4>
          <div className="space-y-3">
            {content.examination.vitalSigns && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-medium text-gray-700 mb-2">Signes vitaux</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(content.examination.vitalSigns).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600">{key}:</span>
                      <span className="ml-1 font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {content.examination.abdominalExamination && (
              <div>
                <h5 className="font-medium text-gray-700 mb-1">Examen abdominal</h5>
                <p className="text-gray-600">{content.examination.abdominalExamination}</p>
              </div>
            )}
            
            {content.examination.fetalHeartRate && (
              <div>
                <h5 className="font-medium text-gray-700 mb-1">Rythme cardiaque fœtal</h5>
                <p className="text-gray-600">{content.examination.fetalHeartRate}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {content.diagnosis && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Diagnostic</h4>
          <p className="text-gray-700">{content.diagnosis}</p>
        </div>
      )}
      
      {content.treatment && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Traitement</h4>
          <p className="text-gray-700">{content.treatment}</p>
        </div>
      )}
      
      {content.followUp && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Suivi</h4>
          <p className="text-gray-700">{content.followUp}</p>
        </div>
      )}
    </div>
  );

  const renderLaboratoryContent = (content: any) => (
    <div className="space-y-4">
      {content.tests && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Résultats d'analyses</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 text-left">Test</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Valeur</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Valeurs normales</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {content.tests.map((test: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-2">{test.name}</td>
                    <td className="border border-gray-300 px-3 py-2 font-medium">{test.value}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-600">{test.normalRange}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        test.status === 'normal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {test.status === 'normal' ? 'Normal' : 'Anormal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {content.interpretation && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Interprétation</h4>
          <p className="text-gray-700">{content.interpretation}</p>
        </div>
      )}
    </div>
  );

  const renderUltrasoundContent = (content: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Âge gestationnel</h4>
          <p className="text-gray-700">{content.gestationalAge}</p>
        </div>
        
        {content.estimatedWeight && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Poids estimé</h4>
            <p className="text-gray-700">{content.estimatedWeight}</p>
          </div>
        )}
      </div>
      
      {content.fetalMeasurements && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Mensurations fœtales</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(content.fetalMeasurements).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600 mb-1">{key}</div>
                <div className="font-semibold text-lg">{value as string}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {content.findings && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Observations</h4>
          <p className="text-gray-700">{content.findings}</p>
        </div>
      )}
      
      {content.recommendations && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Recommandations</h4>
          <p className="text-gray-700">{content.recommendations}</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (record.recordType) {
      case 'consultation':
        return renderConsultationContent(record.content);
      case 'laboratory':
        return renderLaboratoryContent(record.content);
      case 'ultrasound':
        return renderUltrasoundContent(record.content);
      default:
        return (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contenu</h4>
            <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
              {JSON.stringify(record.content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(record);
    } else {
      // Export par défaut
      const dataStr = JSON.stringify(record, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dossier_${record.title}_${new Date(record.date).toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            {getRecordTypeIcon(record.recordType)}
            <div>
              <h3 className="text-lg font-bold text-gray-800">{record.title}</h3>
              <p className="text-sm text-gray-600">
                {getRecordTypeLabel(record.recordType)} • {new Date(record.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded hover:bg-gray-200"
              onClick={handleExport}
              title="Exporter"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              onClick={handlePrint}
              title="Imprimer"
            >
              <Print className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              onClick={onClose}
              title="Fermer"
            >
              <Close className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'content' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('content')}
          >
            <Description className="w-4 h-4 mr-2 inline" />
            Contenu
          </button>
          {record.attachments && record.attachments.length > 0 && (
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'attachments' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('attachments')}
            >
              <Image className="w-4 h-4 mr-2 inline" />
              Pièces jointes ({record.attachments.length})
            </button>
          )}
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'content' ? (
            renderContent()
          ) : (
            <div className="space-y-4">
              {record.attachments?.map((attachment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {attachment.type === 'pdf' ? (
                        <PictureAsPdf className="w-8 h-8 text-red-600" />
                      ) : (
                        <Image className="w-8 h-8 text-blue-600" />
                      )}
                      <div>
                        <h5 className="font-medium">{attachment.name}</h5>
                        <p className="text-sm text-gray-600">
                          {attachment.type.toUpperCase()} • {attachment.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-3 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <Visibility className="w-4 h-4 mr-1" />
                        Voir
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = attachment.url;
                          link.download = attachment.name;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Créé le {new Date(record.createdAt).toLocaleDateString()}
              {record.updatedAt !== record.createdAt && (
                <span> • Modifié le {new Date(record.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
            <div>
              ID: {record.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordViewer;

