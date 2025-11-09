import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Este modal recebe:
// - documentoId: O ID do documento a ser editado
// - onClose: A função para fechar o modal
// - onSave: A função para atualizar a lista na AdminPage
function EditDocumentoModal({ documentoId, onClose, onSave }) {
  const { token } = useAuth();
  
  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [arquivo, setArquivo] = useState(null); // Para o NOVO ficheiro PDF

  // Estados de feedback
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Nome do ficheiro antigo (apenas para mostrar)
  const [oldFilename, setOldFilename] = useState('');

  // 1. Buscar os dados do documento quando o modal abre
  useEffect(() => {
    const fetchDocumento = async () => {
      setIsLoading(true);
      try {
        // Busca os dados do documento específico
        const response = await fetch(`https://instituto-alma-backend-production.up.railway.app/api/documentos/${documentoId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do documento.');
        
        const data = await response.json();
        // Preenche o formulário com os dados do banco
        setTitulo(data.titulo);
        setOldFilename(data.arquivo_url); // Guarda o nome do ficheiro antigo
        
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumento();
  }, [documentoId]); // Roda sempre que o ID do documento mudar


  // 2. Função para enviar a ATUALIZAÇÃO (PUT)
  const handleUpdateDocumento = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // FormData é necessário para enviar ficheiros
    const formData = new FormData();
    formData.append('titulo', titulo);
    
    // Anexa o NOVO ficheiro PDF (se o utilizador selecionou um)
    if (arquivo) {
      formData.append('arquivo', arquivo);
    }

    try {
      // Chama a rota PUT
      const response = await fetch(`https://instituto-alma-backend-production.up.railway.app/api/documentos/${documentoId}`, {
        method: 'PUT',
        headers: { 
          // NÃO defina 'Content-Type', o FormData faz isso
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar documento');

      setFormSuccess(data.message); // "Documento atualizado com sucesso."
      
      onSave(); // Atualiza a tabela na AdminPage
      
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar documento:", err);
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Documento</h2>

        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateDocumento} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-doc-titulo" className="form-label">Título do Documento</label>
              <input type="text" id="edit-doc-titulo" className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            
            <p style={{textAlign: 'center', fontWeight: 600, marginBottom: '15px'}}>
              Atenção: Enviar um novo PDF irá substituir permanentemente o antigo.
            </p>

            <div className="form-group">
              <label htmlFor="edit-doc-arquivo" className="form-label">Substituir PDF (Opcional)</label>
              <p style={{fontSize: '14px', marginBottom: '10px'}}>Ficheiro Atual: {oldFilename || 'Nenhum'}</p>
              <input 
                type="file" 
                id="edit-doc-arquivo" 
                className="form-input" 
                accept=".pdf" // Aceita apenas PDFs
                onChange={(e) => setArquivo(e.target.files[0])} 
              />
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

export default EditDocumentoModal;