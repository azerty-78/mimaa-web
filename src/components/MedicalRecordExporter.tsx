import React, { useState } from 'react';
import { 
  Download, 
  Close, 
  Description, 
  PictureAsPdf, 
  Image, 
  Medication,
  LocalHospital,
  Assignment,
  Schedule,
  Person,
  Emergency,
  CheckCircle
} from '@mui/icons-material';
import type { 
  User, 
  MedicalRecord, 
  MedicalPrescription, 
  EmergencyContact, 
  PregnancyRecord 
} from '../services/api-simple';

interface MedicalRecordExporterProps {
  patient: User;
  pregnancyRecord: PregnancyRecord | null;
  medicalRecords: MedicalRecord[];
  prescriptions: MedicalPrescription[];
  emergencyContacts: EmergencyContact[];
  onClose: () => void;
}

const MedicalRecordExporter: React.FC<MedicalRecordExporterProps> = ({
  patient,
  pregnancyRecord,
  medicalRecords,
  prescriptions,
  emergencyContacts,
  onClose
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'pdf' | 'csv'>('json');
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectAll = () => {
    if (selectedRecords.length === medicalRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(medicalRecords.map(record => record.id));
    }
  };

  const handleSelectRecord = (recordId: number) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const generateJSONExport = () => {
    const exportData = {
      patient: {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        phone: patient.phone,
        region: patient.region,
        profileType: patient.profileType,
        isActive: patient.isActive,
        createdAt: patient.createdAt
      },
      pregnancyRecord: pregnancyRecord ? {
        ...pregnancyRecord,
        // Ne pas inclure les données sensibles si nécessaire
      } : null,
      medicalRecords: medicalRecords
        .filter(record => selectedRecords.includes(record.id))
        .map(record => ({
          ...record,
          // Filtrer les pièces jointes si demandé
          attachments: includeAttachments ? record.attachments : undefined
        })),
      prescriptions: prescriptions.map(prescription => ({
        ...prescription,
        // Masquer les informations sensibles si nécessaire
      })),
      emergencyContacts: emergencyContacts.map(contact => ({
        name: contact.name,
        relationship: contact.relationship,
        phone: contact.phone,
        email: contact.email,
        isPrimary: contact.isPrimary
      })),
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'Système MIMAA',
        version: '1.0',
        format: 'JSON'
      }
    };

    return JSON.stringify(exportData, null, 2);
  };

  const generateCSVExport = () => {
    const headers = [
      'Type',
      'Titre',
      'Date',
      'Médecin',
      'Description',
      'Statut'
    ];

    const rows = medicalRecords
      .filter(record => selectedRecords.includes(record.id))
      .map(record => [
        record.recordType,
        record.title,
        new Date(record.date).toLocaleDateString(),
        `Dr. ${record.doctorId}`, // On pourrait récupérer le nom du médecin
        record.content?.diagnosis || record.content?.interpretation || record.content?.findings || '',
        'Complété'
      ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const generatePDFContent = () => {
    // Cette fonction générerait le contenu HTML pour la conversion en PDF
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Dossier médical - ${patient.firstName} ${patient.lastName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .record { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
            .record-type { font-weight: bold; color: #2563eb; }
            .record-date { color: #666; font-size: 0.9em; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Dossier médical</h1>
            <h2>${patient.firstName} ${patient.lastName}</h2>
            <p>Email: ${patient.email} | Téléphone: ${patient.phone}</p>
            <p>Région: ${patient.region}</p>
            <p>Exporté le: ${new Date().toLocaleDateString()}</p>
          </div>

          ${pregnancyRecord ? `
            <div class="section">
              <h3>Dossier de grossesse</h3>
              <p><strong>Semaine actuelle:</strong> ${pregnancyRecord.currentWeek} semaines</p>
              <p><strong>Date d'accouchement prévue:</strong> ${new Date(pregnancyRecord.dueDate).toLocaleDateString()}</p>
              <p><strong>IMC:</strong> ${pregnancyRecord.bmi}</p>
              <p><strong>Poids:</strong> ${pregnancyRecord.weightKg} kg</p>
              <p><strong>Taille:</strong> ${pregnancyRecord.heightCm} cm</p>
            </div>
          ` : ''}

          <div class="section">
            <h3>Dossiers médicaux</h3>
            ${medicalRecords
              .filter(record => selectedRecords.includes(record.id))
              .map(record => `
                <div class="record">
                  <div class="record-type">${record.recordType.toUpperCase()}</div>
                  <div class="record-date">${new Date(record.date).toLocaleDateString()}</div>
                  <h4>${record.title}</h4>
                  ${record.content?.diagnosis ? `<p><strong>Diagnostic:</strong> ${record.content.diagnosis}</p>` : ''}
                  ${record.content?.interpretation ? `<p><strong>Interprétation:</strong> ${record.content.interpretation}</p>` : ''}
                  ${record.content?.findings ? `<p><strong>Observations:</strong> ${record.content.findings}</p>` : ''}
                </div>
              `).join('')}
          </div>

          ${prescriptions.length > 0 ? `
            <div class="section">
              <h3>Prescriptions</h3>
              ${prescriptions.map(prescription => `
                <div class="record">
                  <h4>Prescription du ${new Date(prescription.date).toLocaleDateString()}</h4>
                  <ul>
                    ${prescription.medications.map(med => `
                      <li><strong>${med.name}</strong> - ${med.dosage} - ${med.frequency}</li>
                    `).join('')}
                  </ul>
                  ${prescription.notes ? `<p><strong>Notes:</strong> ${prescription.notes}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${emergencyContacts.length > 0 ? `
            <div class="section">
              <h3>Contacts d'urgence</h3>
              <table>
                <tr>
                  <th>Nom</th>
                  <th>Relation</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                </tr>
                ${emergencyContacts.map(contact => `
                  <tr>
                    <td>${contact.name}</td>
                    <td>${contact.relationship}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.email}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          ` : ''}
        </body>
      </html>
    `;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'json':
          content = generateJSONExport();
          filename = `dossier_${patient.firstName}_${patient.lastName}_${new Date().toISOString().slice(0, 10)}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          content = generateCSVExport();
          filename = `dossier_${patient.firstName}_${patient.lastName}_${new Date().toISOString().slice(0, 10)}.csv`;
          mimeType = 'text/csv';
          break;
        case 'pdf':
          // Pour le PDF, on génère le HTML et on utilise une librairie comme jsPDF
          // ou on ouvre une nouvelle fenêtre pour l'impression
          const pdfContent = generatePDFContent();
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(pdfContent);
            newWindow.document.close();
            newWindow.print();
          }
          setIsExporting(false);
          return;
        default:
          throw new Error('Format non supporté');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Download className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Exporter le dossier médical</h3>
              <p className="text-sm text-gray-600">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
          </div>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Format d'export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Format d'export
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                className={`p-3 rounded-lg border-2 text-center ${
                  exportFormat === 'json' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setExportFormat('json')}
              >
                <Description className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">JSON</div>
                <div className="text-xs text-gray-500">Complet</div>
              </button>
              <button
                className={`p-3 rounded-lg border-2 text-center ${
                  exportFormat === 'csv' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setExportFormat('csv')}
              >
                <Assignment className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">CSV</div>
                <div className="text-xs text-gray-500">Tableau</div>
              </button>
              <button
                className={`p-3 rounded-lg border-2 text-center ${
                  exportFormat === 'pdf' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setExportFormat('pdf')}
              >
                <PictureAsPdf className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">PDF</div>
                <div className="text-xs text-gray-500">Impression</div>
              </button>
            </div>
          </div>

          {/* Options d'export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options d'export
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeAttachments}
                  onChange={(e) => setIncludeAttachments(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Inclure les pièces jointes
                </span>
              </label>
            </div>
          </div>

          {/* Sélection des dossiers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Dossiers médicaux à exporter
              </label>
              <button
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={handleSelectAll}
              >
                {selectedRecords.length === medicalRecords.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
            </div>
            
            <div className="max-h-40 overflow-y-auto border rounded-lg">
              {medicalRecords.map((record) => (
                <label key={record.id} className="flex items-center p-3 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedRecords.includes(record.id)}
                    onChange={() => handleSelectRecord(record.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      {record.recordType === 'consultation' && <LocalHospital className="w-4 h-4 text-blue-600" />}
                      {record.recordType === 'laboratory' && <Assignment className="w-4 h-4 text-green-600" />}
                      {record.recordType === 'ultrasound' && <Image className="w-4 h-4 text-purple-600" />}
                      {record.recordType === 'prescription' && <Medication className="w-4 h-4 text-orange-600" />}
                      <span className="text-sm font-medium">{record.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.date).toLocaleDateString()} • {record.recordType}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Résumé de l'export</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Dossiers sélectionnés:</span>
                <span className="ml-2 font-medium">{selectedRecords.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Prescriptions:</span>
                <span className="ml-2 font-medium">{prescriptions.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Contacts d'urgence:</span>
                <span className="ml-2 font-medium">{emergencyContacts.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Dossier de grossesse:</span>
                <span className="ml-2 font-medium">{pregnancyRecord ? 'Oui' : 'Non'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={handleExport}
            disabled={isExporting || selectedRecords.length === 0}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordExporter;

