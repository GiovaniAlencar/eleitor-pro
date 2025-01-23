import { Trash2, Eye, Check, X } from 'lucide-react';
import { useState } from 'react';
import AlertDialog from '../Common/AlertDialog';

interface UserActionsProps {
  id: number;
  status: 'active' | 'inactive' | 'pending';  // Ajustado para contemplar o status "pending"
  onDelete: (id: number) => Promise<void>;
  onStatusChange: (id: number, status: 'active' | 'inactive') => Promise<void>;
}

export default function UserActions({ id, status, onDelete, onStatusChange }: UserActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);
    const newStatus = status === 'active' ? 'inactive' : 'active';  // Alterna entre "active" e "inactive"
    await onStatusChange(id, newStatus);
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-end gap-2">

        {/* Botão de Excluir */}
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {/* Botão de Visualizar */}
        <button
          className="p-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full transition-colors"
          title="Visualizar"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Caixa de Confirmação para Exclusão */}
      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          await onDelete(id);  // Chama a função onDelete para excluir o usuário
          setShowDeleteDialog(false);
        }}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
}
