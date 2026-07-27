// src/app/shared/utils/swal-config.ts
import Swal from 'sweetalert2';

export const ToastSwal = Swal.mixin({
  background: '#0f172a',
  color: '#f8fafc',
  confirmButtonColor: '#e11d48',
  cancelButtonColor: '#1e293b',
  buttonsStyling: true,
  customClass: {
    popup: 'border border-slate-800 rounded-2xl shadow-2xl',
    title: 'text-lg font-bold text-slate-100',
    htmlContainer: 'text-sm text-slate-400',
    confirmButton: 'px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition hover:bg-rose-500',
    cancelButton: 'px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 transition hover:bg-slate-700'
  }
});