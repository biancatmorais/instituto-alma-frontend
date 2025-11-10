import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Este componente é para editar Metas
function EditMetaModal({ metaId, onClose, onSave }) {
  const { token } = useAuth(); // O token é necessário
  
  // Estados do formulário (Exemplo para Metas)
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [prazo, setPrazo] = useState('');

  // Estados de feedback
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // 1. Buscar os dados da meta quando o modal abre (GET)
  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      setFormError(''); 
      
      if (!token) {
        setFormError('Erro de autenticação: Token não disponível.');
        setIsLoading(false);
        return;
      }

      try {
        // Corrigido: usando crases e endpoint correto
        const response = await fetch(`http://localhost:4000/api/metas/${metaId}`, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); 
          let errorMessage = `Falha ao buscar dados. Status: ${response.status}.`;
          
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch (e) {
            // Se não for JSON, usamos o status.
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        // Preenche o formulário com os dados do banco
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        setValor(data.valor);
        setPrazo(data.prazo);
        
      } catch (err) {
        setFormError(err.message); 
      } finally {
        setIsLoading(false);
      }
    };

    if (metaId && token) { 
      fetchMeta();
    }
  }, [metaId, token]);


  // 2. Função para enviar a ATUALIZAÇÃO (PUT)
  const handleUpdateMeta = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Verifica se o token existe antes de enviar
    if (!token) {
      setFormError('Sessão expirada. Por favor, faça login novamente.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/metas/${metaId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify({ titulo, descricao, valor, prazo })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar meta');

      setFormSuccess(data.message); 
      onSave(); 
      
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
        <h2>Editar Meta</h2>

        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateMeta} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-meta-titulo" className="form-label">Título da Meta</label>
              <input
                type="text"
                id="edit-meta-titulo"
                className="form-input"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-meta-desc" className="form-label">Descrição</label>
              <textarea
                id="edit-meta-desc"
                className="form-textarea"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="edit-meta-valor" className="form-label">Valor (R$)</label>
              <input
                type="number"
                id="edit-meta-valor"
                className="form-input"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-meta-prazo" className="form-label">Prazo (YYYY-MM-DD)</label>
              <input
                type="date"
                id="edit-meta-prazo"
                className="form-input"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                required
              />
            </div>

            {formError && (
              <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{formError}</p>
            )}
            {formSuccess && (
              <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{formSuccess}</p>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Salvar Alterações
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditMetaModal;