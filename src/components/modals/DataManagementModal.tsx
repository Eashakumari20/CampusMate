import React, { useState, useRef } from 'react';
import { X, Download, Upload, RotateCcw, AlertTriangle, CheckCircle2, Database } from 'lucide-react';
import { useCampusMate } from '../../context/CampusMateContext';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const { exportData, importData, resetToDemoData } = useCampusMate();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus('success');
        setTimeout(() => {
          setImportStatus('idle');
          onClose();
        }, 1200);
      } else {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetToDemoData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Semester Data Storage</h3>
              <p className="text-xs text-slate-500">Backup, transfer or reset your localStorage data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Export Semester Backup</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Download your classes, tasks, and notes as JSON</p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Import Backup File</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Restore data from a previously downloaded JSON file</p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Choose File</span>
              </button>
            </div>
          </div>

          {importStatus === 'success' && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Semester backup imported successfully!</span>
            </div>
          )}

          {importStatus === 'error' && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Invalid backup file format. Please check the JSON file.</span>
            </div>
          )}

          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl border border-red-100 bg-red-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-red-950">Reset to Demo State</h4>
                <p className="text-[11px] text-red-800/80 mt-0.5">Restore sample university curriculum & schedule</p>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>

            {showResetConfirm && (
              <div className="pt-2 border-t border-red-200/60 flex items-center justify-between gap-2">
                <span className="text-[11px] text-red-700 font-medium">Are you sure? Current changes will be overwritten.</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-xs"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
