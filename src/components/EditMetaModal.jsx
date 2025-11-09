import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Este modal recebe:
// - metaId: O ID da meta a ser editada
// - onClose: A função para fechar o modal
// - onSave: A função para atualizar a lista na AdminPage
function EditMetaModal({ metaId, onClose, onSave }) {
  const { token } = useAuth();
  
  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [valorMeta, setValorMeta] = useState(0);
  const [valorAtual, setValorAtual] = useState(0); // O Admin PODE editar o valor atual

  // Estados de feedback
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // 1. Buscar os dados da meta quando o modal abre
  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://instituto-alma-backend-production.up.railway.app/${metaId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados da meta.');
        
        const data = await response.json();
        // Preenche o formulário com os dados do banco
        setTitulo(data.titulo);
        setValorMeta(data.valor_meta);
        setValorAtual(data.valor_atual);
        
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeta();
  }, [metaId]); // Roda sempre que o ID da meta mudar


  // 2. Função para enviar a ATUALIZAÇÃO (PUT)
  const handleUpdateMeta = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      // Chama a rota PUT
      const response = await fetch(`https://instituto-alma-backend-production.up.railway.app/api/metas/${metaId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', // Desta vez é JSON, não FormData
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          titulo: titulo,
          valor_meta: valorMeta,
          valor_atual: valorAtual
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar meta');

      setFormSuccess(data.message); // "Meta atualizada com sucesso."
      onSave(); // Atualiza a tabela na AdminPage
      
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar meta:", err);
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Meta de Arrecadação</h2>

        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateMeta} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-meta-titulo" className="form-label">Título da Meta</label>
              <input type="text" id="edit-meta-titulo" className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-meta-valor" className="form-label">Valor da Meta (Ex: 10000.00)</label>
              <input type="number" step="0.01" id="edit-meta-valor" className="form-input" value={valorMeta} onChange={(e) => setValorMeta(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-meta-atual" className="form-label">Valor Atual (Ex: 7000.00)</label>
              <input type="number" step="0.01" id="edit-meta-atual" className="form-input" value={valorAtual} onChange={(e) => setValorAtual(e.target.value)} required />
            </div>
            
            {formError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{formSuccess}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Alterações</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditMetaModal;