import { Phone, Trash2, Edit2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { whatsappService } from '../../services/whatsapp.service';
import AlertDialog from '../Common/AlertDialog';
import { useState } from 'react';

interface LeaderActionsProps {
  id: number;
  whatsapp?: string;
  onDelete: (id: number) => Promise<void>;
}

export default function LeaderActions({ id, whatsapp, onDelete }: LeaderActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleWhatsAppClick = () => {
    if (whatsapp) {
      const link = whatsappService.generateLink(whatsapp);
      window.open(link, '_blank');
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <Link
          to={`/lideranca/${id}`}
          className="p-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full transition-colors"
          title="Visualizar"
        >
          <Eye className="w-4 h-4" />
        </Link>
        <Link
          to={`/lideranca/editar/${id}`}
          className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-full transition-colors"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </Link>
        <button
          onClick={handleWhatsAppClick}
          className="p-2 text-green-500 hover:text-white hover:bg-green-500 rounded-full transition-colors"
          title="WhatsApp"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          await onDelete(id);
          setShowDeleteDialog(false);
        }}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta liderança? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
}